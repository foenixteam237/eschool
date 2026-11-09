import { NextRequest, NextResponse } from 'next/server';
import { getBackendApiUrl } from '@/lib/api-config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body?.email || !body?.password) {
      return NextResponse.json(
        { success: false, message: 'Veuillez renseigner votre email et mot de passe.' },
        { status: 400 }
      );
    }

    const backendBase = getBackendApiUrl();
    const loginUrl = `${backendBase}/auth/login`;
    console.log('[Auth API] Forwarding login request to:', loginUrl);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s to allow Vercel serverless cold-starts

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type') || '';

      // Check if response is JSON
      if (!contentType.includes('application/json')) {
        const text = await response.text();
        console.error('[Auth API] Non-JSON response received from backend:', response.status, text.slice(0, 300));
        return NextResponse.json(
          {
            success: false,
            message: `Le serveur backend (${backendBase}) a répondu avec un format inattendu (HTTP ${response.status}).`,
            error: 'BACKEND_BAD_GATEWAY',
            details: text.slice(0, 150),
          },
          { status: response.status >= 500 ? response.status : 502 }
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
    } catch (networkError: unknown) {
      clearTimeout(timeoutId);
      const err = networkError as Error;
      const isTimeout = err?.name === 'AbortError';
      console.error('[Auth API] Network connection failed to backend:', loginUrl, err);

      return NextResponse.json(
        {
          success: false,
          message: isTimeout
            ? `Délai d'attente dépassé (20s) lors de la connexion au serveur backend (${backendBase}). Le serveur met trop de temps à répondre.`
            : `Impossible de joindre le serveur central eSchool (${backendBase}). Vérifiez que la variable BACKEND_API_URL est active.`,
          error: isTimeout ? 'BACKEND_TIMEOUT' : 'BACKEND_UNAVAILABLE',
        },
        { status: isTimeout ? 504 : 503 }
      );
    }
  } catch (error) {
    console.error('[Auth API] Unexpected error in route handler:', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inattendue est survenue.';
    return NextResponse.json(
      { success: false, message: errorMessage, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
