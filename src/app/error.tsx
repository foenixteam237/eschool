"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Oups ! Quelque chose s'est mal passé.</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
                Une erreur est survenue lors du chargement de la page. Nos équipes ont été prévenues.
            </p>
            <div className="flex gap-4">
                <Button onClick={() => reset()} className="bg-primary-blue">
                    Réessayer
                </Button>
                <Button variant="outline" onClick={() => window.location.href = "/"}>
                    Retour à l'accueil
                </Button>
            </div>
            <pre className="mt-8 p-4 bg-slate-100 rounded-lg text-left text-xs text-slate-600 overflow-auto max-w-2xl">
                {error.message}
                {error.stack}
            </pre>
        </div>
    );
}
