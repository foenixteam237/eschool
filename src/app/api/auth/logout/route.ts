import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_API_URL = 'https://ais-dev-z254n7p7ochfsg2saokkto-835800199062.europe-west2.run.app/api/v1';
const API_URL = (process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || DEFAULT_API_URL).replace(/\/$/, '');

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization');
    
    console.log('[API Route] POST /api/auth/logout');
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': token }),
        },
        signal: controller.signal,
      }).catch(() => null);
      clearTimeout(timeoutId);
    } catch {
      // Ignore backend errors on logout
    }

    console.log('[API Route] Logout successful');
    const res = NextResponse.json({ message: 'Logout successful' });
    const cookieKey = process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || 'eschool_token';
    res.cookies.delete(cookieKey);
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
