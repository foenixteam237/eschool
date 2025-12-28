"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, TrendingUp, TrendingDown, Download, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function AdminAttendanceWeeklyReportPage() {
    const router = useRouter();
    const [selectedWeek, setSelectedWeek] = useState("current");

    const stats = [
        { label: "Taux Moyen Semaine", value: "93.2%", trend: "+1.5%", up: true, color: "text-emerald-600" },
        { label: "Total Absences", value: "478", trend: "-24", up: true, color: "text-amber-600" },
        { label: "Total Retards", value: "115", trend: "+12", up: false, color: "text-orange-600" },
        { label: "Meilleur Jour", value: "Mercredi", trend: "95.8%", up: true, color: "text-blue-600" },
    ];

    const weekData = {
        labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
        datasets: [
            {
                label: 'Taux de Présence (%)',
                data: [92.5, 93.8, 95.8, 92.1, 91.2],
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const classComparisonData = {
        labels: ['6ème A', '6ème B', '5ème A', '5ème B', '4ème A', '3ème A', '3ème B', '2nde A'],
        datasets: [
            {
                label: 'Taux de Présence Moyen',
                data: [94.2, 93.5, 95.1, 94.8, 92.3, 90.5, 89.2, 93.7],
                backgroundColor: '#1E40AF',
            },
        ],
    };

    const dailyDetails = [
        { day: "Lundi", date: "23/12", present: 1156, absent: 92, late: 24, rate: 92.5 },
        { day: "Mardi", date: "24/12", present: 1172, absent: 76, late: 18, rate: 93.8 },
        { day: "Mercredi", date: "25/12", present: 1196, absent: 52, late: 12, rate: 95.8 },
        { day: "Jeudi", date: "26/12", present: 1149, absent: 99, late: 26, rate: 92.1 },
        { day: "Vendredi", date: "27/12", present: 1138, absent: 110, late: 28, rate: 91.2 },
    ];

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-500 border border-slate-200 bg-white">
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Rapport Hebdomadaire</h1>
                        <p className="text-slate-500">Statistiques de présence de la semaine</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={selectedWeek}
                        onChange={(e) => setSelectedWeek(e.target.value)}
                        className="h-10 px-4 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue"
                    >
                        <option value="current">Cette Semaine</option>
                        <option value="last">Semaine Dernière</option>
                        <option value="2weeks">Il y a 2 semaines</option>
                    </select>
                    <Button variant="outline" className="flex items-center gap-2">
                        <Download size={18} />
                        Exporter PDF
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
                                <span className={cn(
                                    "text-xs font-bold flex items-center gap-1",
                                    stat.up ? "text-emerald-600" : "text-red-600"
                                )}>
                                    {stat.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                    {stat.trend}
                                </span>
                            </div>
                            <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="text-emerald-600" size={20} />
                            Évolution Quotidienne
                        </CardTitle>
                        <CardDescription>Taux de présence par jour</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <Line
                                data={weekData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        y: {
                                            beginAtZero: false,
                                            min: 85,
                                            max: 100
                                        }
                                    }
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="text-primary-blue" size={20} />
                            Comparaison par Classe
                        </CardTitle>
                        <CardDescription>Taux moyen par classe</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <Bar
                                data={classComparisonData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        y: {
                                            beginAtZero: false,
                                            min: 85,
                                            max: 100
                                        }
                                    }
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Daily Details Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Détails par Jour</CardTitle>
                    <CardDescription>Résumé quotidien de la présence</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left p-3 text-xs font-bold text-slate-500 uppercase">Jour</th>
                                    <th className="text-left p-3 text-xs font-bold text-slate-500 uppercase">Date</th>
                                    <th className="text-center p-3 text-xs font-bold text-slate-500 uppercase">Présents</th>
                                    <th className="text-center p-3 text-xs font-bold text-slate-500 uppercase">Absents</th>
                                    <th className="text-center p-3 text-xs font-bold text-slate-500 uppercase">Retards</th>
                                    <th className="text-center p-3 text-xs font-bold text-slate-500 uppercase">Taux</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dailyDetails.map((day, idx) => (
                                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="p-3 text-sm font-bold text-slate-900">{day.day}</td>
                                        <td className="p-3 text-sm text-slate-500">{day.date}</td>
                                        <td className="p-3 text-center">
                                            <span className="text-lg font-black text-emerald-600">{day.present}</span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <span className="text-lg font-black text-red-600">{day.absent}</span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <span className="text-lg font-black text-amber-600">{day.late}</span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <span className={cn(
                                                "text-xl font-black",
                                                day.rate >= 95 ? "text-emerald-600" :
                                                    day.rate >= 90 ? "text-blue-600" : "text-amber-600"
                                            )}>
                                                {day.rate}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Summary */}
            <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4 flex items-start gap-3">
                    <Calendar className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-blue-900">
                        <p className="font-bold">Résumé de la Semaine</p>
                        <p className="mt-1">
                            Excellente performance générale avec un taux moyen de <strong>93.2%</strong>.
                            Le mercredi a enregistré le meilleur taux avec <strong>95.8%</strong> de présence.
                            Tendance positive avec une réduction de <strong>24 absences</strong> par rapport à la semaine dernière.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
