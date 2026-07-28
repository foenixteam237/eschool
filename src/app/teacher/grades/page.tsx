"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FileText, Settings, ArrowLeft, BarChart3, Users, Printer, Calendar, CheckCircle2, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function TeacherGradesDashboardInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const classId = searchParams.get("classId") || "1";

    const classInfo = {
        "1": { name: "6ème A", subject: "Mathématiques", isMainTeacher: true },
        "2": { name: "3ème B", subject: "Physique", isMainTeacher: false },
        "3": { name: "Terminale S", subject: "Mathématiques", isMainTeacher: false }
    }[classId] || { name: "Classe Inconnue", subject: "Matière Inconnue", isMainTeacher: false };

    const [activeTab, setActiveTab] = useState("evaluations");

    // Structure: 3 trimestres, chacun avec 2 séquences
    const trimesters = [
        {
            id: 1,
            name: "1er Trimestre",
            period: "Sept - Déc 2025",
            status: "completed",
            average: 12.15,
            sequences: [
                { id: 1, name: "Séquence 1", period: "Sept - Oct", status: "completed", average: 12.5, studentsGraded: 42 },
                { id: 2, name: "Séquence 2", period: "Nov - Déc", status: "completed", average: 11.8, studentsGraded: 42 },
            ]
        },
        {
            id: 2,
            name: "2ème Trimestre",
            period: "Jan - Mars 2026",
            status: "active",
            average: 13.2,
            sequences: [
                { id: 3, name: "Séquence 3", period: "Jan - Fév", status: "completed", average: 13.2, studentsGraded: 42 },
                { id: 4, name: "Séquence 4", period: "Fév - Mars", status: "active", average: null, studentsGraded: 15 },
            ]
        },
        {
            id: 3,
            name: "3ème Trimestre",
            period: "Avr - Juil 2026",
            status: "upcoming",
            average: null,
            sequences: [
                { id: 5, name: "Séquence 5", period: "Avr - Mai", status: "upcoming", average: null, studentsGraded: 0 },
                { id: 6, name: "Séquence 6", period: "Juin - Juil", status: "upcoming", average: null, studentsGraded: 0 },
            ]
        },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "completed": return <span className="px-2.5 py-0.5 text-xs rounded-md border border-transparent font-bold bg-emerald-100 text-emerald-700">Terminé</span>;
            case "active": return <span className="px-2.5 py-0.5 text-xs rounded-md border border-transparent font-bold bg-indigo-100 text-indigo-700">En cours</span>;
            case "upcoming": return <span className="px-2.5 py-0.5 text-xs rounded-md border border-slate-200 text-slate-400 bg-slate-50">À venir</span>;
            default: return null;
        }
    };

    const getSequenceStatusIcon = (status: string) => {
        switch (status) {
            case "completed": return <CheckCircle2 className="text-emerald-500" size={18} />;
            case "active": return <Calendar className="text-indigo-500" size={18} />;
            case "upcoming": return <Calendar className="text-slate-300" size={18} />;
            default: return null;
        }
    };

    const handleSequenceClick = (sequenceId: number, status: string) => {
        if (status !== "upcoming") {
            router.push(`/teacher/grades/entry?classId=${classId}&sequenceId=${sequenceId}`);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-500 border border-slate-200 bg-white">
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestion des Notes</h1>
                        <p className="text-slate-500">
                            {classInfo.name} • {classInfo.subject}
                            {classInfo.isMainTeacher && <span className="text-primary-blue font-bold"> • Prof. Principal</span>}
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-slate-100 p-1 rounded-lg inline-flex">
                    <button
                        onClick={() => setActiveTab("evaluations")}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "evaluations" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
                    >
                        Notes par Séquence
                    </button>
                    {classInfo.isMainTeacher && (
                        <button
                            onClick={() => setActiveTab("main-teacher")}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === "main-teacher" ? "bg-white text-primary-blue shadow-sm" : "text-primary-blue/70 hover:text-primary-blue"}`}
                        >
                            Espace Prof. Principal
                        </button>
                    )}
                </div>

                {/* Trimestre View */}
                {activeTab === "evaluations" && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {trimesters.map((trimester) => (
                            <div key={trimester.id} className="space-y-4">
                                {/* Trimester Header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <BookOpen className="text-primary-blue" size={24} />
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900">{trimester.name}</h2>
                                            <p className="text-sm text-slate-500">{trimester.period}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {trimester.average && (
                                            <div className="text-right">
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Moy. Trimestre</p>
                                                <p className="text-2xl font-black text-slate-900">{trimester.average}<span className="text-sm text-slate-400">/20</span></p>
                                            </div>
                                        )}
                                        {getStatusBadge(trimester.status)}
                                    </div>
                                </div>

                                {/* Sequences Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-12">
                                    {trimester.sequences.map((sequence) => (
                                        <Card
                                            key={sequence.id}
                                            className={`group transition-all ${sequence.status === "upcoming" ? "opacity-60" : "cursor-pointer hover:border-primary-blue/50 hover:shadow-md"} ${sequence.status === "active" ? "border-primary-blue shadow-md shadow-blue-100" : ""}`}
                                            onClick={() => handleSequenceClick(sequence.id, sequence.status)}
                                        >
                                            <CardContent className="p-5">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        {getSequenceStatusIcon(sequence.status)}
                                                        <div>
                                                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-blue transition-colors">
                                                                {sequence.name}
                                                            </h3>
                                                            <p className="text-xs text-slate-500">{sequence.period}</p>
                                                        </div>
                                                    </div>
                                                    {getStatusBadge(sequence.status)}
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                                                    <div>
                                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Notes saisies</p>
                                                        <p className="text-xl font-black text-slate-900">
                                                            {sequence.studentsGraded}<span className="text-sm text-slate-400 font-medium">/42</span>
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Moyenne</p>
                                                        <p className="text-xl font-black text-slate-900">
                                                            {sequence.average || "--"}<span className="text-sm text-slate-400">/20</span>
                                                        </p>
                                                    </div>
                                                </div>

                                                {sequence.status !== "upcoming" && (
                                                    <div className="mt-3 pt-3 border-t border-slate-100">
                                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                                            <FileText size={12} />
                                                            {sequence.status === "completed" ? "Voir/Modifier les notes" : "Saisir les notes"}
                                                        </p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Main Teacher Section */}
                {activeTab === "main-teacher" && classInfo.isMainTeacher && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="group hover:border-primary-blue/30 transition-all cursor-pointer">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                                        <Settings size={24} />
                                    </div>
                                    <CardTitle>Paramètres d'Évaluation</CardTitle>
                                    <CardDescription>Configurez les coefficients par matière et les seuils de passage.</CardDescription>
                                </CardHeader>
                            </Card>
                            <Card className="group hover:border-primary-blue/30 transition-all cursor-pointer">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                                        <Printer size={24} />
                                    </div>
                                    <CardTitle>Bulletins de Notes</CardTitle>
                                    <CardDescription>Générez les bulletins séquentiels, trimestriels ou annuels.</CardDescription>
                                </CardHeader>
                            </Card>
                            <Card className="group hover:border-primary-blue/30 transition-all cursor-pointer">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                                        <BarChart3 size={24} />
                                    </div>
                                    <CardTitle>Statistiques de Classe</CardTitle>
                                    <CardDescription>Analysez la performance globale par séquence et trimestre.</CardDescription>
                                </CardHeader>
                            </Card>
                            <Card className="group hover:border-primary-blue/30 transition-all cursor-pointer">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                                        <Users size={24} />
                                    </div>
                                    <CardTitle>Conseil de Classe</CardTitle>
                                    <CardDescription>Préparez les documents de synthèse pour le conseil de classe.</CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function TeacherGradesDashboard() {
    return (
        <Suspense fallback={<div className="p-8 text-slate-500">Chargement…</div>}>
            <TeacherGradesDashboardInner />
        </Suspense>
    );
}
