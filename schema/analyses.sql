-- LexAnchor analyses — one row per document analysis.
-- Run in lexanchor-production Supabase. Idempotent.

CREATE TABLE IF NOT EXISTS analyses (
  id BIGSERIAL PRIMARY KEY,
  document_type TEXT,
  filename TEXT,
  user_id UUID REFERENCES auth.users(id),

  -- Three-call outputs
  overview_summary TEXT,
  overview_json JSONB,
  clauses_summary TEXT,
  clauses_json JSONB,
  risks_summary TEXT,
  risks_json JSONB,

  -- Composite
  risk_score INTEGER,                      -- 0-100
  recommendation TEXT,                     -- SIGN | NEGOTIATE | DO_NOT_SIGN
  plain_english_summary TEXT,

  -- Workflow
  status TEXT DEFAULT 'pending',           -- pending | processing | complete | failed
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_analyses_user ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_status ON analyses(status);
CREATE INDEX IF NOT EXISTS idx_analyses_created ON analyses(created_at DESC);

ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_see_own_analyses" ON analyses
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
