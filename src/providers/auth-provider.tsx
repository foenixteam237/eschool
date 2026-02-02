"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/hooks/use-auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const checkAuth = useAuthStore((state) => state.checkAuth);

    useEffect(() => {
        // Vérifier l'authentification au chargement
        checkAuth();
    }, [checkAuth]);

    return <>{children}</>;
}
