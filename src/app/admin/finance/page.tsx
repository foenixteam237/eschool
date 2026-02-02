"use client";

import { useState } from "react";
import {
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Plus,
    CheckCircle2,
    AlertCircle,
    Clock,
    Search,
    Trash2,
    Edit,
    Wallet,
    ArrowUpCircle,
    ArrowDownCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { DeleteModal } from "@/components/shared/delete-modal";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function AdminFinancePage() {
    const [transactions, setTransactions] = useState([
        { id: "TX-101", label: "Paiement Scolarité - KAMGA Jean", type: "income", category: "Scolarité", amount: 25000, date: "2025-12-23", status: "Success" },
        { id: "TX-102", label: "Achat Fournitures Bureau", type: "expense", category: "Fournitures", amount: 45000, date: "2025-12-23", status: "Success" },
        { id: "TX-103", label: "Inscription - BELLA Marie", type: "income", category: "Inscription", amount: 150000, date: "2025-12-22", status: "Success" },
        { id: "TX-104", label: "Réparation Toiture Bloc B", type: "expense", category: "Maintenance", amount: 85000, date: "2025-12-21", status: "Pending" },
        { id: "TX-105", label: "Salaire Décembre - Jean D.", type: "expense", category: "Salaire", amount: 250000, date: "2025-12-20", status: "Success" },
    ]);

    const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTx, setSelectedTx] = useState<any>(null);

    const filteredTransactions = transactions.filter(t => {
        const matchesFilter = filter === "all" || t.type === filter;
        const matchesSearch = t.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const stats = {
        totalIncome: transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0),
        totalExpense: transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0),
        balance: 0
    };
    stats.balance = stats.totalIncome - stats.totalExpense;

    const handleDeleteClick = (tx: any) => {
        setSelectedTx(tx);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        setTransactions(prev => prev.filter(t => t.id !== selectedTx.id));
        setIsDeleteModalOpen(false);
        setSelectedTx(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestion Financière</h1>
                    <p className="text-slate-500 text-sm">Suivi des flux de trésorerie (Entrées & Sorties).</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/finance/debtors">
                        <Button variant="outline" className="flex items-center gap-2 border-slate-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700">
                            <AlertCircle size={18} /> Liste d'Insolvabilité
                        </Button>
                    </Link>
                    <Button variant="outline" className="flex items-center gap-2 border-slate-200">
                        <Download size={18} /> Rapports
                    </Button>
                    <Link href="/admin/finance/transactions/new">
                        <Button className="flex items-center gap-2 bg-slate-900 shadow-lg shadow-slate-200">
                            <Plus size={18} /> Nouvelle Transaction
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-primary-blue text-white overflow-hidden relative">
                    <div className="absolute right-[-10%] top-[-10%] opacity-10">
                        <ArrowUpCircle size={120} />
                    </div>
                    <CardContent className="p-6 relative z-10">
                        <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">Revenus (Entrées)</p>
                        <h3 className="text-3xl font-black mt-2">{stats.totalIncome.toLocaleString()} FCFA</h3>
                        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold bg-white/10 w-fit px-2 py-1 rounded-lg">
                            <TrendingUp size={14} /> +12.5% cette période
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-rose-500 text-white overflow-hidden relative">
                    <div className="absolute right-[-10%] top-[-10%] opacity-10">
                        <ArrowDownCircle size={120} />
                    </div>
                    <CardContent className="p-6 relative z-10">
                        <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">Dépenses (Sorties)</p>
                        <h3 className="text-3xl font-black mt-2">{stats.totalExpense.toLocaleString()} FCFA</h3>
                        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold bg-white/10 w-fit px-2 py-1 rounded-lg">
                            <ArrowDownRight size={14} /> 45 transactions effectuées
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden relative">
                    <div className="absolute right-[-10%] top-[-10%] opacity-10">
                        <Wallet size={120} />
                    </div>
                    <CardContent className="p-6 relative z-10">
                        <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">Solde Actuel (Balance)</p>
                        <h3 className="text-3xl font-black mt-2">{stats.balance.toLocaleString()} FCFA</h3>
                        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 w-fit px-2 py-1 rounded-lg">
                            <CheckCircle2 size={14} /> Trésorerie Saine
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg">Aperçu Mensuel</CardTitle>
                        <CardDescription>Comparaison Entrées / Sorties</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full flex items-center justify-center">
                            <Bar
                                data={{
                                    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
                                    datasets: [
                                        {
                                            label: 'Entrées',
                                            data: [650000, 590000, 800000, 810000, 560000, 550000],
                                            backgroundColor: 'rgba(16, 185, 129, 0.8)', // Emerald-500
                                            borderRadius: 4,
                                        },
                                        {
                                            label: 'Sorties',
                                            data: [280000, 480000, 400000, 190000, 860000, 270000],
                                            backgroundColor: 'rgba(244, 63, 94, 0.8)', // Rose-500
                                            borderRadius: 4,
                                        }
                                    ]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'top' as const,
                                            align: 'end' as const,
                                            labels: {
                                                usePointStyle: true,
                                                boxWidth: 8,
                                                font: { size: 10, weight: 'bold' }
                                            }
                                        },
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            grid: { color: '#f1f5f9' },
                                            ticks: { font: { size: 10 } }
                                        },
                                        x: {
                                            grid: { display: false },
                                            ticks: { font: { size: 10 } }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg">Répartition des Dépenses</CardTitle>
                        <CardDescription>Par catégorie sur ce mois</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { label: "Salaires", value: 65, color: "bg-blue-500" },
                                { label: "Maintenance", value: 20, color: "bg-rose-500" },
                                { label: "Fournitures", value: 10, color: "bg-amber-500" },
                                { label: "Autres", value: 5, color: "bg-slate-400" },
                            ].map((item) => (
                                <div key={item.label} className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold text-slate-700">
                                        <span>{item.label}</span>
                                        <span>{item.value}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.value}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
                    <div>
                        <CardTitle className="text-xl">Historique des Flux</CardTitle>
                        <CardDescription className="text-xs">Détails de toutes les entrées et sorties d'argent.</CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                            <Input
                                placeholder="Rechercher..."
                                className="pl-9 h-10 w-full bg-white border-slate-200 text-sm focus:ring-primary-blue"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm w-full sm:w-auto overflow-x-auto">
                            {(["all", "income", "expense"] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={cn(
                                        "px-4 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-md transition-all whitespace-nowrap flex-1 sm:flex-none",
                                        filter === f
                                            ? "bg-slate-900 text-white shadow-md shadow-slate-200"
                                            : "text-slate-400 hover:text-slate-600"

                                    )}
                                >
                                    {f === "all" ? "Tous" : f === "income" ? "Entrées" : "Sorties"}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-50 bg-slate-50/30">
                                    <th className="px-6 py-4">Transaction / Raison</th>
                                    <th className="px-6 py-4">Catégorie</th>
                                    <th className="px-6 py-4 text-center">Montant</th>
                                    <th className="px-6 py-4 text-center">Statut</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredTransactions.map((t) => (
                                    <tr key={t.id} className="group hover:bg-blue-50/10 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                                    t.type === "income"
                                                        ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100"
                                                        : "bg-rose-50 text-rose-600 group-hover:bg-rose-100"
                                                )}>
                                                    {t.type === "income" ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{t.label}</p>
                                                    <p className="text-[10px] text-slate-400 font-mono">#{t.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight bg-slate-100 px-2 py-0.5 rounded italic">
                                                {t.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={cn(
                                                "text-sm font-black",
                                                t.type === "income" ? "text-emerald-600" : "text-rose-600"
                                            )}>
                                                {t.type === "income" ? "+" : "-"}{t.amount.toLocaleString()} FCFA
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm",
                                                t.status === "Success"
                                                    ? "bg-emerald-500 text-white"
                                                    : "bg-amber-100 text-amber-600"
                                            )}>
                                                {t.status === "Success" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                                {t.status === "Success" ? "Payé" : "En attente"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs text-slate-500 font-medium">{t.date}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/finance/transactions/new?edit=${t.id}`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary-blue rounded-lg">
                                                        <Edit size={16} />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-slate-400 hover:text-red-500 rounded-lg"
                                                    onClick={() => handleDeleteClick(t)}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredTransactions.length === 0 && (
                        <div className="p-12 text-center text-slate-400 italic text-sm">
                            Aucune transaction trouvée pour ces critères.
                        </div>
                    )}
                </CardContent>
            </Card>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Annuler la transaction"
                description="Attention : Cette action retirera la transaction de l'historique comptable. Cela peut affecter vos rapports mensuels."
                itemName={selectedTx?.label}
            />
        </div>
    );
}
