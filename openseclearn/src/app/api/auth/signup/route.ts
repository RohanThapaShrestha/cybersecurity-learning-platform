import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import pool from '@/lib/db';
import { hashPassword } from '@/lib/password';
import { signToken } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { findUserByEmail, createUser, isDbAvailable } from '@/lib/memoryAuth';

const SignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address (e.g. you@example.com)').transform(v => v.toLowerCase()),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
});

function buildSuccessResponse(token: string, userData: { id: string; name: string; email: string; role: string }) {
  const response = NextResponse.json(
    { token, user: userData },
    { status: 201 }
  );

  // Set cookie server-side so middleware can read it immediately
  response.cookies.set('openseclearn-token', token, {
    path: '/',
    maxAge: 60 * 60,
    sameSite: 'lax',
    httpOnly: false,
  });

  return response;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SignupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;
    const passwordHash = await hashPassword(password);

    // Try database first
    const dbOk = await isDbAvailable(pool);

    if (dbOk) {
      try {
        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
          return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
        }

        const result = await pool.query(
          `INSERT INTO users (name, email, password_hash, role_id)
           VALUES ($1, $2, $3, 1)
           RETURNING id, name, email, role_id, created_at`,
          [name, email, passwordHash]
        );

        const user = result.rows[0];

        await pool.query(
          `INSERT INTO progress (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING`,
          [user.id]
        );

        const token = signToken({
          userId: user.id,
          email: user.email,
          role: 'user',
          name: user.name,
        });

        logger.auth('User signed up (DB)', { userId: user.id, email: user.email });

        return buildSuccessResponse(token, {
          id: user.id,
          name: user.name,
          email: user.email,
          role: 'user',
        });
      } catch {
        logger.authWarn('DB signup failed, using memory auth', { email });
      }
    }

    // In-memory fallback
    const existing = findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const user = createUser(name, email, passwordHash);

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: 'user',
      name: user.name,
    });

    logger.auth('User signed up (memory)', { userId: user.id, email: user.email });

    return buildSuccessResponse(token, {
      id: user.id,
      name: user.name,
      email: user.email,
      role: 'user',
    });
  } catch (err) {
    logger.error('Signup error', { error: String(err) });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
