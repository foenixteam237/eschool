"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, LogIn, Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/hooks/use-auth-store";
import { UI_AREA_BY_ROLE } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function LoginPage() {
    const router = useRouter();
    const { login, isLoading, error, setError } = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await login({ email, password });

            // Redirection vers l'espace correspondant au rôle
            const area = UI_AREA_BY_ROLE[response.user.role] || "eleve";
            router.push(`/${area}/dashboard`);
        } catch {
            // L'erreur est déjà positionnée dans le store
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
            <Card className="w-full max-w-md shadow-2xl border-none">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto p-3 bg-primary-blue rounded-xl text-white w-fit shadow-lg">
                        <GraduationCap size={32} />
                    </div>
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
                        <CardDescription>Entrez vos identifiants pour accéder à votre espace</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Alert */}
                        {error && (
                            <div className="p-3 rounded-md bg-red-50 border border-red-200 flex items-start gap-3">
                                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                                <Input
                                    type="email"
                                    placeholder="nom@ecole.com"
                                    className="pl-10"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 text-base font-bold shadow-md hover:shadow-lg transition-all"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" size={18} />
                                    Connexion en cours...
                                </>
                            ) : (
                                <>
                                    <LogIn className="mr-2" size={18} />
                                    Se connecter
                                </>
                            )}
                        </Button>

                        <p className="text-center text-sm text-slate-500">
                            <a href="#" className="text-primary-blue hover:underline">Mot de passe oublié ?</a>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
