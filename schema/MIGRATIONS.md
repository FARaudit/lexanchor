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
