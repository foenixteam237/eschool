"use client";

import {
    Users,
    GraduationCap,
    UserCheck,
    CreditCard,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Line, Bar } from 'react-chartjs-2';

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

export default function AdminDashboard() {
    const stats = [
        { label: "Total Élèves", value: "1,248", icon: Users, color: "text-blue-600", bg: "bg-blue-50", trend: "+12%", up: true },
        { label: "Enseignants", value: "84", icon: GraduationCap, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+3", up: true },
        { label: "Inscriptions", value: "156", icon: UserCheck, color: "text-amber-600", bg: "bg-amber-50", trend: "-5%", up: false },
        { label: "Revenus (FCFA)", value: "45.2M", icon: CreditCard, color: "text-purple-600", bg: "bg-purple-50", trend: "+18%", up: true },
    ];

    const lineData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Revenus 2025',
                data: [12000000, 19000000, 15000000, 25000000, 22000000, 30000000],
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
                label: 'Effectifs par niveau',
                data: [180, 200, 170, 150, 190, 160, 140],
                backgroundColor: '#10B981',
            },
        ],
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Vue d'ensemble</h1>
                    <p className="text-slate-500">Bienvenue, voici un résumé de l'activité de l'école.</p>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-600">Période:</span>
                    <select className="text-sm border-none bg-transparent font-bold text-primary-blue outline-none">
                        <option>Derniers 30 jours</option>
                        <option>Trimestre en cours</option>
                        <option>Année Scolaire</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="group">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                                    <stat.icon size={24} />
                                </div>
                                <div className={cn("flex items-center gap-1 text-sm font-bold", stat.up ? "text-emerald-600" : "text-amber-600")}>
                                    {stat.up ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                    {stat.trend}
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="text-primary-blue" size={20} />
                            Croissance des Revenus
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <Line
                                data={lineData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: { y: { beginAtZero: true } }
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="text-success-green" size={20} />
                            Répartition des Élèves
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <Bar
                                data={barData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: { y: { beginAtZero: true } }
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Dernières Activités</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((_, i) => (
                                <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                                        {String.fromCharCode(65 + i)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-800">Nouvelle inscription: Élève #{1024 + i}</p>
                                        <p className="text-xs text-slate-500">Il y a {i + 1} heures • Par Secretaire Admin</p>
                                    </div>
                                    <div className="text-xs font-medium text-primary-blue bg-blue-50 px-2 py-1 rounded">
                                        Info
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Alertes & Tâches</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                                <p className="text-sm font-bold text-amber-900">12 bulletins en attente</p>
                                <p className="text-xs text-amber-700">Date limite: Demain</p>
                            </div>
                            <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                                <p className="text-sm font-bold text-red-900">Paiement rejeté</p>
                                <p className="text-xs text-red-700">Élève: Kamga Jean (3ème A)</p>
                            </div>
                            <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                                <p className="text-sm font-bold text-blue-900">Réunion Enseignants</p>
                                <p className="text-xs text-blue-700">Prévue: Vendredi 14h</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
