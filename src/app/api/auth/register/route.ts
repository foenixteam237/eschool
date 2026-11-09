import { NextRequest, NextResponse } from 'next/server';
import { getBackendApiUrl } from '@/lib/api-config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendBase = getBackendApiUrl();
    const registerUrl = `${backendBase}/auth/register`;

    console.log('[Auth API] POST /api/auth/register - Forwarding to backend:', registerUrl);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const response = await fetch(registerUrl, {
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
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      console.error('[Auth API] Non-JSON response on register:', response.status, text.slice(0, 200));
      return NextResponse.json(
        {
          success: false,
          message: `Le serveur backend (${backendBase}) a renvoyé un format inattendu.`,
          error: 'BACKEND_BAD_GATEWAY',
        },
        { status: 502 }
      );
    }

    const data = await response.json();

    if (!response.ok) {
      console.error('[Auth API] Backend error on register:', data);
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Auth API] Error in register route:', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'enregistrement';
    return NextResponse.json(
      { message: errorMessage, error: 'REGISTER_ERROR' },
      { status: 500 }
    );
  }
}
