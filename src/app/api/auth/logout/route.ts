import { NextRequest, NextResponse } from 'next/server';

import { AUTH_COOKIE_NAME, extractBearerToken, getCookieOptions, isJwtToken } from '@/lib/auth';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3500/v1/api').replace(/\/$/, '');

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('Authorization');
    const token = extractBearerToken(authorization);

    if (!token || !isJwtToken(token)) {
      return NextResponse.json(
        { message: 'No valid authorization token provided', error: 'NO_TOKEN' },
        { status: 401 }
      );
    }

    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => null);
    } catch {
      // Ignore backend errors on logout.
    }

    const res = NextResponse.json({ message: 'Logout successful' });
    res.cookies.set(AUTH_COOKIE_NAME, '', {
      ...getCookieOptions(),
      maxAge: 0,
      expires: new Date(0),
    });
    return res;
  } catch (error) {
    console.error('[API Route] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json(
      { message: errorMessage, error: 'LOGOUT_ERROR' },
      { status: 500 }
    );
  }
}
