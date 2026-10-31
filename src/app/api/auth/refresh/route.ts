import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_API_URL = 'https://ais-dev-z254n7p7ochfsg2saokkto-835800199062.europe-west2.run.app/api/v1';
const API_URL = (process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || DEFAULT_API_URL).replace(/\/$/, '');

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization');
    
    if (!token) {
      return NextResponse.json(
        { message: 'No authorization token provided', error: 'NO_TOKEN' },
        { status: 401 }
      );
    }

    console.log('[API Route] POST /api/auth/refresh');
    
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
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

    console.log('[API Route] Token refreshed successfully');
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
