/**
 * OpenSecLearn Database Setup Script
 * Run: node backend/setup.js
 *
 * This script:
 *   1. Connects to PostgreSQL using DATABASE_URL from .env.local
 *   2. Creates all tables (roles, users, progress, homework_submissions)
 *   3. Seeds default admin and a test user
 */

const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// Load .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...rest] = trimmed.split('=');
      process.env[key.trim()] = rest.join('=').trim();
    }
  }
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌  DATABASE_URL not found in .env.local');
  process.exit(1);
}

const schema = `
-- ROLES
CREATE TABLE IF NOT EXISTS roles (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);
INSERT INTO roles (name) VALUES ('user'), ('admin') ON CONFLICT (name) DO NOTHING;

-- USERS
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

-- PROGRESS
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

-- HOMEWORK SUBMISSIONS
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

-- AUTO update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS progress_updated_at ON progress;
CREATE TRIGGER progress_updated_at BEFORE UPDATE ON progress FOR EACH ROW EXECUTE FUNCTION update_updated_at();
`;

// Default credentials
const ADMIN_EMAIL    = 'admin';
const ADMIN_PASSWORD = 'admin';
const ADMIN_NAME     = 'Admin';

const USER_EMAIL    = 'user';
const USER_PASSWORD = 'user';
const USER_NAME     = 'Demo User';

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });

  try {
    console.log('🔗  Connecting to PostgreSQL...');
    await client.connect();
    console.log('✅  Connected\n');

    console.log('📐  Creating tables...');
    await client.query(schema);
    console.log('✅  Tables created / verified\n');

    // Seed admin
    const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    const adminResult = await client.query(
      `INSERT INTO users (name, email, password_hash, role_id)
       VALUES ($1, $2, $3, 2)
       ON CONFLICT (email) DO UPDATE SET role_id = 2
       RETURNING id`,
      [ADMIN_NAME, ADMIN_EMAIL, adminHash]
    );
    const adminId = adminResult.rows[0].id;
    await client.query(
      `INSERT INTO progress (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING`,
      [adminId]
    );
    console.log('👑  Admin account ready');
    console.log(`    Email   : ${ADMIN_EMAIL}`);
    console.log(`    Password: ${ADMIN_PASSWORD}\n`);

    // Seed demo user
    const userHash = await bcrypt.hash(USER_PASSWORD, 12);
    const userResult = await client.query(
      `INSERT INTO users (name, email, password_hash, role_id)
       VALUES ($1, $2, $3, 1)
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [USER_NAME, USER_EMAIL, userHash]
    );
    if (userResult.rows.length > 0) {
      await client.query(
        `INSERT INTO progress (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING`,
        [userResult.rows[0].id]
      );
    }
    console.log('👤  Demo user account ready');
    console.log(`    Email   : ${USER_EMAIL}`);
    console.log(`    Password: ${USER_PASSWORD}\n`);

    console.log('🎉  Setup complete! Run: npm run dev');
  } catch (err) {
    console.error('\n❌  Setup failed:', err.message);
    if (err.message.includes('password authentication')) {
      console.error('\n💡  Fix: Update DATABASE_URL in .env.local with your correct PostgreSQL password');
    } else if (err.message.includes('does not exist')) {
      console.error('\n💡  Fix: Create the database first:');
      console.error('         createdb openseclearn');
    } else if (err.message.includes('ECONNREFUSED')) {
      console.error('\n💡  Fix: Make sure PostgreSQL is running on localhost:5432');
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
