/**
 * Request Interceptors et Middleware
 */

import { APIError } from '@/lib/api-client';
import { authService } from '@/services/auth.service';

/**
 * Setup API interceptors
 */
export function setupApiInterceptors() {
  // On pourrait ajouter des interceptors globaux ici dans le futur
  // Par exemple, pour rafraîchir le token automatiquement
}

/**
 * Request logger (development only)
 */
export function logRequest(
  method: string,
  url: string,
  data?: unknown
): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `%c${method} ${url}`,
      'color: #0066cc; font-weight: bold;',
      data || ''
    );
  }
}

/**
 * Response logger (development only)
 */
export function logResponse(
  method: string,
  url: string,
  status: number,
  duration: number
): void {
  if (process.env.NODE_ENV === 'development') {
    const color = status >= 400 ? '#cc0000' : '#00cc00';
    console.log(
      `%c${method} ${url} - ${status}`,
      `color: ${color}; font-weight: bold;`,
      `${duration}ms`
    );
  }
}

/**
 * Validation des données avant envoi
 */
export function validateRequestData(data: unknown): void {
  if (data && typeof data === 'object') {
    // Ajouter des validations customs si nécessaire
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined) {
        console.warn(`Property "${key}" is undefined and will be omitted`);
      }
    });
  }
}

/**
 * Handle authentication errors globally
 */
export async function handleAuthError(): Promise<void> {
  try {
    await authService.refreshToken();
  } catch {
    // Redirect to login if refresh fails
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
}

/**
 * Retry logic avec backoff exponentiel
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Ne pas retry si c'est une erreur 4xx (sauf 408, 429)
      if (error instanceof APIError) {
        if (error.status >= 400 && error.status < 500) {
          if (error.status !== 408 && error.status !== 429) {
            throw error;
          }
        }
      }

      // Calculer le délai avec backoff exponentiel
      if (attempt < maxAttempts - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Max retry attempts reached');
}

/**
 * Batch requests pour optimiser les appels API
 */
export class BatchRequestQueue {
  private queue: Array<{ fn: () => Promise<unknown>; resolve: (value: unknown) => void; reject: (error: unknown) => void }> = [];
  private processing = false;
  private batchSize: number;
  private batchDelay: number;

  constructor(batchSize: number = 10, batchDelay: number = 100) {
    this.batchSize = batchSize;
    this.batchDelay = batchDelay;
  }

  add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ fn: fn as () => Promise<unknown>, resolve: resolve as (value: unknown) => void, reject });

      if (this.queue.length >= this.batchSize) {
        this.processBatch();
      } else if (!this.processing) {
        this.scheduleProcessing();
      }
    });
  }

  private scheduleProcessing(): void {
    setTimeout(() => {
      if (this.queue.length > 0) {
        this.processBatch();
      }
    }, this.batchDelay);
  }

  private async processBatch(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    const batch = this.queue.splice(0, this.batchSize);

    for (const item of batch) {
      try {
        const result = await item.fn();
        item.resolve(result);
      } catch (error) {
        item.reject(error);
      }
    }

    this.processing = false;

    if (this.queue.length > 0) {
      this.scheduleProcessing();
    }
  }
}

export const batchRequestQueue = new BatchRequestQueue();
