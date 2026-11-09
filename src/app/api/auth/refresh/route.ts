import { NextRequest, NextResponse } from 'next/server';
import { getBackendApiUrl } from '@/lib/api-config';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization');

    if (!token) {
      return NextResponse.json(
        { message: 'Aucun jeton d\'autorisation fourni', error: 'NO_TOKEN' },
        { status: 401 }
      );
    }

    const backendBase = getBackendApiUrl();
    console.log('[Auth API] POST /api/auth/refresh - Forwarding to:', `${backendBase}/auth/refresh`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(`${backendBase}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      console.error('[Auth API] Backend error on refresh:', data);
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Auth API] Error in refresh route:', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
    return NextResponse.json(
      { message: errorMessage, error: 'REFRESH_ERROR' },
      { status: 500 }
    );
  }
}
