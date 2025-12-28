"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle, TrendingDown, Download, Eye, Phone, Mail, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function AdminGradesAtRiskPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSeverity, setSelectedSeverity] = useState("all");

    const atRiskStudents = [
        {
            id: 1,
            name: "KAMGA Jean",
            class: "3ème A",
            matricule: "2025-045",
            average: 6.2,
            failedSubjects: 5,
            absences: 12,
            severity: "critical",
            parent: { name: "Mme KAMGA", phone: "+237 6XX XXX XXX", email: "kamga@email.cm" }
        },
        {
            id: 2,
            name: "BELLA Marie",
            class: "5ème B",
            matricule: "2025-031",
            average: 7.8,
            failedSubjects: 4,
            absences: 8,
            severity: "high",
            parent: { name: "M. BELLA", phone: "+237 6XX XXX XXX", email: "bella@email.cm" }
        },
        {
            id: 3,
            name: "FOTSO Paul",
            class: "4ème A",
            matricule: "2025-028",
            average: 8.5,
            failedSubjects: 3,
            absences: 5,
            severity: "medium",
            parent: { name: "M. FOTSO", phone: "+237 6XX XXX XXX", email: "fotso@email.cm" }
        },
        {
            id: 4,
            name: "NGONO Anne",
            class: "6ème A",
            matricule: "2025-012",
            average: 5.5,
            failedSubjects: 6,
            absences: 15,
            severity: "critical",
            parent: { name: "Mme NGONO", phone: "+237 6XX XXX XXX", email: "ngono@email.cm" }
        },
        {
            id: 5,
            name: "MBALLA Oscar",
            class: "2nde A",
            matricule: "2025-067",
            average: 9.2,
            failedSubjects: 2,
            absences: 3,
            severity: "low",
            parent: { name: "M. MBALLA", phone: "+237 6XX XXX XXX", email: "mballa@email.cm" }
        },
    ];

    const severityLevels = [
        { id: "all", name: "Tous les niveaux", color: "" },
        { id: "critical", name: "Critique (<7)", color: "text-red-600" },
        { id: "high", name: "Élevé (7-8.5)", color: "text-orange-600" },
        { id: "medium", name: "Moyen (8.5-9.5)", color: "text-amber-600" },
        { id: "low", name: "Faible (9.5-10)", color: "text-yellow-600" },
    ];

    const filteredStudents = atRiskStudents.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.matricule.includes(searchTerm);
        const matchesSeverity = selectedSeverity === "all" || s.severity === selectedSeverity;
        return matchesSearch && matchesSeverity;
    });

    const getSeverityBadge = (severity: string) => {
        const config = {
            critical: { label: "Critique", color: "bg-red-100 text-red-700 border-red-200" },
            high: { label: "Élevé", color: "bg-orange-100 text-orange-700 border-orange-200" },
            medium: { label: "Moyen", color: "bg-amber-100 text-amber-700 border-amber-200" },
            low: { label: "Faible", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
        }[severity] || { label: "Inconnu", color: "bg-slate-100 text-slate-700" };

        return (
            <span className={cn("px-3 py-1 text-xs font-bold rounded-full border-2", config.color)}>
                {config.label}
            </span>
        );
    };

    const getAverageColor = (avg: number) => {
        if (avg < 7) return "text-red-600 bg-red-50";
        if (avg < 8.5) return "text-orange-600 bg-orange-50";
        if (avg < 9.5) return "text-amber-600 bg-amber-50";
        return "text-yellow-600 bg-yellow-50";
    };

    const stats = [
        { label: "Total Élèves en Difficulté", value: "87", color: "text-red-600", bg: "bg-red-50" },
        { label: "Niveau Critique", value: "23", color: "text-red-600", bg: "bg-red-50" },
        { label: "Suivi en Cours", value: "45", color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Taux d'Échec", value: "6.97%", color: "text-slate-600", bg: "bg-slate-50" },
    ];

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-500 border border-slate-200 bg-white">
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Élèves en Difficulté</h1>
                        <p className="text-slate-500">Suivi des élèves nécessitant une attention particulière</p>
                    </div>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                    <Download size={18} />
                    Exporter Liste
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <Card key={idx} className="border-l-4 border-l-red-500">
                        <CardContent className="p-4">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                            <p className={cn("text-3xl font-black mt-1", stat.color)}>{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <select
                            value={selectedSeverity}
                            onChange={(e) => setSelectedSeverity(e.target.value)}
                            className="h-10 px-4 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue min-w-64"
                        >
                            {severityLevels.map(level => (
                                <option key={level.id} value={level.id}>{level.name}</option>
                            ))}
                        </select>
                        <div className="relative flex-1">
                            <Input
                                placeholder="Rechercher un élève..."
                                className="pl-10 bg-slate-50 border-slate-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Students List */}
            <div className="space-y-4">
                {filteredStudents.map((student) => (
                    <Card
                        key={student.id}
                        className={cn(
                            "border-l-4 hover:shadow-lg transition-all",
                            student.severity === "critical" && "border-l-red-500 bg-red-50/20",
                            student.severity === "high" && "border-l-orange-500 bg-orange-50/20",
                            student.severity === "medium" && "border-l-amber-500 bg-amber-50/20",
                            student.severity === "low" && "border-l-yellow-500 bg-yellow-50/20"
                        )}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between gap-6">
                                {/* Student Info */}
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-black text-xl flex-shrink-0">
                                        {student.name.split(' ')[0][0]}{student.name.split(' ')[1][0]}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-slate-900">{student.name}</h3>
                                            {getSeverityBadge(student.severity)}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-slate-500">
                                            <span className="font-semibold">{student.class}</span>
                                            <span>•</span>
                                            <span>{student.matricule}</span>
                                        </div>

                                        {/* Parent Contact */}
                                        <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200">
                                            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Contact Parent</p>
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-slate-900">{student.parent.name}</p>
                                                <div className="flex items-center gap-4 text-xs text-slate-600">
                                                    <span className="flex items-center gap-1">
                                                        <Phone size={12} />
                                                        {student.parent.phone}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Mail size={12} />
                                                        {student.parent.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex items-start gap-6">
                                    <div className="text-center">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Moyenne</p>
                                        <p className={cn("text-3xl font-black px-4 py-2 rounded-lg mt-1", getAverageColor(student.average))}>
                                            {student.average}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Matières {'<'} 10</p>
                                        <p className="text-2xl font-black text-red-600 mt-1">{student.failedSubjects}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Absences</p>
                                        <p className="text-2xl font-black text-amber-600 mt-1">{student.absences}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2">
                                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                                        <Eye size={16} />
                                        Détails
                                    </Button>
                                    <Button size="sm" className="bg-primary-blue flex items-center gap-2">
                                        <Phone size={16} />
                                        Contacter
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Alert Info */}
            <Card className="border-amber-200 bg-amber-50">
                <CardContent className="p-4 flex items-start gap-3">
                    <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-amber-900">
                        <p className="font-bold">Recommandation</p>
                        <p className="mt-1">
                            Les élèves en niveau <strong>critique</strong> nécessitent une convocation immédiate des parents.
                            Un suivi hebdomadaire est recommandé pour tous les élèves listés.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
