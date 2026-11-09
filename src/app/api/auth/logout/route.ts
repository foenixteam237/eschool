import { NextRequest, NextResponse } from 'next/server';
import { getBackendApiUrl } from '@/lib/api-config';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization');
    const backendBase = getBackendApiUrl();

    console.log('[Auth API] POST /api/auth/logout');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      await fetch(`${backendBase}/auth/logout`, {
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

    const res = NextResponse.json({ success: true, message: 'Déconnexion réussie' });
    const cookieKey = process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || 'eschool_token';
    res.cookies.delete(cookieKey);
    return res;
  } catch (error) {
    console.error('[Auth API] Error in logout route:', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
    return NextResponse.json(
      { message: errorMessage, error: 'LOGOUT_ERROR' },
      { status: 500 }
    );
  }
}
