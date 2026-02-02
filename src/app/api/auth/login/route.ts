import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3500/v1/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('[API Route] POST /api/auth/login - Forwarding to backend:', API_URL);
    
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
      console.error('[API Route] Backend error:', data);
      return NextResponse.json(data, { status: response.status });
    }

    console.log('[API Route] Login successful');
    return NextResponse.json(data);
  } catch (error) {
    console.error('[API Route] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json(
      { message: errorMessage, error: 'LOGIN_ERROR' },
      { status: 500 }
    );
  }
}
