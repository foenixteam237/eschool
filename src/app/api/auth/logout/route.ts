import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3500/v1/api';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization');
    
    console.log('[API Route] POST /api/auth/logout');
    
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('[API Route] Backend error:', error);
      return NextResponse.json(error, { status: response.status });
    }

    console.log('[API Route] Logout successful');
    return NextResponse.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('[API Route] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json(
      { message: errorMessage, error: 'LOGOUT_ERROR' },
      { status: 500 }
    );
  }
}
