import { Pool } from 'pg';

declare global {
  // Prevent multiple pool instances in development (Next.js hot reload)
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

function createPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
}

const pool: Pool = global.__pgPool ?? createPool();

if (process.env.NODE_ENV !== 'production') {
  global.__pgPool = pool;
}

export default pool;
