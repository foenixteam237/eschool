"use client";

import {
    Users,
    BookOpen,
    CreditCard,
    AlertCircle,
    TrendingUp,
    FileCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ParentDashboard() {
    const children = [
        { name: "Kamga Jean", class: "3ème B", status: "À l'école", lastMark: "14/20 (Maths)", finance: "À jour" },
        { name: "Kamga Marie", class: "6ème A", status: "À l'école", lastMark: "16.5/20 (Anglais)", finance: "Solde: 25.000 FCFA" },
    ];

    return (
        <div className="space-y-8 pb-20 md:pb-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Bonjour, Mme Bella</h1>
                <p className="text-slate-500 text-sm md:text-base">Suivez la scolarité de vos enfants en temps réel.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
                {children.map((child, i) => (
                    <Card key={i} className={cn("overflow-hidden border-none shadow-lg", i === 0 ? "bg-primary-blue" : "bg-success-green")}>
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="text-white/70 text-sm font-medium uppercase tracking-wider">Élève</p>
                                    <h3 className="text-2xl font-bold">{child.name}</h3>
                                    <p className="text-white/80">{child.class}</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                    <span className="text-xl font-bold">{child.name.charAt(0)}</span>
                                </div>
                            </div>
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div className="bg-white/10 p-3 rounded-lg">
                                    <p className="text-xs text-white/60">Statut Présence</p>
                                    <p className="text-sm font-bold">{child.status}</p>
                                </div>
                                <div className="bg-white/10 p-3 rounded-lg">
                                    <p className="text-xs text-white/60">Finances</p>
                                    <p className="text-sm font-bold">{child.finance}</p>
                                </div>
                            </div>
                            <Button className="w-full mt-6 bg-white text-slate-900 hover:bg-slate-100 font-bold">
                                Consulter le Bulletin
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileCheck className="text-primary-blue" /> Notifications Récentes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-3 rounded-lg border border-slate-100">
                                <div className="p-2 bg-blue-50 text-primary-blue rounded-lg">
                                    <TrendingUp size={18} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-800">Nouvelle Note disponible: Marie</p>
                                    <p className="text-xs text-slate-500 italic">Mathématiques: 15/20 • Il y a 2 heures</p>
                                </div>
                                <Button variant="ghost" size="sm">Voir</Button>
                            </div>
                            <div className="flex items-start gap-4 p-3 rounded-lg border border-red-100 bg-red-50/30">
                                <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                                    <AlertCircle size={18} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-800">Alerte Échéance: Marie</p>
                                    <p className="text-xs text-red-600 font-medium italic">Mensualité de Décembre en attente</p>
                                </div>
                                <Button className="bg-red-500 text-white hover:bg-red-600" size="sm">Payer</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Messagerie Directe</CardTitle>
                        <CardDescription>Contactez les enseignants</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2].map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-800 truncate">M. Dupont (Titulaire Marie)</p>
                                        <p className="text-[10px] text-slate-500 truncate">En ligne</p>
                                    </div>
                                    <Button variant="outline" size="sm" className="h-7 text-[10px] px-2">Écrire</Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Global utility for cn if not already defined (just in case import fails)
