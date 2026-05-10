import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/logger';
import { verifyOTP, createResetToken } from '@/lib/otpStore';

const VerifyOTPSchema = z.object({
  email: z.string().email().transform(v => v.toLowerCase()),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

// POST /api/auth/verify-otp
// Verifies the OTP and returns a short-lived reset token
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = VerifyOTPSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input. Please enter a valid email and 6-digit code.' },
        { status: 400 }
      );
    }

    const { email, otp } = parsed.data;
    const result = verifyOTP(email, otp);

    if (!result.valid) {
      logger.authWarn('OTP verification failed', { email, reason: result.reason });
      return NextResponse.json(
        { error: result.reason || 'Invalid OTP.' },
        { status: 400 }
      );
    }

    // OTP is valid — issue a short-lived reset token
    const resetToken = createResetToken(email);

    logger.auth('OTP verified successfully', { email });

    return NextResponse.json({
      message: 'OTP verified. You can now set a new password.',
      resetToken,
    });
  } catch (err) {
    logger.error('Verify OTP error', { error: String(err) });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
