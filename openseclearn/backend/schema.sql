-- OpenSecLearn PostgreSQL Schema
-- Run: psql -d openseclearn -f backend/schema.sql

-- ============================================================
-- ROLES
-- ============================================================
CREATE TABLE IF NOT EXISTS roles (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO roles (name) VALUES ('user'), ('admin')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role_id       INT NOT NULL DEFAULT 1 REFERENCES roles(id) ON DELETE RESTRICT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================
-- PROGRESS
-- ============================================================
CREATE TABLE IF NOT EXISTS progress (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  completed_lessons     JSONB NOT NULL DEFAULT '[]',
  completed_homework    JSONB NOT NULL DEFAULT '[]',
  current_stage         VARCHAR(100) NOT NULL DEFAULT 'fundamentals',
  completion_percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
  last_activity         TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);

-- ============================================================
-- HOMEWORK SUBMISSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS homework_submissions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  homework_id  VARCHAR(100) NOT NULL,
  answer_text  TEXT,
  status       VARCHAR(20) NOT NULL DEFAULT 'submitted'
                CHECK (status IN ('submitted', 'reviewed', 'passed')),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, homework_id)
);

CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON homework_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_homework_id ON homework_submissions(homework_id);

-- ============================================================
-- AUTO-UPDATE updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS progress_updated_at ON progress;
CREATE TRIGGER progress_updated_at
  BEFORE UPDATE ON progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
