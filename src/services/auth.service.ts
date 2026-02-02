/**
 * Authentication Service
 * Connecté au backend NestJS via API routes Next.js
 */

import { apiClient } from '@/lib/api-client';
import { ROUTES } from '@/lib/constants';
import { UserRole } from '@/types';

// L'URL de base inclut déjà /v1/api
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3500/v1/api';
// Utiliser les routes locales Next.js pour éviter les problèmes CORS
const API_URL = '/api/auth';
const JWT_STORAGE_KEY = process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || 'eschool_token';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: UserRole;
    };
    token: string;
  };
  timestamp: string;
}
export interface RegisterRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  role: UserRole;
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
      console.debug('✅ Login successful, token received');
      
      if (data.data.token) {
        this.setToken(data.data.token);
      }
      console.log('User data:', data.data.user);
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
      
      if (result.data.token) {
        this.setToken(result.data.token);
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
   * Store token
   */
  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(JWT_STORAGE_KEY, token);
    }
  }

  /**
   * Clear token
   */
  private clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(JWT_STORAGE_KEY);
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
