"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, LogIn, Mail, Lock, Loader2 } from "lucide-react";
import { useAuthStore } from "@/hooks/use-auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserRole } from "@/types";

export default function LoginPage() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<UserRole>("ADMIN");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            login(email, role);
            setLoading(false);

            const rolePaths: Record<UserRole, string> = {
                ADMIN: "admin",
                ENSEIGNANT: "teacher",
                PARENT: "parent",
                ELEVE: "eleve"
            };

            router.push(`/${rolePaths[role]}/dashboard`);
        }, 1500);
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
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Rôle (Simulation)</label>
                            <select
                                className="w-full h-10 rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm focus:ring-1 focus:ring-primary-blue outline-none"
                                value={role}
                                onChange={(e) => setRole(e.target.value as UserRole)}
                            >
                                <option value="ADMIN">Administrateur</option>
                                <option value="ENSEIGNANT">Enseignant</option>
                                <option value="PARENT">Parent</option>
                                <option value="ELEVE">Élève</option>
                            </select>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 text-base font-bold shadow-md hover:shadow-lg transition-all"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" /> : <LogIn className="mr-2" size={18} />}
                            Se connecter
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
