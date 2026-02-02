/**
 * Error Handler global
 */

import { APIError } from '@/lib/api-client';
import { toast } from 'react-toastify';

export class ErrorHandler {
  /**
   * Handle error and show appropriate message
   */
  static handle(error: unknown, defaultMessage: string = 'Une erreur est survenue'): string {
    let message = defaultMessage;

    if (error instanceof APIError) {
      switch (error.status) {
        case 400:
          message = 'Données invalides. Veuillez vérifier votre saisie.';
          break;
        case 401:
          message = 'Authentification requise. Veuillez vous reconnecter.';
          break;
        case 403:
          message = 'Accès refusé. Vous n\'avez pas les permissions requises.';
          break;
        case 404:
          message = 'Ressource non trouvée.';
          break;
        case 409:
          message = 'Cette ressource existe déjà.';
          break;
        case 422:
          message = 'Données invalides. Vérifiez votre saisie.';
          break;
        case 429:
          message = 'Trop de requêtes. Veuillez réessayer plus tard.';
          break;
        case 500:
          message = 'Erreur serveur. Veuillez réessayer plus tard.';
          break;
        case 0:
          message = error.message || message;
          break;
        default:
          message = error.message || message;
      }
    } else if (error instanceof Error) {
      message = error.message;
    }

    return message;
  }

  /**
   * Show error toast
   */
  static showErrorToast(error: unknown, defaultMessage?: string): void {
    const message = this.handle(error, defaultMessage);
    toast.error(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  /**
   * Show success toast
   */
  static showSuccessToast(message: string, duration: number = 3000): void {
    toast.success(message, {
      position: 'top-right',
      autoClose: duration,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  /**
   * Show info toast
   */
  static showInfoToast(message: string): void {
    toast.info(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  /**
   * Show warning toast
   */
  static showWarningToast(message: string): void {
    toast.warning(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  /**
   * Log error for debugging
   */
  static log(error: unknown, context?: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[Error${context ? ` - ${context}` : ''}]`, error);
    }
  }
}
