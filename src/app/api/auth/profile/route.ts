import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3500/v1/api';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization');
    
    if (!token) {
      return NextResponse.json(
        { message: 'No authorization token provided', error: 'NO_TOKEN' },
        { status: 401 }
      );
    }

    console.log('[API Route] GET /api/auth/profile');
    
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[API Route] Backend error:', data);
      return NextResponse.json(data, { status: response.status });
    }

    console.log('[API Route] Profile fetched successfully');
    return NextResponse.json(data);
  } catch (error) {
    console.error('[API Route] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json(
      { message: errorMessage, error: 'PROFILE_ERROR' },
      { status: 500 }
    );
  }
}
