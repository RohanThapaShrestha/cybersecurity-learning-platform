import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { withAuth } from '@/lib/withAuth';
import { JWTPayload } from '@/lib/auth';
import { getProgress, isDbAvailable } from '@/lib/memoryAuth';

// GET /api/progress/me — authenticated user's own progress
export const GET = withAuth(async (_req: NextRequest, user: JWTPayload) => {
  const dbOk = await isDbAvailable(pool);

  if (dbOk) {
    try {
      const result = await pool.query(
        `SELECT p.*, 
                jsonb_array_length(p.completed_lessons) AS lessons_count,
                jsonb_array_length(p.completed_homework) AS homework_count
         FROM progress p
         WHERE p.user_id = $1`,
        [user.userId]
      );

      if (result.rows.length === 0) {
        // Create progress row if missing
        const created = await pool.query(
          `INSERT INTO progress (user_id) VALUES ($1) RETURNING *`,
          [user.userId]
        );
        return NextResponse.json({ progress: created.rows[0] });
      }

      return NextResponse.json({ progress: result.rows[0] });
    } catch {
      // Fall through to memory
    }
  }

  // In-memory fallback
  const p = getProgress(user.userId);
  return NextResponse.json({ progress: p });
});
