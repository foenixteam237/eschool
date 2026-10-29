import { NextRequest, NextResponse } from 'next/server';

import { AUTH_COOKIE_NAME, hasPermissionForPath, isJwtToken } from '@/lib/auth';

const PUBLIC_ROUTES = ['/login', '/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token || !isJwtToken(token)) {
    return NextResponse.redirect(new URL('/login?error=unauthorized', request.url));
  }

  if (!hasPermissionForPath(pathname, token)) {
    return NextResponse.redirect(new URL('/login?error=forbidden', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
