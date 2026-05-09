import { NextRequest, NextResponse } from 'next/server';

const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || '';
const COOKIE_NAME = 'scanner_auth';

const PUBLIC_PATHS = ['/login', '/api/cron/source', '/api/cron/scan', '/api/results'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow cron and public paths through
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Check auth cookie
  const cookie = request.cookies.get(COOKIE_NAME);
  if (cookie?.value === DASHBOARD_PASSWORD) {
    return NextResponse.next();
  }

  // Redirect to login
  const url = request.nextUrl.clone();
  url.pathname = '/login';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
