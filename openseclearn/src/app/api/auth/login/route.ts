import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import pool from '@/lib/db';
import { comparePassword } from '@/lib/password';
import { signToken } from '@/lib/auth';
import { checkRateLimit, resetRateLimit } from '@/lib/rateLimit';
import { logger } from '@/lib/logger';
import { findUserByEmail, validatePassword, isDbAvailable } from '@/lib/memoryAuth';

const LoginSchema = z.object({
  email: z.string().min(1, 'Email or username is required').transform(v => v.toLowerCase()),
  password: z.string().min(1, 'Password is required'),
});

function buildSuccessResponse(token: string, userData: { id: string; name: string; email: string; role: string }) {
  const response = NextResponse.json({
    token,
    user: userData,
  });

  // Set cookie server-side so middleware can read it immediately
  response.cookies.set('openseclearn-token', token, {
    path: '/',
    maxAge: 60 * 60, // 1 hour
    sameSite: 'lax',
    httpOnly: false, // client needs to read it
  });

  return response;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1';

  // Rate limiting
  const { allowed, remaining } = checkRateLimit(ip);
  if (!allowed) {
    logger.authWarn('Rate limit exceeded', { ip });
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again in 15 minutes.' },
      {
        status: 429,
        headers: {
          'Retry-After': '900',
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // Try database first, fall back to in-memory auth
    const dbOk = await isDbAvailable(pool);

    if (dbOk) {
      try {
        const result = await pool.query(
          `SELECT u.id, u.name, u.email, u.password_hash, r.name AS role
           FROM users u
           JOIN roles r ON r.id = u.role_id
           WHERE u.email = $1`,
          [email]
        );

        if (result.rows.length > 0) {
          const user = result.rows[0];
          const passwordMatch = await comparePassword(password, user.password_hash);

          if (!passwordMatch) {
            logger.authWarn('Login attempt – wrong password', { email, ip, remaining });
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
          }

          resetRateLimit(ip);

          const token = signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
          });

          logger.auth('User logged in (DB)', { userId: user.id, email: user.email });

          return buildSuccessResponse(token, {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          });
        }
      } catch {
        // DB query failed, fall through to memory auth
        logger.authWarn('DB query failed, using memory auth', { email });
      }
    }

    // In-memory fallback auth
    const memUser = findUserByEmail(email);
    if (!memUser) {
      logger.authWarn('Login attempt – user not found', { email, ip });
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const passwordMatch = await validatePassword(password, memUser.password_hash);
    if (!passwordMatch) {
      logger.authWarn('Login attempt – wrong password', { email, ip, remaining });
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    resetRateLimit(ip);

    const token = signToken({
      userId: memUser.id,
      email: memUser.email,
      role: memUser.role,
      name: memUser.name,
    });

    logger.auth('User logged in (memory)', { userId: memUser.id, email: memUser.email });

    return buildSuccessResponse(token, {
      id: memUser.id,
      name: memUser.name,
      email: memUser.email,
      role: memUser.role,
    });
  } catch (err) {
    logger.error('Login error', { error: String(err) });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
