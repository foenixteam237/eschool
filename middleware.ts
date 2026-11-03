import { NextRequest, NextResponse } from 'next/server';

// Routes publiques exemptées de vérification
const PUBLIC_PREFIXES = ['/login', '/_next', '/favicon.ico', '/api'];

interface JwtPayload {
  id?: string;
  sub?: string;
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
  user?: {
    id?: string;
    email?: string;
    role?: string;
  };
}

function parseJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Autoriser la racine si c'est la page vitrine ou rediriger
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Autoriser les routes publiques et assets Next.js
  if (PUBLIC_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const cookieKey = process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || 'eschool_token';
  const token = request.cookies.get(cookieKey)?.value;

  // Si pas de jeton, rediriger vers login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Décoder et vérifier le payload JWT
  const payload = parseJwtPayload(token);

  // Rejeter si le token est malformé
  if (!payload) {
    const response = NextResponse.redirect(new URL('/login?error=invalid_token', request.url));
    response.cookies.delete(cookieKey);
    return response;
  }

  // Vérifier l'expiration temporelle
  if (payload.exp && Date.now() >= payload.exp * 1000) {
    const response = NextResponse.redirect(new URL('/login?error=expired_session', request.url));
    response.cookies.delete(cookieKey);
    return response;
  }

  // Extraction du rôle
  const role = (payload.role || payload.user?.role || '').toUpperCase();

  // 1. Contrôle d'accès SuperAdmin (Réservé exclusivement à la gestion SaaS eSchool)
  if (pathname.startsWith('/superadmin')) {
    if (role !== 'SUPERADMIN') {
      if (role === 'ADMIN') return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      if (role === 'ENSEIGNANT') return NextResponse.redirect(new URL('/teacher/dashboard', request.url));
      if (role === 'PARENT') return NextResponse.redirect(new URL('/parent/dashboard', request.url));
      if (role === 'ELEVE') return NextResponse.redirect(new URL('/eleve/dashboard', request.url));
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Si l'utilisateur est SUPERADMIN, interdire l'accès à la vie interne des écoles
  if (role === 'SUPERADMIN') {
    return NextResponse.redirect(new URL('/superadmin/dashboard', request.url));
  }

  // 2. Contrôle d'accès Admin d'établissement
  if (pathname.startsWith('/admin')) {
    if (role !== 'ADMIN') {
      if (role === 'ENSEIGNANT') return NextResponse.redirect(new URL('/teacher/dashboard', request.url));
      if (role === 'PARENT') return NextResponse.redirect(new URL('/parent/dashboard', request.url));
      if (role === 'ELEVE') return NextResponse.redirect(new URL('/eleve/dashboard', request.url));
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // 3. Contrôle d'accès Enseignant
  if (pathname.startsWith('/teacher')) {
    if (role !== 'ENSEIGNANT' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // 4. Contrôle d'accès Parent
  if (pathname.startsWith('/parent')) {
    if (role !== 'PARENT') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // 5. Contrôle d'accès Élève
  if (pathname.startsWith('/eleve')) {
    if (role !== 'ELEVE') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
