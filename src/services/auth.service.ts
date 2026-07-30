/**
 * Authentication Service
 * Connecté au backend NestJS via API routes Next.js
 */

import { apiClient } from '@/lib/api-client';
import { ROUTES } from '@/lib/constants';
import { UserRole } from '@/types';

// Routes locales Next.js (proxy) pour éviter les problèmes CORS sur l'auth.
const API_URL = '/api/auth';
const JWT_STORAGE_KEY = process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || 'eschool_token';
const ROLE_STORAGE_KEY = 'eschool_role';

export interface LoginRequest {
  email: string;
  password: string;
}

// Forme de réponse de l'API eschool-api : { user, token }
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

class AuthService {
  /**
   * Login user - Utilise la route API Next.js
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const url = `${API_URL}/login`;
      console.log('🔐 Attempting login via:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.log('Login error response:', error);
        throw new Error(error.message || `Login failed with status ${response.status}`);
      }

      const data: LoginResponse = await response.json();

      if (data.token) {
        this.setToken(data.token);
        this.setRole(data.user?.role);
      }
      return data;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Login failed';
      console.log('❌ Login error:', errorMsg, error);
      throw error;
    }
  }

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const result: LoginResponse = await response.json();

      if (result.token) {
        this.setToken(result.token);
        this.setRole(result.user?.role);
      }

      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      const token = this.getToken();
      const response = await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Logout response:', response.status);
    } catch (error) {
      console.error('Logout error (non-critical):', error);
    } finally {
      this.clearToken();
    }
  }

  /**
   * Get current user profile
   */
  async getProfile() {
    const token = this.getToken();
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_URL}/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<AuthResponse> {
    const token = this.getToken();
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_URL}/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data: AuthResponse = await response.json();
    
    if (data.access_token) {
      this.setToken(data.access_token);
    }

    return data;
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(JWT_STORAGE_KEY);
  }

  /**
   * Store token — localStorage (header Bearer) + cookie (middleware).
   * Le cookie n'est PAS HttpOnly car le token doit aussi servir de Bearer
   * côté client ; la sécurité réelle est assurée par le JWT signé et les
   * gardes de l'API. `SameSite=Lax` limite les envois cross-site.
   */
  private setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(JWT_STORAGE_KEY, token);
    document.cookie = `${JWT_STORAGE_KEY}=${token}; path=/; max-age=604800; SameSite=Lax`;
  }

  /**
   * Store role in a cookie so the middleware can enforce role-based access.
   */
  private setRole(role?: string): void {
    if (typeof window === 'undefined' || !role) return;
    document.cookie = `${ROLE_STORAGE_KEY}=${role}; path=/; max-age=604800; SameSite=Lax`;
  }

  /**
   * Clear token + role (localStorage and cookies)
   */
  private clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(JWT_STORAGE_KEY);
    document.cookie = `${JWT_STORAGE_KEY}=; path=/; max-age=0; SameSite=Lax`;
    document.cookie = `${ROLE_STORAGE_KEY}=; path=/; max-age=0; SameSite=Lax`;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
