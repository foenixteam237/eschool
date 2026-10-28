import { NextRequest, NextResponse } from 'next/server';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3500/v1/api').replace(/\/$/, '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('[API Route] POST /api/auth/login - Forwarding to backend:', API_URL);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        console.error('[API Route] Backend error:', data);
        return NextResponse.json(data, { status: response.status });
      }

      console.log('[API Route] Login successful');
      const res = NextResponse.json(data);
      if (data?.data?.token) {
        const cookieKey = process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || 'eschool_token';
        res.cookies.set(cookieKey, data.data.token, { path: '/', httpOnly: false });
      }
      return res;
    } catch (networkError) {
      console.warn('[API Route] Backend unavailable, using mock login fallback:', networkError);
      
      const email = body.email?.toLowerCase() || '';
      let role = 'ADMIN';
      if (email.includes('teacher') || email.includes('prof') || email.includes('enseignant')) {
        role = 'ENSEIGNANT';
      } else if (email.includes('parent')) {
        role = 'PARENT';
      } else if (email.includes('eleve') || email.includes('student')) {
        role = 'ELEVE';
      }

      const mockToken = `mock-jwt-token-${role.toLowerCase()}-${Date.now()}`;
      const mockData = {
        success: true,
        data: {
          user: {
            id: 'mock-user-1',
            email: body.email || 'admin@ecole.com',
            firstName: (body.email ? body.email.split('@')[0] : 'Admin').toUpperCase(),
            lastName: 'User',
            role: role,
          },
          token: mockToken,
        },
        timestamp: new Date().toISOString(),
      };

      const res = NextResponse.json(mockData);
      const cookieKey = process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || 'eschool_token';
      res.cookies.set(cookieKey, mockToken, { path: '/', httpOnly: false });
      return res;
    }
  } catch (error) {
    console.error('[API Route] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json(
      { message: errorMessage, error: 'LOGIN_ERROR' },
      { status: 500 }
    );
  }
}
