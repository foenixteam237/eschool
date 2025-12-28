"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ChevronLeft,
    Search,
    Filter,
    Download,
    AlertCircle,
    User,
    TrendingDown,
    GraduationCap,
    Send,
    Eye,
    ArrowUpRight,
    Ban
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function AdminDebtorsPage() {
    const router = useRouter();
    const [selectedClass, setSelectedClass] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const [debtors, setDebtors] = useState([
        { id: "S-001", name: "KAMGA Jean", class: "6ème B", amount: 45000, reason: "2ème Tranche Scolarité", lastReminder: "2025-12-10", severity: "medium" },
        { id: "S-005", name: "BELLA Marie", class: "4ème All A", amount: 75000, reason: "Reliquat Inscription", lastReminder: "2025-12-15", severity: "high" },
        { id: "S-012", name: "FOTSO Paul", class: "6ème B", amount: 15000, reason: "Frais APEE & Bus", lastReminder: "2025-12-05", severity: "low" },
        { id: "S-022", name: "NGOUMOU Eric", class: "Tle C 1", amount: 125000, reason: "Scolarité Complète", lastReminder: "Aucun", severity: "critical" },
        { id: "S-034", name: "MVE Alice", class: "4ème All A", amount: 20000, reason: "Tenues Scolaires", lastReminder: "2025-12-18", severity: "low" },
    ]);

    const classes = ["6ème B", "4ème All A", "Tle C 1"];

    const filteredDebtors = debtors.filter(d => {
        const matchesClass = selectedClass === "all" || d.class === selectedClass;
        const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.reason.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesClass && matchesSearch;
    });

    const totalDebt = filteredDebtors.reduce((acc, d) => acc + d.amount, 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-slate-500 hover:text-primary-blue bg-white shadow-sm border border-slate-100 rounded-xl"
                        onClick={() => router.back()}
                    >
                        <ChevronLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Liste d'Insolvabilité</h1>
                        <p className="text-slate-500 text-sm italic">Suivi des impayés et relances parentales.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2 border-slate-200">
                        <Download size={18} /> Exporter PDF
                    </Button>
                    <Button className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-100 border-none">
                        <Ban size={18} /> Bloquer Accès Groupé
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-none shadow-sm bg-rose-50 border-l-4 border-rose-500">
                    <CardContent className="p-4">
                        <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest">Total Impayés</p>
                        <h3 className="text-2xl font-black text-rose-700 mt-1">{totalDebt.toLocaleString()} FCFA</h3>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-slate-50 border-l-4 border-slate-900">
                    <CardContent className="p-4">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Élèves Concernés</p>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">{filteredDebtors.length} Élèves</h3>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-amber-50 border-l-4 border-amber-500">
                    <CardContent className="p-4">
                        <p className="text-amber-600 text-[10px] font-black uppercase tracking-widest">Cas Critiques</p>
                        <h3 className="text-2xl font-black text-amber-700 mt-1">{debtors.filter(d => d.severity === 'critical' || d.severity === 'high').length} Élèves</h3>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-emerald-50 border-l-4 border-emerald-500">
                    <CardContent className="p-4">
                        <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest">Remise de Peine</p>
                        <h3 className="text-2xl font-black text-emerald-700 mt-1">12 Élèves</h3>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
                    <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-fit">
                        <button
                            onClick={() => setSelectedClass("all")}
                            className={cn(
                                "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                                selectedClass === "all" ? "bg-slate-900 text-white shadow-md shadow-slate-200" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            Toutes les classes
                        </button>
                        {classes.map(lvl => (
                            <button
                                key={lvl}
                                onClick={() => setSelectedClass(lvl)}
                                className={cn(
                                    "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                                    selectedClass === lvl ? "bg-slate-900 text-white shadow-md shadow-slate-200" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                {lvl}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <Input
                            placeholder="Élève ou Raison..."
                            className="pl-9 h-10 w-64 bg-white border-slate-200 text-sm focus:ring-rose-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-50 bg-slate-50/30">
                                    <th className="px-6 py-4">Élève / Classe</th>
                                    <th className="px-6 py-4">Raison de l'impayé</th>
                                    <th className="px-6 py-4 text-center">Montant Dû</th>
                                    <th className="px-6 py-4 text-center">Sévérité</th>
                                    <th className="px-6 py-4">Dernière Relance</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredDebtors.map((d) => (
                                    <tr key={d.id} className="group hover:bg-rose-50/10 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-rose-100 group-hover:text-rose-600 transition-colors">
                                                    <User size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{d.name}</p>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <GraduationCap size={12} className="text-slate-400" />
                                                        <span className="text-[10px] font-bold text-slate-400">{d.class}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs text-slate-600 font-medium">{d.reason}</p>
                                            <p className="text-[9px] text-slate-400 font-mono mt-0.5">#{d.id}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-black text-rose-600">
                                                {d.amount.toLocaleString()} FCFA
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                                                d.severity === 'critical' ? "bg-red-600 text-white" :
                                                    d.severity === 'high' ? "bg-rose-100 text-rose-600" :
                                                        d.severity === 'medium' ? "bg-amber-100 text-amber-600" :
                                                            "bg-slate-100 text-slate-500"
                                            )}>
                                                {d.severity === 'critical' ? <AlertCircle size={10} /> : <TrendingDown size={10} />}
                                                {d.severity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs text-slate-500 font-medium">{d.lastReminder}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-10 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-emerald-500 rounded-lg" title="Relancer">
                                                    <Send size={16} />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary-blue rounded-lg" title="Voir Dossier">
                                                    <Eye size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
                <div className="absolute right-[-2%] top-[-10%] opacity-10">
                    <AlertCircle size={200} />
                </div>
                <div className="relative z-10 max-w-xl">
                    <h4 className="text-2xl font-black tracking-tight mb-2">Relance Automatisée</h4>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        Envoyez des notifications SMS et Push à tous les parents d'élèves insolvables de la sélection actuelle. Le message inclura le montant exact et la date limite de paiement.
                    </p>
                    <div className="flex gap-3">
                        <Button className="bg-rose-600 text-white hover:bg-rose-700 font-black px-8 h-12 rounded-xl border-none shadow-lg shadow-rose-900/20">
                            Envoyer {filteredDebtors.length} Relances
                        </Button>
                        <Button variant="outline" className="bg-white/5 border-slate-700 text-white hover:bg-white/10 font-bold px-8 h-12 rounded-xl backdrop-blur-sm">
                            Personnaliser Message
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
