"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, Users, TrendingDown, ArrowLeft, Search, Filter, Eye, Download, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function AdminAttendancePage() {
    const router = useRouter();
    const [selectedPeriod, setSelectedPeriod] = useState("today");
    const [searchTerm, setSearchTerm] = useState("");

    const stats = [
        { label: "Taux de Présence Global", value: "92.5%", trend: "+2.1%", color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Absences Aujourd'hui", value: "94", trend: "-12", color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Retards Aujourd'hui", value: "23", trend: "+5", color: "text-orange-600", bg: "bg-orange-50" },
        { label: "Classes avec Appel Fait", value: "18/24", trend: "75%", color: "text-blue-600", bg: "bg-blue-50" },
    ];

    const classAttendance = [
        { id: 1, class: "6ème A", level: "Sixième", students: 42, present: 38, absent: 3, late: 1, rate: 90.5, lastUpdate: "08:30", status: "completed" },
        { id: 2, class: "6ème B", level: "Sixième", students: 40, present: 37, absent: 2, late: 1, rate: 92.5, lastUpdate: "08:25", status: "completed" },
        { id: 3, class: "5ème A", level: "Cinquième", students: 38, present: 36, absent: 1, late: 1, rate: 94.7, lastUpdate: "08:35", status: "completed" },
        { id: 4, class: "5ème B", level: "Cinquième", students: 41, present: 39, absent: 2, late: 0, rate: 95.1, lastUpdate: "08:28", status: "completed" },
        { id: 5, class: "4ème A", level: "Quatrième", students: 36, present: 33, absent: 2, late: 1, rate: 91.7, lastUpdate: "08:40", status: "completed" },
        { id: 6, class: "3ème A", level: "Troisième", students: 39, present: 35, absent: 3, late: 1, rate: 89.7, lastUpdate: "08:32", status: "completed" },
        { id: 7, class: "3ème B", level: "Troisième", students: 37, present: null, absent: null, late: null, rate: 0, lastUpdate: "-", status: "pending" },
        { id: 8, class: "2nde A", level: "Seconde", students: 44, present: 40, absent: 3, late: 1, rate: 90.9, lastUpdate: "08:45", status: "completed" },
    ];

    const filteredClasses = classAttendance.filter(c =>
        c.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.level.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        if (status === "completed") {
            return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">Fait</span>;
        }
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-700">En attente</span>;
    };

    const getRateColor = (rate: number) => {
        if (rate >= 95) return "text-emerald-600";
        if (rate >= 85) return "text-blue-600";
        if (rate >= 75) return "text-amber-600";
        return "text-red-600";
    };

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Assiduité Générale</h1>
                    <p className="text-slate-500">Vue d'ensemble de la présence des élèves</p>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="h-10 px-4 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue"
                    >
                        <option value="today">Aujourd'hui</option>
                        <option value="week">Cette Semaine</option>
                        <option value="month">Ce Mois</option>
                        <option value="trimester">Ce Trimestre</option>
                    </select>
                    <Button variant="outline" className="flex items-center gap-2">
                        <Download size={18} />
                        Exporter
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

            {/* Filters */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <Input
                                placeholder="Rechercher une classe..."
                                className="pl-10 bg-slate-50 border-slate-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Filter size={18} />
                            Filtres Avancés
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Classes Attendance List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredClasses.map((classItem) => (
                    <Card
                        key={classItem.id}
                        className={cn(
                            "group hover:border-primary-blue/30 transition-all cursor-pointer hover:shadow-md",
                            classItem.status === "pending" && "border-amber-200 bg-amber-50/20"
                        )}
                        onClick={() => router.push(`/admin/attendance/${classItem.id}`)}
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
                                            <Users size={14} />
                                            {classItem.students} élèves inscrits
                                        </p>
                                    </div>
                                </div>

                                {/* Attendance Stats */}
                                {classItem.status === "completed" ? (
                                    <div className="flex items-center gap-8">
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Présents</p>
                                            <p className="text-2xl font-black text-emerald-600 mt-1">{classItem.present}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Absents</p>
                                            <p className="text-2xl font-black text-red-600 mt-1">{classItem.absent}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Retards</p>
                                            <p className="text-2xl font-black text-amber-600 mt-1">{classItem.late}</p>
                                        </div>
                                        <div className="text-center border-l-2 border-slate-200 pl-8">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Taux</p>
                                            <p className={cn("text-3xl font-black mt-1", getRateColor(classItem.rate))}>
                                                {classItem.rate}%
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <p className="text-slate-500 font-medium">Appel non effectué</p>
                                        <p className="text-xs text-slate-400 mt-1">En attente du professeur</p>
                                    </div>
                                )}

                                {/* Status & Actions */}
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        {getStatusBadge(classItem.status)}
                                        {classItem.status === "completed" && (
                                            <p className="text-xs text-slate-400 mt-1">Dernier appel: {classItem.lastUpdate}</p>
                                        )}
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-slate-300 group-hover:text-primary-blue">
                                        <Eye size={20} />
                                    </Button>
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
                    onClick={() => router.push('/admin/attendance/weekly-report')}
                >
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base group-hover:text-primary-blue transition-colors">
                            <BarChart3 className="text-primary-blue" size={20} />
                            Rapport Hebdomadaire
                        </CardTitle>
                        <CardDescription>Statistiques de présence de la semaine</CardDescription>
                    </CardHeader>
                </Card>
                <Card
                    className="group hover:border-primary-blue/30 transition-all cursor-pointer"
                    onClick={() => router.push('/admin/attendance/absentees')}
                >
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base group-hover:text-primary-blue transition-colors">
                            <TrendingDown className="text-amber-600" size={20} />
                            Élèves Absentéistes
                        </CardTitle>
                        <CardDescription>Liste des élèves avec absences fréquentes</CardDescription>
                    </CardHeader>
                </Card>
                <Card className="group hover:border-primary-blue/30 transition-all cursor-pointer">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base group-hover:text-primary-blue transition-colors">
                            <Download className="text-emerald-600" size={20} />
                            Exporter les Données
                        </CardTitle>
                        <CardDescription>Télécharger les rapports d'assiduité</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
}
