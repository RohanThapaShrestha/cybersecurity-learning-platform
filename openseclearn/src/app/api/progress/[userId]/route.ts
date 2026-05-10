import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { withAdmin } from '@/lib/withAdmin';
import { JWTPayload } from '@/lib/auth';
import { getUserById, getProgress, isDbAvailable } from '@/lib/memoryAuth';

// GET /api/progress/:userId — Admin only: view any user's progress
export const GET = withAdmin(
  async (
    _req: NextRequest,
    _admin: JWTPayload,
    context?: { params: Promise<Record<string, string>> }
  ) => {
    const params = await context?.params;
    const userId = params?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const dbOk = await isDbAvailable(pool);

    if (dbOk) {
      try {
        const result = await pool.query(
          `SELECT u.id, u.name, u.email, p.*
           FROM users u
           LEFT JOIN progress p ON p.user_id = u.id
           WHERE u.id = $1`,
          [userId]
        );

        if (result.rows.length === 0) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ progress: result.rows[0] });
      } catch {
        // Fall through to memory
      }
    }

    // In-memory fallback
    const memUser = getUserById(userId);
    if (!memUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const p = getProgress(userId);
    return NextResponse.json({
      progress: {
        id: memUser.id,
        name: memUser.name,
        email: memUser.email,
        ...p,
      },
    });
  }
);
