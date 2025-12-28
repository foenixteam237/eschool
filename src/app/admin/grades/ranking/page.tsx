"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Award, TrendingUp, Download, Eye, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function AdminGradesRankingPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("all");

    const topStudents = [
        { rank: 1, name: "FOTSO Paul", class: "Terminale S", matricule: "2025-103", average: 18.75, subjects: 8, medal: "🥇" },
        { rank: 2, name: "BELLA Marie", class: "1ère S", matricule: "2025-087", average: 18.25, subjects: 8, medal: "🥈" },
        { rank: 3, name: "NGONO Anne", class: "2nde A", matricule: "2025-065", average: 17.85, subjects: 8, medal: "🥉" },
        { rank: 4, name: "ABENA Carole", class: "Terminale S", matricule: "2025-105", average: 17.60, subjects: 8, medal: "" },
        { rank: 5, name: "MBALLA Oscar", class: "1ère S", matricule: "2025-089", average: 17.45, subjects: 8, medal: "" },
        { rank: 6, name: "KAMGA Jean", class: "Terminale S", matricule: "2025-104", average: 17.20, subjects: 8, medal: "" },
        { rank: 7, name: "TALLA Sophie", class: "2nde A", matricule: "2025-067", average: 17.05, subjects: 8, medal: "" },
        { rank: 8, name: "NKOMO André", class: "1ère S", matricule: "2025-088", average: 16.90, subjects: 8, medal: "" },
        { rank: 9, name: "BIYA Sylvie", class: "Terminale S", matricule: "2025-106", average: 16.75, subjects: 8, medal: "" },
        { rank: 10, name: "ETOA Francis", class: "2nde A", matricule: "2025-068", average: 16.60, subjects: 8, medal: "" },
    ];

    const levels = [
        { id: "all", name: "Tous les niveaux" },
        { id: "6eme", name: "Sixième" },
        { id: "5eme", name: "Cinquième" },
        { id: "4eme", name: "Quatrième" },
        { id: "3eme", name: "Troisième" },
        { id: "2nde", name: "Seconde" },
        { id: "1ere", name: "Première" },
        { id: "tle", name: "Terminale" },
    ];

    const filteredStudents = topStudents.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.matricule.includes(searchTerm)
    );

    const getRankBadge = (rank: number) => {
        if (rank === 1) {
            return (
                <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-2xl shadow-lg">
                        🥇
                    </div>
                    <span className="text-2xl font-black text-yellow-600">1er</span>
                </div>
            );
        }
        if (rank === 2) {
            return (
                <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-2xl shadow-lg">
                        🥈
                    </div>
                    <span className="text-2xl font-black text-slate-600">2ème</span>
                </div>
            );
        }
        if (rank === 3) {
            return (
                <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-2xl shadow-lg">
                        🥉
                    </div>
                    <span className="text-2xl font-black text-orange-600">3ème</span>
                </div>
            );
        }
        return (
            <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-600 text-lg">
                    {rank}
                </div>
                <span className="text-xl font-bold text-slate-600">{rank}ème</span>
            </div>
        );
    };

    const getAverageColor = (avg: number) => {
        if (avg >= 18) return "text-emerald-600 bg-emerald-50";
        if (avg >= 16) return "text-blue-600 bg-blue-50";
        return "text-cyan-600 bg-cyan-50";
    };

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-500 border border-slate-200 bg-white">
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Classement Général</h1>
                        <p className="text-slate-500">Top 10 des meilleurs élèves de l'établissement</p>
                    </div>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                    <Download size={18} />
                    Exporter PDF
                </Button>
            </div>

            {/* Podium */}
            <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="p-8">
                    <div className="flex items-end justify-center gap-8">
                        {/* 2nd Place */}
                        <div className="flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 flex items-center justify-center text-6xl shadow-2xl mb-4 border-4 border-white">
                                🥈
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-lg min-w-[200px] text-center">
                                <p className="text-sm font-bold text-slate-500 uppercase">2ème Place</p>
                                <h3 className="text-lg font-black text-slate-900 mt-1">{topStudents[1].name}</h3>
                                <p className="text-sm text-slate-500">{topStudents[1].class}</p>
                                <p className="text-3xl font-black text-slate-600 mt-2">{topStudents[1].average}</p>
                            </div>
                        </div>

                        {/* 1st Place */}
                        <div className="flex flex-col items-center -mt-8">
                            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center text-7xl shadow-2xl mb-4 border-4 border-white animate-pulse">
                                🥇
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-2xl min-w-[240px] text-center border-4 border-yellow-400">
                                <p className="text-sm font-bold text-yellow-600 uppercase flex items-center justify-center gap-2">
                                    <Award size={16} />
                                    1ère Place
                                </p>
                                <h3 className="text-xl font-black text-slate-900 mt-1">{topStudents[0].name}</h3>
                                <p className="text-sm text-slate-500">{topStudents[0].class}</p>
                                <p className="text-4xl font-black text-yellow-600 mt-2">{topStudents[0].average}</p>
                            </div>
                        </div>

                        {/* 3rd Place */}
                        <div className="flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-6xl shadow-2xl mb-4 border-4 border-white">
                                🥉
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-lg min-w-[200px] text-center">
                                <p className="text-sm font-bold text-slate-500 uppercase">3ème Place</p>
                                <h3 className="text-lg font-black text-slate-900 mt-1">{topStudents[2].name}</h3>
                                <p className="text-sm text-slate-500">{topStudents[2].class}</p>
                                <p className="text-3xl font-black text-orange-600 mt-2">{topStudents[2].average}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Filters */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <select
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                            className="h-10 px-4 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue"
                        >
                            {levels.map(level => (
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

            {/* Full Ranking */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="text-primary-blue" size={20} />
                        Classement Complet
                    </CardTitle>
                    <CardDescription>Top 10 des meilleurs élèves</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {filteredStudents.map((student) => (
                            <div
                                key={student.rank}
                                className={cn(
                                    "flex items-center justify-between p-4 rounded-xl border-2 transition-all hover:shadow-md",
                                    student.rank === 1 && "border-yellow-300 bg-yellow-50/50",
                                    student.rank === 2 && "border-slate-300 bg-slate-50/50",
                                    student.rank === 3 && "border-orange-300 bg-orange-50/50",
                                    student.rank > 3 && "border-slate-200 hover:border-primary-blue/30"
                                )}
                            >
                                <div className="flex items-center gap-6 flex-1">
                                    {getRankBadge(student.rank)}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-slate-900">{student.name}</h3>
                                        <div className="flex items-center gap-4 mt-1">
                                            <p className="text-sm text-slate-500">{student.class}</p>
                                            <span className="text-xs text-slate-400">•</span>
                                            <p className="text-sm text-slate-500">{student.matricule}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-center">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Matières</p>
                                        <p className="text-lg font-bold text-slate-900">{student.subjects}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Moyenne</p>
                                        <p className={cn("text-3xl font-black px-4 py-1 rounded-lg", getAverageColor(student.average))}>
                                            {student.average}
                                        </p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-slate-300 hover:text-primary-blue">
                                        <Eye size={20} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
