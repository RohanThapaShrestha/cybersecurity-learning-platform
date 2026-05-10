import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader, JWTPayload } from './auth';

export type AdminHandler = (
  req: NextRequest,
  user: JWTPayload,
  context?: { params: Promise<Record<string, string>> }
) => Promise<NextResponse>;

/**
 * Wraps an API route handler with admin-only authorization.
 * Checks Authorization header first, then falls back to the cookie.
 * Returns 403 if the authenticated user is not an admin.
 */
export function withAdmin(handler: AdminHandler) {
  return async (
    req: NextRequest,
    context?: { params: Promise<Record<string, string>> }
  ): Promise<NextResponse> => {
    // Try Authorization header first, then cookie fallback
    const authHeader = req.headers.get('Authorization');
    const token =
      extractTokenFromHeader(authHeader) ||
      req.cookies.get('openseclearn-token')?.value ||
      null;

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    try {
      const user = verifyToken(token);

      if (user.role !== 'admin') {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
      }

      return handler(req, user, context);
    } catch {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
  };
}
