import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import { JWTPayload } from '@/lib/auth';
import { homework } from '@/data/homework';

// GET /api/homework — authenticated: return homework list with user submission status
export const GET = withAuth(async (_req: NextRequest, _user: JWTPayload) => {
  return NextResponse.json({ homework });
});
