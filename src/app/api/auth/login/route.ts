import { NextRequest, NextResponse } from 'next/server';

import { AUTH_COOKIE_NAME, extractBearerToken, getCookieOptions, isJwtToken } from '@/lib/auth';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3500/v1/api').replace(/\/$/, '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    const token = data?.data?.token ?? data?.token;
    if (typeof token !== 'string' || !isJwtToken(token)) {
      return NextResponse.json(
        { message: 'Authentication backend did not return a valid token', error: 'NO_VALID_TOKEN' },
        { status: 401 }
      );
    }

    const res = NextResponse.json(data);
    res.cookies.set(AUTH_COOKIE_NAME, token, getCookieOptions());
    return res;
  } catch (error) {
    console.error('[API Route] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json(
      { message: errorMessage, error: 'LOGIN_ERROR' },
      { status: 500 }
    );
  }
}
