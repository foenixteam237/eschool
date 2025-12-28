"use client";

import { useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Download, CheckCircle, XCircle, Search, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import StudentReportCardModal from "@/components/admin/student-report-card-modal";

export default function AdminGradesDetailPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const classId = params.id;
    const sequenceId = searchParams.get("sequence") || "1";

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStudent, setSelectedStudent] = useState<number | null>(null);

    const classInfo = {
        "1": { name: "6ème A", level: "Sixième", average: 12.5, highest: 18.5, lowest: 6.2 },
        "2": { name: "6ème B", level: "Sixième", average: 13.2, highest: 19.0, lowest: 7.5 },
    }[classId as string] || { name: "Classe", level: "-", average: 0, highest: 0, lowest: 0 };

    const sequenceInfo = {
        "1": { name: "Séquence 1", trimester: "1er Trimestre" },
        "2": { name: "Séquence 2", trimester: "1er Trimestre" },
        "3": { name: "Séquence 3", trimester: "2ème Trimestre" },
        "4": { name: "Séquence 4", trimester: "2ème Trimestre" },
        "5": { name: "Séquence 5", trimester: "3ème Trimestre" },
        "6": { name: "Séquence 6", trimester: "3ème Trimestre" },
    }[sequenceId] || { name: "Séquence", trimester: "Trimestre" };

    const students = [
        { id: 1, name: "ABENA Carole", matricule: "2025-001", math: 14.5, physics: 12.0, french: 15.5, english: 13.0, average: 13.75, rank: 5, status: "validated" },
        { id: 2, name: "BELLA Marie", matricule: "2025-002", math: 16.0, physics: 14.5, french: 17.0, english: 15.5, average: 15.75, rank: 2, status: "validated" },
        { id: 3, name: "FOTSO Paul", matricule: "2025-003", math: 18.5, physics: 17.0, french: 18.0, english: 17.5, average: 17.75, rank: 1, status: "validated" },
        { id: 4, name: "KAMGA Jean", matricule: "2025-004", math: 11.0, physics: 10.5, french: 12.0, english: 11.5, average: 11.25, rank: 8, status: "validated" },
        { id: 5, name: "NGONO Anne", matricule: "2025-005", math: 15.5, physics: 14.0, french: 16.0, english: 14.5, average: 15.0, rank: 3, status: "validated" },
        { id: 6, name: "MBALLA Oscar", matricule: "2025-006", math: 9.5, physics: 8.0, french: 10.0, english: 9.0, average: 9.125, rank: 12, status: "pending" },
    ];

    const subjects = ["Mathématiques", "Physique/Chimie", "Français", "Anglais"];

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.matricule.includes(searchTerm)
    );

    const getGradeColor = (grade: number) => {
        if (grade >= 16) return "text-emerald-600 bg-emerald-50";
        if (grade >= 14) return "text-blue-600 bg-blue-50";
        if (grade >= 12) return "text-cyan-600 bg-cyan-50";
        if (grade >= 10) return "text-amber-600 bg-amber-50";
        return "text-red-600 bg-red-50";
    };

    const getRankBadge = (rank: number) => {
        if (rank === 1) return <span className="px-2 py-1 text-xs font-black rounded bg-yellow-100 text-yellow-800">🥇 1er</span>;
        if (rank === 2) return <span className="px-2 py-1 text-xs font-black rounded bg-slate-200 text-slate-700">🥈 2ème</span>;
        if (rank === 3) return <span className="px-2 py-1 text-xs font-black rounded bg-orange-100 text-orange-700">🥉 3ème</span>;
        return <span className="px-2 py-1 text-xs font-bold rounded bg-slate-100 text-slate-600">{rank}ème</span>;
    };

    return (
        <div className="space-y-6 pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-500 border border-slate-200 bg-white">
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Notes - {classInfo.name}</h1>
                    <p className="text-slate-500">{sequenceInfo.name} • {sequenceInfo.trimester}</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-primary-blue">
                    <CardContent className="p-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Moyenne Classe</p>
                        <p className="text-3xl font-black text-primary-blue mt-1">{classInfo.average.toFixed(2)}</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-emerald-500">
                    <CardContent className="p-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Meilleure Note</p>
                        <p className="text-3xl font-black text-emerald-600 mt-1">{classInfo.highest}</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-red-500">
                    <CardContent className="p-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Note la Plus Faible</p>
                        <p className="text-3xl font-black text-red-600 mt-1">{classInfo.lowest}</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-amber-500">
                    <CardContent className="p-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Taux de Réussite</p>
                        <p className="text-3xl font-black text-amber-600 mt-1">85.7%</p>
                    </CardContent>
                </Card>
            </div>

            {/* Actions & Search */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <Input
                                placeholder="Rechercher un élève..."
                                className="pl-10 bg-slate-50 border-slate-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="flex items-center gap-2">
                                <Download size={18} />
                                Exporter Excel
                            </Button>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Printer size={18} />
                                Bulletins
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Grades Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Notes par Élève</CardTitle>
                    <CardDescription>Détail des notes pour {sequenceInfo.name}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left p-3 text-xs font-bold text-slate-500 uppercase">Rang</th>
                                    <th className="text-left p-3 text-xs font-bold text-slate-500 uppercase">Matricule</th>
                                    <th className="text-left p-3 text-xs font-bold text-slate-500 uppercase">Nom Complet</th>
                                    <th className="text-center p-3 text-xs font-bold text-slate-500 uppercase">Math</th>
                                    <th className="text-center p-3 text-xs font-bold text-slate-500 uppercase">Physique</th>
                                    <th className="text-center p-3 text-xs font-bold text-slate-500 uppercase">Français</th>
                                    <th className="text-center p-3 text-xs font-bold text-slate-500 uppercase">Anglais</th>
                                    <th className="text-center p-3 text-xs font-bold text-slate-500 uppercase">Moyenne</th>
                                    <th className="text-center p-3 text-xs font-bold text-slate-500 uppercase">Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student) => (
                                    <tr
                                        key={student.id}
                                        className="border-b border-slate-100 hover:bg-blue-50 transition-colors cursor-pointer"
                                        onClick={() => setSelectedStudent(student.id)}
                                    >
                                        <td className="p-3">
                                            {getRankBadge(student.rank)}
                                        </td>
                                        <td className="p-3 text-sm text-slate-500 font-medium">{student.matricule}</td>
                                        <td className="p-3 text-sm font-bold text-slate-900">{student.name}</td>
                                        <td className="p-3 text-center">
                                            <span className={cn("px-2 py-1 text-sm font-bold rounded", getGradeColor(student.math))}>
                                                {student.math}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <span className={cn("px-2 py-1 text-sm font-bold rounded", getGradeColor(student.physics))}>
                                                {student.physics}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <span className={cn("px-2 py-1 text-sm font-bold rounded", getGradeColor(student.french))}>
                                                {student.french}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <span className={cn("px-2 py-1 text-sm font-bold rounded", getGradeColor(student.english))}>
                                                {student.english}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <span className={cn("px-3 py-1.5 text-base font-black rounded", getGradeColor(student.average))}>
                                                {student.average.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center">
                                            {student.status === "validated" ? (
                                                <CheckCircle className="inline text-emerald-600" size={20} />
                                            ) : (
                                                <XCircle className="inline text-amber-600" size={20} />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Student Report Card Modal */}
            {selectedStudent !== null && (() => {
                const student = students.find(s => s.id === selectedStudent);
                if (!student) return null;

                const studentGrades = [
                    { subject: "Mathématiques", grade: student.math, coef: 4, teacher: "M. DUPONT" },
                    { subject: "Physique/Chimie", grade: student.physics, coef: 3, teacher: "Mme MARTIN" },
                    { subject: "Français", grade: student.french, coef: 4, teacher: "M. BERNARD" },
                    { subject: "Anglais", grade: student.english, coef: 2, teacher: "Mme DUBOIS" },
                    { subject: "SVT", grade: 13.5, coef: 2, teacher: "M. LAURENT" },
                    { subject: "Histoire-Géo", grade: 14.0, coef: 2, teacher: "Mme PETIT" },
                    { subject: "EPS", grade: 15.0, coef: 1, teacher: "M. MOREAU" },
                ];

                return (
                    <StudentReportCardModal
                        student={{
                            name: student.name,
                            matricule: student.matricule,
                            class: classInfo.name,
                            average: classInfo.average,
                            rank: student.rank
                        }}
                        grades={studentGrades}
                        sequenceInfo={sequenceInfo}
                        onClose={() => setSelectedStudent(null)}
                    />
                );
            })()}
        </div>
    );
}
