/**
 * HTTP Client - Gestion centralisée des requêtes API
 * Connecté au backend NestJS avec JWT authentication
 */

import { API_CONFIG } from './constants';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
const JWT_STORAGE_KEY = process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || 'eschool_token';

export class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  retry?: number;
  timeout?: number;
  skipAuth?: boolean;
}

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
  message?: string;
  statusCode?: number;
}

class HttpClient {
  private baseUrl: string;
  private timeout: number;
  private onTokenExpired?: () => void;

  constructor(baseUrl: string = API_URL, timeout: number = API_CONFIG.TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  /**
   * Set callback for token expiration
   */
  setTokenExpiredCallback(callback: () => void) {
    this.onTokenExpired = callback;
  }

  /**
   * Effectue une requête HTTP avec interception JWT
   */
  async request<T = unknown>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      retry = 0,
      timeout = this.timeout,
      skipAuth = false,
    } = options;

    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getAuthToken();

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // Add JWT token to authorization header
    if (token && !skipAuth) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle 401 Unauthorized
      if (response.status === 401) {
        this.clearAuthToken();
        if (this.onTokenExpired) {
          this.onTokenExpired();
        }
        throw new APIError(
          401,
          'Session expirée. Veuillez vous reconnecter.',
          'UNAUTHORIZED'
        );
      }

      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        throw new APIError(
          response.status,
          errorData.message || `HTTP ${response.status}`,
          errorData.code,
          errorData
        );
      }

      const data = await this.parseResponse<T>(response);
      return data;
    } catch (error) {
      // Retry logic for retryable errors
      if (retry < API_CONFIG.RETRY_ATTEMPTS && this.isRetryableError(error)) {
        await this.delay(API_CONFIG.RETRY_DELAY * Math.pow(2, retry));
        return this.request(endpoint, { ...options, retry: retry + 1 });
      }

      throw this.handleError(error);
    }
  }

  /**
   * Parse successful response
   */
  private async parseResponse<T = unknown>(response: Response): Promise<T> {
    const text = await response.text();
    
    if (!text) {
      return undefined as unknown as T;
    }

    try {
      const data = JSON.parse(text);
      
      // If response has data property, return it directly
      if (data.data !== undefined) {
        return data.data;
      }
      
      // Otherwise return whole response
      return data as T;
    } catch {
      return text as unknown as T;
    }
  }

  /**
   * Parse error response
   */
  private async parseErrorResponse(response: Response): Promise<{ message: string; code?: string }> {
    try {
      const data = await response.json();
      return {
        message: data.message || data.error?.message || `HTTP ${response.status}`,
        code: data.code || data.error?.code,
      };
    } catch {
      return {
        message: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
  }

  /**
   * GET request
   */
  get<T = unknown>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  post<T = unknown>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  /**
   * PUT request
   */
  put<T = unknown>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  /**
   * PATCH request
   */
  patch<T = unknown>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  /**
   * DELETE request
   */
  delete<T = unknown>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Get auth token from localStorage
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(JWT_STORAGE_KEY);
  }

  /**
   * Clear auth token from localStorage
   */
  private clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(JWT_STORAGE_KEY);
    }
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: unknown): boolean {
    if (error instanceof APIError) {
      // Don't retry on auth errors
      if (error.status === 401 || error.status === 403) {
        return false;
      }
      // Retry on 5xx errors and timeouts
      return error.status >= 500 || error.status === 0;
    }
    // Retry on network errors
    return error instanceof TypeError;
  }

  /**
   * Handle errors with appropriate messages
   */
  private handleError(error: unknown): Error {
    if (error instanceof APIError) {
      return error;
    }

    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      return new APIError(
        0,
        'Erreur de connexion. Vérifiez votre connexion Internet.',
        'NETWORK_ERROR',
        error
      );
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      return new APIError(
        0,
        'La requête a expiré. Veuillez réessayer.',
        'TIMEOUT',
        error
      );
    }

    return new APIError(
      0,
      'Une erreur est survenue. Veuillez réessayer.',
      'UNKNOWN_ERROR',
      error
    );
  }

  /**
   * Utility: delay helper for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const apiClient = new HttpClient();
