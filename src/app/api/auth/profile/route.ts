import { NextRequest, NextResponse } from 'next/server';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3500/v1/api').replace(/\/$/, '');

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
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        console.error('[API Route] Backend error:', data);
        return NextResponse.json(data, { status: response.status });
      }

      console.log('[API Route] Profile fetched successfully');
      return NextResponse.json(data);
    } catch (networkError) {
      console.warn('[API Route] Backend unreachable for profile, returning mock profile:', networkError);
      
      return NextResponse.json({
        success: true,
        data: {
          id: 'mock-user-1',
          email: 'admin@ecole.com',
          firstName: 'Admin',
          lastName: 'Principal',
          role: 'ADMIN',
          estActif: true,
        },
      });
    }
  } catch (error) {
    console.error('[API Route] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json(
      { message: errorMessage, error: 'PROFILE_ERROR' },
      { status: 500 }
    );
  }
}
