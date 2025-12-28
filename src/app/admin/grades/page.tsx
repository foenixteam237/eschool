"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, TrendingUp, Award, AlertCircle, ArrowLeft, Search, Download, Eye, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function AdminGradesPage() {
    const router = useRouter();
    const [selectedSequence, setSelectedSequence] = useState("1");
    const [searchTerm, setSearchTerm] = useState("");

    const stats = [
        { label: "Moyenne Générale", value: "12.8/20", trend: "+0.5", color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Taux de Réussite", value: "76.3%", trend: "+3.2%", color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Élèves < 10/20", value: "87", trend: "-5", color: "text-red-600", bg: "bg-red-50" },
        { label: "Bulletins Générés", value: "1,156/1,248", trend: "92.6%", color: "text-primary-blue", bg: "bg-blue-50" },
    ];

    const sequences = [
        { id: "1", name: "Séquence 1", trimester: "1er Trimestre", period: "Sept - Oct" },
        { id: "2", name: "Séquence 2", trimester: "1er Trimestre", period: "Nov - Déc" },
        { id: "3", name: "Séquence 3", trimester: "2ème Trimestre", period: "Jan - Fév" },
        { id: "4", name: "Séquence 4", trimester: "2ème Trimestre", period: "Fév - Mars" },
        { id: "5", name: "Séquence 5", trimester: "3ème Trimestre", period: "Avr - Mai" },
        { id: "6", name: "Séquence 6", trimester: "3ème Trimestre", period: "Juin - Juil" },
    ];

    const classGrades = [
        { id: 1, class: "6ème A", level: "Sixième", students: 42, average: 12.5, highest: 18.5, lowest: 6.2, completed: 42, rate: 100, status: "validated" },
        { id: 2, class: "6ème B", level: "Sixième", students: 40, average: 13.2, highest: 19.0, lowest: 7.5, completed: 40, rate: 100, status: "validated" },
        { id: 3, class: "5ème A", level: "Cinquième", students: 38, average: 11.8, highest: 17.2, lowest: 5.8, completed: 38, rate: 100, status: "validated" },
        { id: 4, class: "5ème B", level: "Cinquième", students: 41, average: 12.9, highest: 18.0, lowest: 6.9, completed: 38, rate: 92.7, status: "pending" },
        { id: 5, class: "4ème A", level: "Quatrième", students: 36, average: 13.5, highest: 19.5, lowest: 8.2, completed: 36, rate: 100, status: "validated" },
        { id: 6, class: "3ème A", level: "Troisième", students: 39, average: 11.2, highest: 16.8, lowest: 4.5, completed: 35, rate: 89.7, status: "pending" },
        { id: 7, class: "3ème B", level: "Troisième", students: 37, average: 0, highest: 0, lowest: 0, completed: 0, rate: 0, status: "not_started" },
        { id: 8, class: "2nde A", level: "Seconde", students: 44, average: 14.2, highest: 18.9, lowest: 9.1, completed: 44, rate: 100, status: "validated" },
    ];

    const filteredClasses = classGrades.filter(c =>
        c.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.level.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "validated":
                return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">Validé</span>;
            case "pending":
                return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-700">En cours</span>;
            case "not_started":
                return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-500">Non débuté</span>;
            default:
                return null;
        }
    };

    const getAverageColor = (avg: number) => {
        if (avg >= 14) return "text-emerald-600";
        if (avg >= 12) return "text-blue-600";
        if (avg >= 10) return "text-amber-600";
        return "text-red-600";
    };

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestion des Notes</h1>
                    <p className="text-slate-500">Consultation et validation des notes par séquence</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Download size={18} />
                        Exporter Bulletins
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <Card key={idx} className="border-l-4 border-l-primary-blue">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                                <span className={cn("text-xs font-bold", stat.color)}>{stat.trend}</span>
                            </div>
                            <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Sequence Selector & Search */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <select
                            value={selectedSequence}
                            onChange={(e) => setSelectedSequence(e.target.value)}
                            className="h-10 px-4 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue min-w-64"
                        >
                            {sequences.map(seq => (
                                <option key={seq.id} value={seq.id}>
                                    {seq.name} - {seq.trimester} ({seq.period})
                                </option>
                            ))}
                        </select>
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <Input
                                placeholder="Rechercher une classe..."
                                className="pl-10 bg-slate-50 border-slate-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Classes Grades List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredClasses.map((classItem) => (
                    <Card
                        key={classItem.id}
                        className={cn(
                            "group hover:border-primary-blue/30 transition-all cursor-pointer hover:shadow-md",
                            classItem.status === "not_started" && "opacity-60"
                        )}
                        onClick={() => classItem.status !== "not_started" && router.push(`/admin/grades/${classItem.id}?sequence=${selectedSequence}`)}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between gap-6">
                                {/* Class Info */}
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-xl bg-primary-blue text-white flex flex-col items-center justify-center shadow-lg shadow-blue-200">
                                        <span className="text-xs font-black uppercase">{classItem.level.substring(0, 3)}</span>
                                        <span className="text-xl font-black leading-tight">{classItem.class.split(' ')[1]}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-blue transition-colors">
                                            {classItem.class}
                                        </h3>
                                        <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                                            <GraduationCap size={14} />
                                            {classItem.students} élèves
                                        </p>
                                    </div>
                                </div>

                                {/* Grades Stats */}
                                {classItem.status !== "not_started" ? (
                                    <div className="flex items-center gap-8">
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Moyenne</p>
                                            <p className={cn("text-3xl font-black mt-1", getAverageColor(classItem.average))}>
                                                {classItem.average.toFixed(1)}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Meilleure</p>
                                            <p className="text-xl font-black text-emerald-600 mt-1">{classItem.highest}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Faible</p>
                                            <p className="text-xl font-black text-red-600 mt-1">{classItem.lowest}</p>
                                        </div>
                                        <div className="text-center border-l-2 border-slate-200 pl-8">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Complétude</p>
                                            <p className="text-xl font-black text-slate-900 mt-1">
                                                {classItem.completed}/{classItem.students}
                                            </p>
                                            <p className="text-xs text-slate-400">({classItem.rate}%)</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <p className="text-slate-500 font-medium">Notes non saisies</p>
                                        <p className="text-xs text-slate-400 mt-1">En attente du professeur</p>
                                    </div>
                                )}

                                {/* Status & Actions */}
                                <div className="flex items-center gap-4">
                                    {getStatusBadge(classItem.status)}
                                    {classItem.status !== "not_started" && (
                                        <Button variant="ghost" size="icon" className="text-slate-300 group-hover:text-primary-blue">
                                            <Eye size={20} />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card
                    className="group hover:border-primary-blue/30 transition-all cursor-pointer"
                    onClick={() => router.push('/admin/grades/stats')}
                >
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base group-hover:text-primary-blue transition-colors">
                            <TrendingUp className="text-primary-blue" size={20} />
                            Statistiques Générales
                        </CardTitle>
                        <CardDescription>Vue d'ensemble des performances</CardDescription>
                    </CardHeader>
                </Card>
                <Card
                    className="group hover:border-primary-blue/30 transition-all cursor-pointer"
                    onClick={() => router.push('/admin/grades/ranking')}
                >
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base group-hover:text-primary-blue transition-colors">
                            <Award className="text-emerald-600" size={20} />
                            Classement Général
                        </CardTitle>
                        <CardDescription>Top 10 des meilleurs élèves</CardDescription>
                    </CardHeader>
                </Card>
                <Card
                    className="group hover:border-primary-blue/30 transition-all cursor-pointer"
                    onClick={() => router.push('/admin/grades/at-risk')}
                >
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base group-hover:text-primary-blue transition-colors">
                            <AlertCircle className="text-red-600" size={20} />
                            Élèves en Difficulté
                        </CardTitle>
                        <CardDescription>Suivi des élèves à risque</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
}
