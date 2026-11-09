/**
 * Configuration centralisée de l'API Backend eSchool
 * Assure la communication avec le backend NestJS déployé sur Vercel
 */

export const DEFAULT_BACKEND_API_URL = 'https://eschool-api-seven.vercel.app/api/v1';

/**
 * Normalise une URL d'API en s'assurant qu'elle possède le préfixe /api/v1
 * et en éliminant les URLs locales ou obsolètes si en production.
 */
export function normalizeApiUrl(url?: string | null): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return DEFAULT_BACKEND_API_URL;
  }

  let clean = url.trim().replace(/\/+$/, '');

  // Élimine les anciennes URLs Cloud Run dépréciées
  if (clean.includes('ais-dev-z254n7p7ochfsg2saokkto')) {
    return DEFAULT_BACKEND_API_URL;
  }

  // Si on est en environnement de production et que l'URL pointe vers localhost/127.0.0.1,
  // on utilise le serveur de production Vercel pour éviter les erreurs 502/ECONNREFUSED
  if (
    process.env.NODE_ENV === 'production' &&
    (clean.includes('localhost') || clean.includes('127.0.0.1'))
  ) {
    return DEFAULT_BACKEND_API_URL;
  }

  // Normalisation du chemin /api/v1
  if (!clean.endsWith('/api/v1')) {
    if (clean.endsWith('/api')) {
      clean = `${clean}/v1`;
    } else {
      clean = `${clean}/api/v1`;
    }
  }

  return clean;
}

/**
 * Résout l'URL absolue du backend distant (utilisé par les routes serveur Next.js)
 * Priorité : BACKEND_API_URL > NEXT_PUBLIC_API_URL > API_URL > VERCEL_BACKEND_URL > DEFAULT
 */
export function getBackendApiUrl(): string {
  const candidate =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_VERCEL_BACKEND_URL ||
    process.env.VERCEL_BACKEND_URL;

  return normalizeApiUrl(candidate);
}

/**
 * Résout l'URL de base pour les requêtes HTTP.
 * Dans le navigateur : utilise le proxy Next.js local '/api/v1' pour éviter les erreurs CORS
 * Côté serveur : utilise directement getBackendApiUrl()
 */
export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // Vérifier si l'utilisateur a défini une URL Vercel spécifique dans le navigateur
    const customBackend = localStorage.getItem('eschool_backend_url');
    if (customBackend && customBackend.startsWith('http')) {
      return customBackend.replace(/\/$/, '');
    }
    // Par défaut dans le navigateur : passer par le proxy Next.js /api/v1 pour zéro problème CORS
    return '/api/v1';
  }

  return getBackendApiUrl();
}

export function setCustomBackendUrl(url: string | null): void {
  if (typeof window !== 'undefined') {
    if (url && url.trim()) {
      const clean = url.trim();
      localStorage.setItem('eschool_backend_url', clean);
      document.cookie = `eschool_backend_url=${encodeURIComponent(clean)}; path=/; max-age=31536000; SameSite=Lax`;
    } else {
      localStorage.removeItem('eschool_backend_url');
      document.cookie = 'eschool_backend_url=; path=/; max-age=0; SameSite=Lax';
    }
  }
}
