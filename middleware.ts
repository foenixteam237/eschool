import { NextRequest, NextResponse } from 'next/server';
import { UI_AREA_BY_ROLE, UserRole } from '@/types';

const TOKEN_COOKIE = process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || 'eschool_token';
const ROLE_COOKIE = 'eschool_role';

// Routes accessibles sans authentification
const PUBLIC_ROUTES = ['/login'];

// Espaces protégés (premier segment de l'URL)
const PROTECTED_AREAS = ['superadmin', 'admin', 'teacher', 'parent', 'eleve'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Page d'accueil publique
  if (pathname === '/') {
    return NextResponse.next();
  }

  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const role = request.cookies.get(ROLE_COOKIE)?.value as UserRole | undefined;
  const userArea = role ? UI_AREA_BY_ROLE[role] : undefined;

  // Utilisateur déjà connecté qui visite /login → renvoyer vers son espace
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    if (token && userArea) {
      return NextResponse.redirect(new URL(`/${userArea}/dashboard`, request.url));
    }
    return NextResponse.next();
  }

  const area = pathname.split('/')[1];

  // Route protégée sans token → login
  if (PROTECTED_AREAS.includes(area) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Token présent mais rôle ne correspond pas à l'espace demandé → son espace
  if (PROTECTED_AREAS.includes(area) && userArea && area !== userArea) {
    return NextResponse.redirect(new URL(`/${userArea}/dashboard`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Toutes les routes sauf :
     * - api (routes API Next.js)
     * - _next/static, _next/image
     * - favicon.ico, fichiers publics
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
