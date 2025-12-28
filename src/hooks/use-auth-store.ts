import { create } from "zustand";
import { User, UserRole } from "@/types";

interface AuthState {
    user: User | null;
    role: UserRole | null;
    isAuthenticated: boolean;
    login: (email: string, role: UserRole) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    role: null,
    isAuthenticated: false,
    login: (email, role) => {
        // Mock user data based on role
        const mockUser: User = {
            id: "1",
            email,
            nom: "Utilisateur",
            prenom: role.charAt(0) + role.slice(1).toLowerCase(),
            role,
            estActif: true,
        };
        set({ user: mockUser, role, isAuthenticated: true });
    },
    logout: () => set({ user: null, role: null, isAuthenticated: false }),
}));
