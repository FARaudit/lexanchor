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
