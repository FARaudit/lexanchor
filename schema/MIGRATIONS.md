# LexAnchor migration manifest

Apply against **lexanchor-production** in this order. Each file is idempotent.

```sql
-- 1. Foundation (already deployed)
\i waitlist.sql
\i analyses.sql
\i saved_clauses.sql

-- 2. v2 schema (matters, contracts, intelligence corpus, regulatory briefs, user prefs)
\i lexanchor_v2.sql

-- 3. Empire layer
\i model_runs.sql
\i security_agent.sql
```

## Apply via Supabase SQL Editor

1. https://supabase.com/dashboard/project/<lexanchor-production>/sql/new
2. Paste each file in order above
3. Run

## Verify

```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = false;
-- Expected: empty.

SELECT proname FROM pg_proc WHERE proname IN ('rls_status_check', 'auth_failures_24h', 'new_users_24h');
-- Expected: 3 rows.
```

---

## V5 — Education progress tracking

```sql
create table if not exists user_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  surface text not null,
  step_key text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, surface, step_key)
);

alter table user_progress enable row level security;

create policy "user_progress_self_select"
  on user_progress for select using (auth.uid() = user_id);

create policy "user_progress_self_insert"
  on user_progress for insert with check (auth.uid() = user_id);

create policy "user_progress_self_delete"
  on user_progress for delete using (auth.uid() = user_id);

create index if not exists user_progress_user_surface_idx
  on user_progress (user_id, surface);
```

### Verify

```sql
select tablename from pg_tables where tablename = 'user_progress';
select polname from pg_policies where tablename = 'user_progress';
```

---

## V7 — Customer health score + onboarding sequences

```sql
-- Customer health score — scales to 10K customers with no rework
create table if not exists customer_health (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique,
  company_name text,
  subscription_tier text default 'free',
  last_active_at timestamptz,
  core_feature_count integer default 0,
  churn_risk_score integer default 0 check (churn_risk_score between 0 and 100),
  health_score integer default 100 check (health_score between 0 and 100),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table customer_health enable row level security;

create policy "users_view_own_health" on customer_health
  for select using (auth.uid() = user_id);

create or replace function update_updated_at()
returns trigger as $func$
begin new.updated_at = now(); return new; end;
$func$ language plpgsql;

drop trigger if exists customer_health_updated_at on customer_health;
create trigger customer_health_updated_at
  before update on customer_health
  for each row execute function update_updated_at();

create or replace view churn_risk_customers as
  select user_id, company_name, subscription_tier,
         last_active_at, churn_risk_score, health_score
  from customer_health
  where last_active_at < now() - interval '14 days'
     or last_active_at is null
  order by churn_risk_score desc;

-- Onboarding sequence tracking
create table if not exists onboarding_sequences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  day0_sent_at timestamptz,
  day3_sent_at timestamptz,
  day7_sent_at timestamptz,
  created_at timestamptz default now()
);

alter table onboarding_sequences enable row level security;

create policy "users_view_own_onboarding" on onboarding_sequences
  for select using (auth.uid() = user_id);
```

### Verify

```sql
select tablename from pg_tables where tablename in ('customer_health','onboarding_sequences');
select viewname from pg_views where viewname = 'churn_risk_customers';
```
