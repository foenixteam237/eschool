/**
 * Configuration centralisée de l'API Backend eSchool
 * Assure la communication avec le backend déployé sur Vercel ou le serveur local
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

  // Côté serveur
  const serverUrl =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_VERCEL_BACKEND_URL ||
    process.env.VERCEL_BACKEND_URL;

  if (serverUrl && !serverUrl.includes('ais-dev-z254n7p7ochfsg2saokkto')) {
    const clean = serverUrl.replace(/\/$/, '');
    return clean.endsWith('/api/v1') ? clean : `${clean}/api/v1`;
  }

  return 'https://eschool-api-seven.vercel.app/api/v1';
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
