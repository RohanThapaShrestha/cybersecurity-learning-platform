import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import pool from '@/lib/db';
import { hashPassword } from '@/lib/password';
import { logger } from '@/lib/logger';
import { verifyResetToken } from '@/lib/otpStore';
import { findUserByEmail, isDbAvailable, updateUserPassword } from '@/lib/memoryAuth';

const ResetPasswordSchema = z.object({
  email: z.string().email().transform(v => v.toLowerCase()),
  resetToken: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters').max(100),
});

// POST /api/auth/reset-password
// Resets the password using a verified reset token
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ResetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, resetToken, newPassword } = parsed.data;

    // Verify the reset token
    const tokenEmail = verifyResetToken(resetToken);

    if (!tokenEmail || tokenEmail !== email) {
      logger.authWarn('Invalid or expired reset token', { email });
      return NextResponse.json(
        { error: 'Invalid or expired reset token. Please restart the process.' },
        { status: 400 }
      );
    }

    // Hash the new password
    const newHash = await hashPassword(newPassword);

    // Update in DB first
    const dbOk = await isDbAvailable(pool);
    let updated = false;

    if (dbOk) {
      try {
        const result = await pool.query(
          'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id',
          [newHash, email]
        );
        updated = result.rows.length > 0;
      } catch {
        // Fall through to memory
      }
    }

    // Try in-memory if DB didn't work
    if (!updated) {
      const memUser = findUserByEmail(email);
      if (!memUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      updateUserPassword(email, newHash);
      updated = true;
    }

    logger.auth('Password reset successfully', { email });

    return NextResponse.json({
      message: 'Password has been reset successfully. You can now log in with your new password.',
    });
  } catch (err) {
    logger.error('Reset password error', { error: String(err) });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
