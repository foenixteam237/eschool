import { NextRequest, NextResponse } from 'next/server';

// Routes qui ne nécessitent pas d'authentification
const PUBLIC_ROUTES = ['/login', '/'];

// Routes protégées par rôle
const ROLE_ROUTES: Record<string, string[]> = {
  ADMIN: ['/admin'],
  ENSEIGNANT: ['/teacher'],
  PARENT: ['/parent'],
  ELEVE: ['/eleve'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Les routes publiques sont toujours accessibles
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Récupérer le token JWT
  const token = request.cookies.get(process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || 'eschool_token')?.value;

  // Si pas de token et route protégée, rediriger vers login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Ici, vous pouvez ajouter une vérification de rôle supplémentaire
  // Pour l'instant, tout utilisateur authentifié peut accéder aux routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
