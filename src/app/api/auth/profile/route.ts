import { NextRequest, NextResponse } from 'next/server';
import { getBackendApiUrl } from '@/lib/api-config';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const cookieToken = request.cookies.get(process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || 'eschool_token')?.value;

    const token = authHeader || (cookieToken ? `Bearer ${cookieToken}` : null);

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Aucun jeton d\'authentification fourni.', error: 'NO_TOKEN' },
        { status: 401 }
      );
    }

    const backendBase = getBackendApiUrl();
    const profileUrl = `${backendBase}/auth/profile`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(profileUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token,
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await response.text();
        console.error('[Auth Profile API] Non-JSON response from backend:', response.status, text.slice(0, 200));
        return NextResponse.json(
          {
            success: false,
            message: 'Le serveur backend n\'a pas renvoyé un profil valide.',
            error: 'BACKEND_INVALID_RESPONSE',
          },
          { status: response.status >= 500 ? response.status : 502 }
        );
      }

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          {
            success: false,
            message: data?.message || 'Session invalide ou expirée.',
            error: data?.error || 'INVALID_SESSION',
          },
          { status: response.status }
        );
      }

      return NextResponse.json(data);
    } catch (networkError: unknown) {
      clearTimeout(timeoutId);
      const err = networkError as Error;
      console.error('[Auth Profile API] Failed to fetch profile from:', profileUrl, err);
      return NextResponse.json(
        {
          success: false,
          message: 'Impossible de contacter le serveur d\'authentification eSchool.',
          error: 'BACKEND_UNAVAILABLE',
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('[Auth Profile API] Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inattendue est survenue.';
    return NextResponse.json(
      { success: false, message: errorMessage, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
