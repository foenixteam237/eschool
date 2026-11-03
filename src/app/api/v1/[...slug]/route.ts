import { NextRequest, NextResponse } from 'next/server';

function getBackendBaseUrl(request?: NextRequest): string {
  // Check if client passed a custom Vercel backend in header or cookie
  const headerUrl = request?.headers.get('x-backend-url');
  const cookieUrl = request?.cookies.get('eschool_backend_url')?.value;
  const custom = headerUrl || cookieUrl;
  if (custom && custom.startsWith('http') && !custom.includes('localhost') && !custom.includes('127.0.0.1')) {
    return custom.replace(/\/$/, '').replace(/\/api\/v1$/, '') + '/api/v1';
  }

  // If user configured a Vercel backend URL or remote URL in environment:
  const remoteUrl =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_VERCEL_BACKEND_URL ||
    process.env.VERCEL_BACKEND_URL;

  if (remoteUrl && !remoteUrl.includes('localhost') && !remoteUrl.includes('127.0.0.1')) {
    return remoteUrl.replace(/\/$/, '').replace(/\/api\/v1$/, '') + '/api/v1';
  }

  // Default to the configured Vercel production server
  return 'https://eschool-api-seven.vercel.app/api/v1';
}

async function forwardRequest(request: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const endpoint = '/' + slug.join('/');
  const backendBase = getBackendBaseUrl(request);
  const search = request.nextUrl.search || '';
  const targetUrl = `${backendBase}${endpoint}${search}`;

  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };

  // Forward authorization and content-type headers
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    headers['Authorization'] = authHeader;
  } else {
    // If authorization header missing, check session cookie
    const cookieToken = request.cookies.get(process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || 'eschool_token')?.value;
    if (cookieToken) {
      headers['Authorization'] = `Bearer ${cookieToken}`;
    }
  }

  const contentType = request.headers.get('content-type');
  if (contentType) {
    headers['Content-Type'] = contentType;
  }

  let body: string | undefined;
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
    try {
      body = await request.text();
    } catch {
      // Body may be empty
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const backendRes = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: body && body.length > 0 ? body : undefined,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const resContentType = backendRes.headers.get('content-type') || '';
    if (resContentType.includes('application/json')) {
      const data = await backendRes.json();
      return NextResponse.json(data, { status: backendRes.status });
    }

    const text = await backendRes.text();
    return new NextResponse(text, {
      status: backendRes.status,
      headers: { 'Content-Type': resContentType || 'text/plain' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur de connexion au serveur backend';
    console.error(`[API Proxy] Échec vers ${targetUrl}:`, message);
    return NextResponse.json(
      {
        success: false,
        error: 'BACKEND_CONNECTION_FAILED',
        message: `Impossible de contacter le backend (${backendBase}). Vérifiez l'URL de votre backend Vercel ou la connectivité réseau.`,
        targetUrl,
      },
      { status: 503 }
    );
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
  return forwardRequest(request, context);
}

export async function POST(request: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
  return forwardRequest(request, context);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
  return forwardRequest(request, context);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
  return forwardRequest(request, context);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
  return forwardRequest(request, context);
}
