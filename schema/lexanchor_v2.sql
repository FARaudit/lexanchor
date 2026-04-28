-- LexAnchor v2 schema additions.
-- Idempotent. Apply against lexanchor-production.

-- user_preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name     TEXT,
  timezone         TEXT DEFAULT 'America/Chicago',
  sidebar_pinned   BOOLEAN NOT NULL DEFAULT true,
  alerts_enabled   BOOLEAN NOT NULL DEFAULT true,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS users_own_prefs ON user_preferences;
CREATE POLICY users_own_prefs ON user_preferences
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- matters
CREATE TABLE IF NOT EXISTS matters (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('vendor','employment','ip','litigation','ma','regulatory','real_estate','other')),
  status      TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','negotiating','executed','closed','on_hold')),
  parties     JSONB,
  key_dates   JSONB,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS matters_user_idx ON matters (user_id, status);
ALTER TABLE matters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS users_own_matters ON matters;
CREATE POLICY users_own_matters ON matters
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- contracts
CREATE TABLE IF NOT EXISTS contracts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  type          TEXT,
  parties       JSONB,
  start_date    DATE,
  end_date      DATE,
  renewal_date  DATE,
  value         NUMERIC(14,2),
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','expired','terminated','draft')),
  obligations   JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS contracts_user_renewal_idx ON contracts (user_id, renewal_date);
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS users_own_contracts ON contracts;
CREATE POLICY users_own_contracts ON contracts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- clause_patterns — global market-standard library, service-role write
CREATE TABLE IF NOT EXISTS clause_patterns (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clause_type         TEXT NOT NULL,
  risk_level          TEXT,
  is_market_standard  BOOLEAN,
  percentile          INT,
  description         TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE clause_patterns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS authed_read_patterns ON clause_patterns;
CREATE POLICY authed_read_patterns ON clause_patterns
  FOR SELECT USING (auth.role() = 'authenticated');

-- la_intelligence_corpus — every analyzed clause teaches the engine
CREATE TABLE IF NOT EXISTS la_intelligence_corpus (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_id           BIGINT,
  clause_type           TEXT,
  risk_flags            TEXT[],
  negotiation_outcome   TEXT,
  metadata              JSONB,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS la_corpus_user_idx ON la_intelligence_corpus (user_id, clause_type);
ALTER TABLE la_intelligence_corpus ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS users_own_corpus ON la_intelligence_corpus;
CREATE POLICY users_own_corpus ON la_intelligence_corpus
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- la_regulatory_briefs — daily regulatory watch output
CREATE TABLE IF NOT EXISTS la_regulatory_briefs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  content       TEXT NOT NULL,
  topics        TEXT[],
  metadata      JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS la_reg_briefs_date_idx ON la_regulatory_briefs (brief_date);
ALTER TABLE la_regulatory_briefs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS authed_read_reg_briefs ON la_regulatory_briefs;
CREATE POLICY authed_read_reg_briefs ON la_regulatory_briefs
  FOR SELECT USING (auth.role() = 'authenticated');
