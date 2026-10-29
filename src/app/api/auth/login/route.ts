import { NextRequest, NextResponse } from 'next/server';

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

    const res = NextResponse.json(data);
    if (data?.data?.token) {
      const cookieKey = process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || 'eschool_token';
      res.cookies.set(cookieKey, data.data.token, { path: '/', httpOnly: false });
    }

    return res;
  } catch (error) {
    console.error('[API Route] Login backend unavailable:', error);
    return NextResponse.json(
      { message: 'Impossible de contacter le backend eSchool.', error: 'BACKEND_UNAVAILABLE' },
      { status: 503 }
    );
  }
}
