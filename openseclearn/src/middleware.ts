import { NextRequest, NextResponse } from 'next/server';

// Routes that don't require authentication
const PUBLIC_PATHS = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/forgot-password',
  '/api/auth/verify-otp',
  '/api/auth/reset-password',
  '/api/docs',
  '/api/docs/ui',
];

// Routes that require admin role (pages + API)
const ADMIN_PATHS = [
  '/admin',
  '/api/users',
];

// Admin-only API paths that need prefix matching
// (e.g. /api/progress/some-user-id but NOT /api/progress/me)
const ADMIN_API_PREFIX = '/api/progress/';
const USER_PROGRESS_PATH = '/api/progress/me';

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );
}

function isAdminPath(pathname: string): boolean {
  // Exact admin paths and their children
  if (ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return true;
  }

  // /api/progress/:userId routes are admin-only, EXCEPT /api/progress/me
  if (
    pathname.startsWith(ADMIN_API_PREFIX) &&
    pathname !== USER_PROGRESS_PATH &&
    !pathname.startsWith(USER_PROGRESS_PATH + '/')
  ) {
    return true;
  }

  return false;
}

/**
 * Decode JWT payload without verifying signature.
 * Middleware runs in Edge Runtime where `jsonwebtoken` (Node.js) can fail.
 * The signature is already verified in each API route handler.
 */
function decodeJwtPayload(token: string): { userId: string; email: string; role: string; name: string; exp?: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Base64url → Base64 → decode
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    const payload = JSON.parse(json);

    // Check expiration
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return null; // expired
    }

    return payload;
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public assets and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(png|jpg|svg|ico|webp|css|js)$/)
  ) {
    return NextResponse.next();
  }

  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Read JWT from cookie
  const token = req.cookies.get('openseclearn-token')?.value;

  if (!token) {
    // API routes get a JSON 401; pages redirect to login
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/auth/login';
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const user = decodeJwtPayload(token);

  if (!user) {
    // Token invalid/expired – clear cookie and redirect
    if (pathname.startsWith('/api/')) {
      const response = NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
      response.cookies.delete('openseclearn-token');
      return response;
    }
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/auth/login';
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('openseclearn-token');
    return response;
  }

  // Check admin-only paths — block non-admin at the edge
  if (isAdminPath(pathname) && user.role !== 'admin') {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    const forbiddenUrl = req.nextUrl.clone();
    forbiddenUrl.pathname = '/dashboard';
    forbiddenUrl.searchParams.set('unauthorized', '1');
    return NextResponse.redirect(forbiddenUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
