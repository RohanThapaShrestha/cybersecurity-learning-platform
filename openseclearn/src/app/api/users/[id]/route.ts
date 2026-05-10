import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { withAdmin } from '@/lib/withAdmin';
import { JWTPayload } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { deleteUser, getUserById, isDbAvailable } from '@/lib/memoryAuth';

// DELETE /api/users/:id — Admin only
// Includes confirmation logging for audit trail
export const DELETE = withAdmin(
  async (
    _req: NextRequest,
    admin: JWTPayload,
    context?: { params: Promise<Record<string, string>> }
  ) => {
    const params = await context?.params;
    const userId = params?.id;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Prevent admin from deleting themselves
    if (userId === admin.userId) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    const dbOk = await isDbAvailable(pool);

    if (dbOk) {
      try {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id, email', [
          userId,
        ]);

        if (result.rows.length === 0) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Audit log with full deletion details
        logger.deleteUser(admin.userId, admin.email, userId, result.rows[0].email);

        return new NextResponse(null, { status: 204 });
      } catch {
        // Fall through to memory
      }
    }

    // In-memory fallback
    const memUser = getUserById(userId);
    if (!memUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    deleteUser(userId);

    // Audit log with full deletion details
    logger.deleteUser(admin.userId, admin.email, userId, memUser.email);

    return new NextResponse(null, { status: 204 });
  }
);
