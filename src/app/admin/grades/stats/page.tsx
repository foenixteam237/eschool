"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, TrendingUp, TrendingDown, Users, BookOpen, Download, BarChart3 } from "lucide-react";
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
    ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export default function AdminGradesStatsPage() {
    const router = useRouter();
    const [selectedPeriod, setSelectedPeriod] = useState("trimester1");

    const stats = [
        { label: "Moyenne Générale", value: "12.8/20", trend: "+0.5", up: true, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Taux de Réussite", value: "76.3%", trend: "+3.2%", up: true, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Élèves < 10/20", value: "87/1248", trend: "-5", up: true, color: "text-red-600", bg: "bg-red-50" },
        { label: "Taux d'Excellence (>16)", value: "18.2%", trend: "+2.1%", up: true, color: "text-purple-600", bg: "bg-purple-50" },
    ];

    const lineData = {
        labels: ['Séq 1', 'Séq 2', 'Séq 3', 'Séq 4', 'Séq 5', 'Séq 6'],
        datasets: [
            {
                label: 'Moyenne Générale',
                data: [12.2, 12.5, 12.8, 13.1, 12.9, 13.2],
                borderColor: '#1E40AF',
                backgroundColor: 'rgba(30, 64, 175, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const barData = {
        labels: ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Tle'],
        datasets: [
            {
                label: 'Moyenne par Niveau',
                data: [12.8, 12.5, 13.2, 11.9, 13.5, 12.7, 13.8],
                backgroundColor: '#10B981',
            },
        ],
    };

    const doughnutData = {
        labels: ['Excellent (≥16)', 'Très Bien (14-16)', 'Bien (12-14)', 'Passable (10-12)', 'Échec (<10)'],
        datasets: [
            {
                data: [18.2, 22.5, 25.8, 26.5, 7.0],
                backgroundColor: [
                    '#10B981', // Emerald
                    '#3B82F6', // Blue
                    '#06B6D4', // Cyan
                    '#F59E0B', // Amber
                    '#EF4444', // Red
                ],
                borderWidth: 0,
            },
        ],
    };

    const subjectStats = [
        { subject: "Mathématiques", average: 11.2, trend: "+0.3", color: "text-blue-600" },
        { subject: "Physique/Chimie", average: 12.5, trend: "+0.5", color: "text-emerald-600" },
        { subject: "Français", average: 13.8, trend: "-0.2", color: "text-amber-600" },
        { subject: "Anglais", average: 12.9, trend: "+0.4", color: "text-purple-600" },
        { subject: "SVT", average: 13.1, trend: "+0.1", color: "text-cyan-600" },
        { subject: "Histoire-Géo", average: 14.2, trend: "+0.6", color: "text-green-600" },
    ];

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-500 border border-slate-200 bg-white">
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Statistiques Générales</h1>
                        <p className="text-slate-500">Vue d'ensemble des performances académiques</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="h-10 px-4 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue"
                    >
                        <option value="sequence1">Séquence 1</option>
                        <option value="trimester1">1er Trimestre</option>
                        <option value="trimester2">2ème Trimestre</option>
                        <option value="trimester3">3ème Trimestre</option>
                        <option value="year">Année Complète</option>
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
                            <BarChart3 className="text-primary-blue" size={20} />
                            Évolution des Moyennes
                        </CardTitle>
                        <CardDescription>Progression sur l'année scolaire</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <Line
                                data={lineData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            max: 20
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
                            <Users className="text-emerald-600" size={20} />
                            Moyennes par Niveau
                        </CardTitle>
                        <CardDescription>Comparaison des classes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <Bar
                                data={barData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            max: 20
                                        }
                                    }
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Distribution & Subject Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Distribution des Notes</CardTitle>
                        <CardDescription>Répartition des élèves</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <Doughnut
                                data={doughnutData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                            labels: {
                                                boxWidth: 12,
                                                padding: 10,
                                                font: { size: 10 }
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="text-primary-blue" size={20} />
                            Performance par Matière
                        </CardTitle>
                        <CardDescription>Moyennes et tendances</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {subjectStats.map((subject, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-2xl">
                                            {subject.subject[0]}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-900">{subject.subject}</h4>
                                            <div className="w-full bg-slate-100 h-2 rounded-full mt-2">
                                                <div
                                                    className="bg-primary-blue h-2 rounded-full"
                                                    style={{ width: `${(subject.average / 20) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className={cn("text-2xl font-black", subject.color)}>{subject.average}</p>
                                        <p className="text-xs text-slate-400">{subject.trend}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
