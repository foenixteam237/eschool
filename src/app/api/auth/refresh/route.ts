import { NextRequest, NextResponse } from 'next/server';

import { extractBearerToken, isJwtToken } from '@/lib/auth';

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

    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[API Route] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json(
      { message: errorMessage, error: 'REFRESH_ERROR' },
      { status: 500 }
    );
  }
}
