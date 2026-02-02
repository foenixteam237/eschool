/**
 * Error Formatter
 * Convertit les messages d'erreur techniques en messages utilisateurs compréhensibles
 */

export function formatAuthError(error: string | Error | unknown): string {
  const errorMessage = typeof error === 'string' ? error : error instanceof Error ? error.message : String(error);

  // Erreurs de base de données
  if (errorMessage.includes('database') || errorMessage.includes('pooler.supabase.com')) {
    return 'Le service est actuellement indisponible. Veuillez réessayer dans quelques instants.';
  }

  // Erreurs de connexion réseau
  if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('NetworkError')) {
    return 'Erreur de connexion réseau. Vérifiez votre connexion internet.';
  }

  // Identifiants invalides
  if (errorMessage.includes('Unauthorized') || errorMessage.includes('Invalid credentials') || errorMessage.includes('not found')) {
    return 'Email ou mot de passe incorrect.';
  }

  // Erreur de validation
  if (errorMessage.includes('validation') || errorMessage.includes('required')) {
    return 'Veuillez vérifier vos identifiants.';
  }

  // Erreurs CORS
  if (errorMessage.includes('CORS') || errorMessage.includes('cors')) {
    return 'Erreur de configuration serveur. Veuillez contacter le support.';
  }

  // Erreur serveur générique
  if (errorMessage.includes('500') || errorMessage.includes('Internal Server Error')) {
    return 'Erreur serveur. Veuillez réessayer plus tard.';
  }

  // Erreur de timeout
  if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
    return 'La requête a pris trop de temps. Veuillez réessayer.';
  }

  // Message par défaut
  return 'Une erreur s\'est produite lors de la connexion. Veuillez réessayer.';
}

export function formatErrorForConsole(error: string | Error | unknown): void {
  const errorMessage = typeof error === 'string' ? error : error instanceof Error ? error.message : String(error);
  console.log('❌ ============================================');
  console.log('❌ AUTHENTICATION ERROR');
  console.log('❌ ============================================');
  console.log('Technical Details:', errorMessage);
  console.log('❌ ============================================');
}
