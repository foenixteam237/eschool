"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, FileText, Plus, Search, Calendar, ChevronRight, Filter, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function TeacherLessonLogPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClass, setSelectedClass] = useState<string>("all");

    const logs = [
        { id: 1, date: "2025-12-23", class: "6ème A", classId: "1", title: "Equations du Second Degré", content: "Résolution par discriminant, exercices d'application", homework: "Exercices 5-8 page 42", duration: "2h", status: "Validé" },
        { id: 2, date: "2025-12-22", class: "3ème B", classId: "2", title: "Introduction à la Trigonométrie", content: "Cercle trigonométrique, sinus et cosinus", homework: "TD n°3", duration: "2h", status: "Validé" },
        { id: 3, date: "2025-12-20", class: "Terminale S", classId: "3", title: "Limites et Continuité", content: "Définitions, théorèmes fondamentaux", homework: "Exercices 1-4 page 125", duration: "3h", status: "En attente" },
        { id: 4, date: "2025-12-19", class: "6ème A", classId: "1", title: "Géométrie dans l'Espace", content: "Volumes et surfaces", homework: "", duration: "2h", status: "Validé" },
        { id: 5, date: "2025-12-18", class: "3ème B", classId: "2", title: "Théorème de Pythagore", content: "Applications et démonstrations", homework: "Exercices 10-12 page 58", duration: "2h", status: "Validé" },
    ];

    const classes = [
        { id: "all", name: "Toutes les classes" },
        { id: "1", name: "6ème A" },
        { id: "2", name: "3ème B" },
        { id: "3", name: "Terminale S" },
    ];

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClass = selectedClass === "all" || log.classId === selectedClass;
        return matchesSearch && matchesClass;
    });

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return {
            day: date.getDate().toString().padStart(2, '0'),
            month: date.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()
        };
    };

    const stats = {
        total: logs.length,
        thisWeek: logs.filter(l => {
            const logDate = new Date(l.date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return logDate >= weekAgo;
        }).length,
        pending: logs.filter(l => l.status === "En attente").length,
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-500 border border-slate-200 bg-white">
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Cahier de Texte</h1>
                        <p className="text-slate-500">Documentez vos séances de cours et devoirs donnés</p>
                    </div>
                </div>
                <Link href="/teacher/lesson-log/new">
                    <Button className="flex items-center gap-2 bg-primary-blue shadow-lg shadow-blue-100">
                        <Plus size={18} /> Nouvelle Séance
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-primary-blue">
                    <CardContent className="p-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Séances</p>
                        <p className="text-3xl font-black text-slate-900 mt-1">{stats.total}</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-emerald-500">
                    <CardContent className="p-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cette Semaine</p>
                        <p className="text-3xl font-black text-slate-900 mt-1">{stats.thisWeek}</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-amber-500">
                    <CardContent className="p-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">En Attente</p>
                        <p className="text-3xl font-black text-slate-900 mt-1">{stats.pending}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <Input
                                placeholder="Rechercher par titre ou contenu..."
                                className="pl-10 bg-slate-50 border-slate-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="h-10 px-4 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue min-w-48"
                        >
                            {classes.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Lesson Logs List */}
            <div className="space-y-4">
                {filteredLogs.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <BookOpen className="mx-auto text-slate-300 mb-4" size={48} />
                            <p className="text-slate-500 font-medium">Aucune séance trouvée</p>
                            <p className="text-sm text-slate-400 mt-1">Essayez de modifier vos filtres</p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredLogs.map((log) => {
                        const dateInfo = formatDate(log.date);
                        return (
                            <Card
                                key={log.id}
                                className="group hover:border-primary-blue/30 transition-all cursor-pointer hover:shadow-md"
                                onClick={() => router.push(`/teacher/lesson-log/${log.id}`)}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-6">
                                        {/* Date Badge */}
                                        <div className="w-16 h-16 rounded-xl bg-primary-blue text-white flex flex-col items-center justify-center border-2 border-blue-600 shadow-lg shadow-blue-200 flex-shrink-0">
                                            <span className="text-xs font-black uppercase">{dateInfo.month}</span>
                                            <span className="text-2xl font-black leading-tight">{dateInfo.day}</span>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 space-y-2">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-blue transition-colors">
                                                        {log.title}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                                                        <span className="font-semibold text-primary-blue">{log.class}</span>
                                                        • Mathématiques • {log.duration}
                                                    </p>
                                                </div>
                                                <span className={cn(
                                                    "text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap",
                                                    log.status === "Validé" ? "text-emerald-700 bg-emerald-100" : "text-amber-700 bg-amber-100"
                                                )}>
                                                    {log.status}
                                                </span>
                                            </div>

                                            <p className="text-sm text-slate-600 line-clamp-2">{log.content}</p>

                                            {log.homework && (
                                                <div className="flex items-start gap-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                                    <FileText className="text-primary-blue flex-shrink-0 mt-0.5" size={16} />
                                                    <div className="flex-1">
                                                        <p className="text-xs font-bold text-primary-blue uppercase tracking-wider">Devoirs</p>
                                                        <p className="text-sm text-slate-700 mt-0.5">{log.homework}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-slate-300 group-hover:text-primary-blue flex-shrink-0"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/teacher/lesson-log/${log.id}`);
                                            }}
                                        >
                                            <ChevronRight size={20} />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
