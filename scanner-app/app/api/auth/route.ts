import { NextRequest, NextResponse } from 'next/server';

const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || '';

export async function POST(request: NextRequest) {
  const { password } = await request.json() as { password: string };
  if (!DASHBOARD_PASSWORD || password !== DASHBOARD_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set('scanner_auth', DASHBOARD_PASSWORD, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
  return res;
}
