# LexAnchor — Founder E2E checklist

**Founder account:** jose@lexanchor.ai
**Production URL:** https://lexanchor.ai

Run after each major deploy. Mark each step PASS / FAIL and paste the table into `outputs/e2e-lexanchor.txt`.

---

## Setup
- [ ] Browser cookies cleared
- [ ] Vercel latest deploy is live for `main`
- [ ] Supabase lexanchor-production migrations applied per `schema/MIGRATIONS.md`
- [ ] Required env vars present: `ANTHROPIC_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`

## Account creation
1. Go to **https://lexanchor.ai/signup**
2. Verify the form is real signup — email + password fields with `supabase.auth.signUp()` — NOT a waitlist
3. Create account with `jose@lexanchor.ai` and a 12+ char password
4. On success, redirect to `/dashboard`

## Dashboard
5. Stat cards render: Documents Analyzed · Clauses Saved · Risks Flagged · Active Matters
6. Morning Brief streams (Claude SSE)
7. Risk exposure gauge shows `0/100` on a fresh account

## Analyze flow
8. Navigate to `/analyze`
9. Toggle to **Paste text** mode
10. Paste the test contract:
    ```
    CONTRACTOR agrees to provide SERVICES for a period of 12 months.
    COMPANY may terminate this agreement with 30 days written notice.
    Contractor waives right to any future claims. Non-compete clause:
    Contractor shall not work for any competitor for 2 years after termination.
    COMPANY owns all work product created during and after this agreement.
    ```
11. Click **Run analysis** → redirects to `/analyze/<id>`
12. Verify P0/P1/P2 risk cards render — at least 2 risks flagged (non-compete duration, post-termination IP)
13. Verify document_type classified (Service Agreement / Employment / IP / etc.)
14. Click **Save to library** on one clause card
15. Click **Download PDF** in header — branded PDF downloads

## Library
16. Navigate to `/library` — saved clause appears
17. Filter by doc type → matches
18. Select 2 clauses → side-by-side compare panel renders + StreamingText analysis

## Matters
19. Navigate to `/matters` → click **+ New matter**
20. Create matter `Acme MSA review` · type `vendor` · status `negotiating` · parties `Acme Corp, Counterparty Inc`
21. Verify it appears in the Negotiating group

## Contracts
22. Navigate to `/contracts` → click **+ New contract**
23. Create contract with renewal date 60 days from today
24. Verify it appears in the **Upcoming renewals (≤90 days)** warn-bordered panel with day count

## Playbook
25. Navigate to `/playbook` — saved clause from step 14 appears under its doc type
26. StreamingText surfaces inferred 3 standard positions

## Settings + deletion
27. Navigate to `/settings` — Profile section + Danger Zone
28. **Delete account** → 30-second countdown → **Cancel** — verify NOT deleted

---

## Report

```
                                        PASS / FAIL
1.  Real signup (not waitlist)          [   ]
2.  Account creation                    [   ]
3.  Dashboard renders                   [   ]
4.  Morning Brief streams               [   ]
5.  Analyze paste-text mode             [   ]
6.  P0/P1/P2 flags appear               [   ]
7.  Save clause to library              [   ]
8.  Download PDF works                  [   ]
9.  Library compare 2 clauses           [   ]
10. Matters CRUD                        [   ]
11. Contracts renewal warning           [   ]
12. Playbook surfaces patterns          [   ]
13. Delete countdown + cancel           [   ]
```
