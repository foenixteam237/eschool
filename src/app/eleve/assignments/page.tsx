"use client";

import { FileText, Clock, CheckCircle2, AlertCircle, Upload, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function StudentAssignmentsPage() {
    const homeworks = [
        { title: "Dissertation de Français", subject: "Français", due: "24 Déc 2025", status: "pending", priority: "high" },
        { title: "Exercices Trigonométrie", subject: "Mathématiques", due: "26 Déc 2025", status: "submitted", priority: "medium" },
        { title: "Rapport de TP SVT", subject: "SVT", due: "28 Déc 2025", status: "graded", mark: "15/20" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Mes Devoirs & Travaux</h1>
                <p className="text-slate-500">Gérez vos rendus et consultez vos notes de devoirs.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {homeworks.map((hw, i) => (
                        <Card key={i} className="hover:shadow-md transition-shadow transition-transform hover:-translate-y-1">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-4">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                                            hw.status === "submitted" ? "bg-emerald-50 text-emerald-600" :
                                                hw.status === "graded" ? "bg-blue-50 text-primary-blue" : "bg-amber-50 text-amber-600"
                                        )}>
                                            {hw.status === "graded" ? <CheckCircle2 size={24} /> : <FileText size={24} />}
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-slate-900">{hw.title}</h3>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{hw.subject}</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                                    <Clock size={12} /> Échéance: {hw.due}
                                                </span>
                                                {hw.priority === 'high' && (
                                                    <span className="text-[10px] font-black text-red-500 flex items-center gap-1 uppercase">
                                                        <AlertCircle size={12} /> Urgent
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {hw.status === "graded" ? (
                                            <div className="text-center bg-slate-900 text-white px-3 py-1 rounded-lg">
                                                <p className="text-[10px] uppercase font-bold text-slate-400">Note</p>
                                                <p className="text-lg font-black">{hw.mark}</p>
                                            </div>
                                        ) : (
                                            <Button variant={hw.status === "submitted" ? "outline" : "default"} className="font-bold text-xs uppercase h-8 px-4">
                                                {hw.status === "submitted" ? "Détails" : "Rendre le travail"}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="bg-slate-50 border-none h-fit">
                    <CardHeader>
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Statistiques Rendus</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-slate-700">
                                <span>Taux de complétion</span>
                                <span>85%</span>
                            </div>
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-success-green w-[85%]" />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <div className="p-4 bg-white rounded-xl shadow-sm space-y-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">En attente de notation</p>
                                <p className="text-sm font-extrabold text-slate-800">12 Exercices</p>
                            </div>
                            <div className="p-4 bg-white rounded-xl shadow-sm space-y-2 border-l-4 border-red-500">
                                <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Retards constatés</p>
                                <p className="text-sm font-extrabold text-slate-800">1 Devoir (Histoire)</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

