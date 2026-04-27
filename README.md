# LexAnchor — AI Legal Intelligence

Senior-attorney-grade contract review in 60 seconds. Every clause analyzed, every risk flagged, every term in plain English. **Information only — not legal advice.**

Stack: Next.js 16 (App Router) · Tailwind v4 · Supabase (lexanchor-production) · Anthropic Claude.

## Quick start

```bash
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY
npm install
npm run dev
```

## Routes

| Path | Auth | Notes |
|---|---|---|
| `/` | public | Landing + waitlist |
| `/login` | public | Magic-link auth |
| `/auth/callback` | public | Supabase OTP exchange |
| `/dashboard` | required | Library of past analyses |
| `/analyze` | required | Document upload form |
| `/analyze/[id]` | required | Analysis result — plain English summary, red flags, clauses, overview |
| `/api/waitlist` | public POST | Email capture → `waitlist` table |
| `/api/analyze` | required POST | PDF upload → 3-call Claude analysis → `analyses` table |

## Schemas

Run once in Supabase lexanchor-production SQL editor:

- `schema/waitlist.sql` — landing-page signups
- `schema/analyses.sql` — analyses + per-user RLS policy

## Design system

| Token | Hex | Use |
|---|---|---|
| `bg` | `#1A1A2E` | Deep charcoal canvas |
| `surface` | `#16213E` | Trust navy |
| `gold` | `#C9A84C` | Legal gold accent |
| `text` | `#F8F5F0` | Cream body |
| `text-2` | `#B8B5AE` | Muted |

Display: Fraunces. Body: Source Serif 4. Mono: JetBrains Mono.

## UPL compliance

Every page footer + the analyze result page footer carry the disclosure:

> LexAnchor provides information only — not legal advice — and does not represent you, take instructions from you, or form an attorney-client relationship. For material decisions, consult a licensed attorney.

The `analyze-engine.ts` system prompt enforces this in the LLM output: no "you should", no "I recommend", no advice framing. Outputs are descriptive ("this clause says…") and informational ("a clause like this typically…"), with negotiation suggestions framed as questions to ask, not instructions to follow.

## Three-call architecture

`lib/analyze-engine.ts` runs Overview, Clauses, Risks in parallel via `Promise.all`. PDFs pass natively to Claude as a document content block (no PDF parsing library needed). Composite risk score is the average of Claude's self-reported score and a heuristic based on red-flag severity counts.

## Deploy

1. Create a Vercel project from this repo
2. Set env vars from `.env.example`
3. In Supabase Auth → URL Configuration: add `https://<your-domain>/auth/callback`
4. Run schema files in Supabase SQL editor
5. Push to main → Vercel auto-deploys

## Status

- [x] Foundation scaffold complete
- [x] Magic-link auth
- [x] Three-call analyze engine (Overview · Clauses · Risks)
- [x] PDF upload + magic-byte validation + 10MB cap
- [x] Result page with red flags, clauses, overview
- [x] UPL compliance language throughout
- [x] Waitlist API + table
- [ ] Vercel production deploy
- [ ] Stripe + paid tier rollout
