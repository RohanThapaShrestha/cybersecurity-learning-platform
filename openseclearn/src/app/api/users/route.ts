import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { withAdmin } from '@/lib/withAdmin';
import { getAllUsers, isDbAvailable } from '@/lib/memoryAuth';

// GET /api/users — Admin only: list all users
// Response is sanitized: password_hash is NEVER included
export const GET = withAdmin(async (_req: NextRequest) => {
  const dbOk = await isDbAvailable(pool);

  if (dbOk) {
    try {
      const result = await pool.query(
        `SELECT u.id, u.name, u.email, r.name AS role, u.created_at,
                p.completion_percentage, p.last_activity
         FROM users u
         JOIN roles r ON r.id = u.role_id
         LEFT JOIN progress p ON p.user_id = u.id
         ORDER BY u.created_at DESC`
      );
      // DB query already selects only safe columns (no password_hash)
      return NextResponse.json({ users: result.rows });
    } catch {
      // Fall through to memory
    }
  }

  // In-memory fallback — explicitly omit password_hash
  const users = getAllUsers().map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    created_at: u.created_at,
    completion_percentage: u.completion_percentage,
    last_activity: u.last_activity,
  }));

  return NextResponse.json({ users });
});
