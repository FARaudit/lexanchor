-- LexAnchor saved clauses — user-flagged clauses across all their analyses.
-- Run in lexanchor-production Supabase. Idempotent.

CREATE TABLE IF NOT EXISTS saved_clauses (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  analysis_id BIGINT REFERENCES analyses(id) ON DELETE CASCADE,
  clause_name TEXT,
  clause_text TEXT,
  risk_level TEXT,                     -- P0 / P1 / P2 / standard
  doc_type TEXT,
  explanation TEXT,
  citation TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_clauses_user ON saved_clauses(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_clauses_analysis ON saved_clauses(analysis_id);
CREATE INDEX IF NOT EXISTS idx_saved_clauses_risk ON saved_clauses(risk_level);

ALTER TABLE saved_clauses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_see_own_clauses" ON saved_clauses
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
