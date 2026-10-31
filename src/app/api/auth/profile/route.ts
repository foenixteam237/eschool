import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_API_URL = 'http://127.0.0.1:3500/api/v1';
const RAW_API_URL = (process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || DEFAULT_API_URL).replace(/\/$/, '');
const API_URL = RAW_API_URL.replace('//localhost:3500', '//127.0.0.1:3500');

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

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(`${API_URL}/auth/profile`, {
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
        return NextResponse.json(
          {
            success: false,
            message: 'Le serveur backend n\'a pas renvoyé un profil valide.',
            error: 'BACKEND_INVALID_RESPONSE',
          },
          { status: 502 }
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
    } catch (networkError) {
      console.error('[Profile API] Backend unreachable:', networkError);
      return NextResponse.json(
        {
          success: false,
          message: 'Impossible de vérifier le profil auprès du serveur central.',
          error: 'BACKEND_UNAVAILABLE',
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('[API Route] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inattendue est survenue.';
    return NextResponse.json(
      { success: false, message: errorMessage, error: 'PROFILE_ERROR' },
      { status: 500 }
    );
  }
}
