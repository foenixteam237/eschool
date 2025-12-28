"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Calendar, Users, Download, TrendingUp, AlertCircle, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function AdminAttendanceDetailPage() {
    const router = useRouter();
    const params = useParams();
    const classId = params.id;
    const [selectedView, setSelectedView] = useState("today");
    const [searchTerm, setSearchTerm] = useState("");

    const classInfo = {
        "1": { name: "6ème A", students: 42, present: 38, absent: 3, late: 1 },
        "2": { name: "6ème B", students: 40, present: 37, absent: 2, late: 1 },
    }[classId as string] || { name: "Classe", students: 0, present: 0, absent: 0, late: 0 };

    const attendanceHistory = [
        { date: "2025-12-27", present: 38, absent: 3, late: 1, rate: 90.5 },
        { date: "2025-12-26", present: 40, absent: 2, late: 0, rate: 95.2 },
        { date: "2025-12-23", present: 39, absent: 2, late: 1, rate: 92.9 },
        { date: "2025-12-20", present: 37, absent: 4, late: 1, rate: 88.1 },
        { date: "2025-12-19", present: 41, absent: 1, late: 0, rate: 97.6 },
        { date: "2025-12-18", present: 38, absent: 3, late: 1, rate: 90.5 },
        { date: "2025-12-17", present: 40, absent: 2, late: 0, rate: 95.2 },
    ];

    const allStudents = [
        { id: 1, name: "ABENA Carole", matricule: "2025-001", status: "present", time: "08:00" },
        { id: 2, name: "BELLA Marie", matricule: "2025-002", status: "absent", reason: "Non justifié", days: 3 },
        { id: 3, name: "FOTSO Paul", matricule: "2025-003", status: "late", time: "08:15" },
        { id: 4, name: "KAMGA Jean", matricule: "2025-004", status: "absent", reason: "Maladie", days: 1 },
        { id: 5, name: "NGONO Anne", matricule: "2025-005", status: "present", time: "07:55" },
        { id: 6, name: "MBALLA Oscar", matricule: "2025-006", status: "present", time: "08:00" },
        { id: 7, name: "TALLA Sophie", matricule: "2025-007", status: "present", time: "07:58" },
        { id: 8, name: "NKOMO André", matricule: "2025-008", status: "present", time: "08:02" },
        { id: 9, name: "BIYA Sylvie", matricule: "2025-009", status: "absent", reason: "Voyage", days: 1 },
        { id: 10, name: "ETOA Francis", matricule: "2025-010", status: "present", time: "08:00" },
    ];

    const absentStudents = allStudents.filter(s => s.status === "absent");
    const lateStudents = allStudents.filter(s => s.status === "late");
    const presentStudents = allStudents.filter(s => s.status === "present");

    const filteredStudents = allStudents.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.matricule.includes(searchTerm)
    );

    const rate = classInfo.students > 0
        ? ((classInfo.present / classInfo.students) * 100).toFixed(1)
        : 0;

    const chartData = {
        labels: attendanceHistory.map(h => new Date(h.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })).reverse(),
        datasets: [
            {
                label: 'Taux de Présence (%)',
                data: attendanceHistory.map(h => h.rate).reverse(),
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "present":
                return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">Présent</span>;
            case "absent":
                return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-100 text-red-700">Absent</span>;
            case "late":
                return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-700">Retard</span>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-500 border border-slate-200 bg-white">
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Assiduité - {classInfo.name}</h1>
                        <p className="text-slate-500">Détails de présence pour la classe</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={selectedView}
                        onChange={(e) => setSelectedView(e.target.value)}
                        className="h-10 px-4 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue"
                    >
                        <option value="today">Aujourd'hui</option>
                        <option value="week">Cette Semaine</option>
                        <option value="month">Ce Mois</option>
                    </select>
                    <Button variant="outline" className="flex items-center gap-2">
                        <Download size={18} />
                        Exporter
                    </Button>
                </div>
            </div>

            {/* Today's Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-emerald-500">
                    <CardContent className="p-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Présents</p>
                        <p className="text-3xl font-black text-emerald-600 mt-1">{classInfo.present}</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-red-500">
                    <CardContent className="p-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Absents</p>
                        <p className="text-3xl font-black text-red-600 mt-1">{classInfo.absent}</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-amber-500">
                    <CardContent className="p-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Retards</p>
                        <p className="text-3xl font-black text-amber-600 mt-1">{classInfo.late}</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-primary-blue">
                    <CardContent className="p-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Taux</p>
                        <p className="text-3xl font-black text-primary-blue mt-1">{rate}%</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Attendance Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="text-emerald-600" size={20} />
                                Évolution de la Présence
                            </CardTitle>
                            <CardDescription>Taux de présence sur les 7 derniers jours</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[250px]">
                                <Line
                                    data={chartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { display: false } },
                                        scales: {
                                            y: {
                                                beginAtZero: false,
                                                min: 80,
                                                max: 100
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Students List */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Liste des Élèves</CardTitle>
                                    <CardDescription>État de présence aujourd'hui</CardDescription>
                                </div>
                                <Input
                                    placeholder="Rechercher..."
                                    className="max-w-xs"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {filteredStudents.map((student) => (
                                    <div
                                        key={student.id}
                                        className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-primary-blue/30 transition-all"
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold",
                                                student.status === "present" && "bg-emerald-500",
                                                student.status === "absent" && "bg-red-500",
                                                student.status === "late" && "bg-amber-500"
                                            )}>
                                                {student.status === "present" && <CheckCircle size={20} />}
                                                {student.status === "absent" && <XCircle size={20} />}
                                                {student.status === "late" && <Clock size={20} />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-slate-900">{student.name}</p>
                                                <p className="text-xs text-slate-500">{student.matricule}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {student.status === "present" && (
                                                <span className="text-xs text-slate-500">Arrivée: {student.time}</span>
                                            )}
                                            {student.status === "late" && (
                                                <span className="text-xs text-amber-600 font-bold">Retard: {student.time}</span>
                                            )}
                                            {student.status === "absent" && student.reason && (
                                                <span className="text-xs text-slate-500">{student.reason}</span>
                                            )}
                                            {getStatusBadge(student.status)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attendance History */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Historique de Présence</CardTitle>
                            <CardDescription>Suivi sur les derniers jours</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {attendanceHistory.slice(0, 5).map((day, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:border-primary-blue/30 transition-all">
                                        <div className="w-24">
                                            <p className="text-xs font-bold text-slate-400 uppercase">Date</p>
                                            <p className="text-sm font-bold text-slate-900">{new Date(day.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</p>
                                        </div>
                                        <div className="flex-1 grid grid-cols-3 gap-4 text-center">
                                            <div>
                                                <p className="text-xs font-bold text-slate-400">Présents</p>
                                                <p className="text-lg font-black text-emerald-600">{day.present}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400">Absents</p>
                                                <p className="text-lg font-black text-red-600">{day.absent}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400">Retards</p>
                                                <p className="text-lg font-black text-amber-600">{day.late}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-slate-400">Taux</p>
                                            <p className={cn(
                                                "text-xl font-black",
                                                day.rate >= 95 ? "text-emerald-600" : day.rate >= 85 ? "text-blue-600" : "text-amber-600"
                                            )}>
                                                {day.rate}%
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Absent Students Today */}
                    <Card className="border-red-200 bg-red-50/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-700 text-base">
                                <XCircle size={20} />
                                Absents Aujourd'hui ({absentStudents.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {absentStudents.map((student, idx) => (
                                <div key={idx} className="p-3 bg-white border border-red-100 rounded-lg">
                                    <p className="font-bold text-slate-900">{student.name}</p>
                                    <p className="text-xs text-slate-500 mt-1">{student.reason}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={cn(
                                            "text-xs font-bold px-2 py-0.5 rounded-full",
                                            student.reason !== "Non justifié" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                                        )}>
                                            {student.reason !== "Non justifié" ? "Justifié" : "Non justifié"}
                                        </span>
                                        {student.days && <span className="text-xs text-slate-400">{student.days}j</span>}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Late Students Today */}
                    <Card className="border-amber-200 bg-amber-50/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-amber-700 text-base">
                                <Clock size={20} />
                                Retards Aujourd'hui ({lateStudents.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {lateStudents.map((student, idx) => (
                                <div key={idx} className="p-3 bg-white border border-amber-100 rounded-lg">
                                    <p className="font-bold text-slate-900">{student.name}</p>
                                    <p className="text-xs text-amber-600 mt-1 font-bold">Arrivée: {student.time}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Actions Rapides</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button className="w-full flex items-center gap-2" variant="outline">
                                <Calendar size={18} />
                                Voir Calendrier
                            </Button>
                            <Button className="w-full flex items-center gap-2" variant="outline">
                                <TrendingUp size={18} />
                                Rapport Mensuel
                            </Button>
                            <Button className="w-full flex items-center gap-2" variant="outline">
                                <Eye size={18} />
                                Voir Détails
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
