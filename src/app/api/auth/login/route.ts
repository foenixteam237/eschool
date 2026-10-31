import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_API_URL = 'http://127.0.0.1:3500/api/v1';
const RAW_API_URL = (process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || DEFAULT_API_URL).replace(/\/$/, '');
// Ensure local connection to port 3500 uses 127.0.0.1 to prevent IPv6 resolution mismatches
const API_URL = RAW_API_URL.replace('//localhost:3500', '//127.0.0.1:3500');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body?.email || !body?.password) {
      return NextResponse.json(
        { success: false, message: 'Veuillez renseigner votre email et mot de passe.' },
        { status: 400 }
      );
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

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

      // Check if response is JSON
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await response.text();
        console.error('[Auth API] Non-JSON response received from backend:', text.slice(0, 200));
        return NextResponse.json(
          {
            success: false,
            message: 'Le serveur backend a renvoyé un format inattendu. Vérifiez que le service backend est actif et accessible.',
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
            message: data?.message || 'Identifiants invalides ou accès refusé.',
            error: data?.error || 'AUTH_FAILED',
          },
          { status: response.status }
        );
      }

      const res = NextResponse.json(data);
      const token = data?.data?.token || data?.token || data?.access_token;

      if (token) {
        const cookieKey = process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || 'eschool_token';
        res.cookies.set(cookieKey, token, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
      }

      return res;
    } catch (networkError) {
      console.error('[Auth API] Network connection failed to backend:', networkError);
      return NextResponse.json(
        {
          success: false,
          message: 'Impossible de joindre le serveur central eSchool. Vérifiez l\'état du backend ou votre connexion réseau.',
          error: 'BACKEND_UNAVAILABLE',
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('[API Route] Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inattendue est survenue.';
    return NextResponse.json(
      { success: false, message: errorMessage, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
