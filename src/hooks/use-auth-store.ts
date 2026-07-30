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

            // L'API renvoie { user, token }
            if (!response || !response.user) {
                throw new Error('Réponse serveur invalide');
            }

            // Update store with user data
            set({
                user: {
                    id: response.user.id,
                    firstName: response.user.firstName,
                    lastName: response.user.lastName,
                    email: response.user.email,
                    role: response.user.role,
                    estActif: true,
                },
                role: response.user.role,
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
