import { create } from "zustand";
import { User, UserRole } from "@/types";
import { authService, LoginRequest, LoginResponse } from "@/services/auth.service";
import { formatAuthError, formatErrorForConsole } from "@/lib/error-formatter";

interface AuthState {
    user: User | null;
    role: UserRole | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (credentials: LoginRequest) => Promise<LoginResponse>;
    logout: () => Promise<void>;
    setError: (error: string | null) => void;
    checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    role: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authService.login(credentials);
            
            console.log('📦 Login response structure:', response);
            console.log('📦 response.data:', response.data);
            
            // Vérifier que la réponse a la bonne structure
            if (!response || !response.data || !response.data.user) {
                console.error('❌ Invalid response structure:', response);
                throw new Error('Réponse serveur invalide');
            }
            
            // Update store with user data
            set({
                user: { 
                    id: response.data.user.id, 
                    firstName: response.data.user.firstName, 
                    lastName: response.data.user.lastName, 
                    email: response.data.user.email, 
                    role: response.data.user.role, 
                    estActif: true 
                },
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });

            return response;
        } catch (error) {
            formatErrorForConsole(error);
            const userFriendlyError = formatAuthError(error);
            set({
                isLoading: false,
                error: userFriendlyError,
                isAuthenticated: false,
                user: null,
                role: null,
            });
            throw error;
        }
    },
    logout: async () => {
        set({ isLoading: true });
        try {
            await authService.logout();
        } finally {
            set({
                user: null,
                role: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });
        }
    },
    setError: (error) => set({ error }),
    checkAuth: () => {
        const isAuth = authService.isAuthenticated();
        set({ isAuthenticated: isAuth });
    },
}));
