import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import pool from '@/lib/db';
import { logger } from '@/lib/logger';
import { findUserByEmail, isDbAvailable } from '@/lib/memoryAuth';
import { createOTP, isOtpRateLimited } from '@/lib/otpStore';
import { sendOTPEmail } from '@/lib/mailer';

const ForgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address').transform(v => v.toLowerCase()),
});

// POST /api/auth/forgot-password
// Generates OTP and sends it to the user's email
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ForgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    // Rate limit OTP requests per email
    if (isOtpRateLimited(email)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in 15 minutes.' },
        { status: 429 }
      );
    }

    // Check if user exists (DB first, then memory)
    let userExists = false;

    const dbOk = await isDbAvailable(pool);
    if (dbOk) {
      try {
        const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        userExists = result.rows.length > 0;
      } catch {
        // Fall through to memory
      }
    }

    if (!userExists) {
      const memUser = findUserByEmail(email);
      userExists = !!memUser;
    }

    // Always return success to prevent user enumeration
    // But only actually send OTP if user exists
    if (userExists) {
      const otp = createOTP(email);
      const result = await sendOTPEmail(email, otp);

      if (result.devMode) {
        logger.auth('OTP generated (dev mode — logged to console)', { email });
      } else if (result.success) {
        logger.auth('OTP email sent', { email });
      } else {
        logger.error('Failed to send OTP email', { email });
        return NextResponse.json(
          { error: 'Failed to send email. Please try again later.' },
          { status: 500 }
        );
      }
    } else {
      logger.authWarn('Forgot password for non-existent email', { email });
    }

    return NextResponse.json({
      message: 'If an account with that email exists, we\'ve sent a verification code.',
    });
  } catch (err) {
    logger.error('Forgot password error', { error: String(err) });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
