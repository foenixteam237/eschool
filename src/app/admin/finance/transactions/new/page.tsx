"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ChevronLeft,
    Save,
    X,
    Plus,
    Trash2,
    RefreshCw,
    Wallet,
    ArrowUpCircle,
    ArrowDownCircle,
    FileText,
    Calendar,
    Coins,
    User,
    ClipboardList
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DeleteModal } from "@/components/shared/delete-modal";

function NewTransactionForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isEdit = searchParams.get("edit");
    const [loading, setLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        type: isEdit ? "income" : "income", // income = entrée, expense = sortie
        label: isEdit ? "Paiement Scolarité - KAMGA Jean" : "",
        category: isEdit ? "Scolarité" : "",
        amount: isEdit ? 25000 : 0,
        date: isEdit ? "2025-12-23" : new Date().toISOString().split('T')[0],
        status: isEdit ? "Success" : "Success",
        description: isEdit ? "Paiement de la 1ère tranche." : "",
        beneficiary: isEdit ? "Jean KAMGA" : "", // Can be student or employee
    });

    const incomeCategories = [
        "Scolarité",
        "Inscription",
        "Frais APEE",
        "Uniforme",
        "Cantine",
        "Bus Scolaire",
        "Examen / Concours",
        "Donation",
        "Autre Revenu"
    ];

    const expenseCategories = [
        "Salaire",
        "Maintenance / Réparation",
        "Fournitures Bureau",
        "Matériel Pédagogique",
        "Electricité / Eau",
        "Internet / Comms",
        "Loyer",
        "Marketing",
        "Autre Dépense"
    ];

    const categories = formData.type === "income" ? incomeCategories : expenseCategories;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.back();
        }, 1000);
    };

    const confirmDelete = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.back();
        }, 1000);
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Action Bar */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-slate-500 hover:text-primary-blue bg-white shadow-sm border border-slate-100"
                    onClick={() => router.back()}
                >
                    <ChevronLeft size={20} /> Retour
                </Button>
                <div className="flex gap-2">
                    {isEdit && (
                        <Button
                            variant="ghost"
                            className="text-red-500 hover:bg-red-50"
                            onClick={() => setIsDeleteModalOpen(true)}
                        >
                            <Trash2 size={18} className="mr-2" /> Supprimer
                        </Button>
                    )}
                    <Button variant="outline" onClick={() => router.back()}>
                        <X size={18} className="mr-2" /> Annuler
                    </Button>
                    <Button
                        className={cn(
                            "border-none px-6 shadow-lg shadow-slate-200",
                            formData.type === "income" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
                        )}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <RefreshCw className="animate-spin mr-2" size={18} /> : <Save size={18} className="mr-2" />}
                        {isEdit ? "Enregistrer les modifications" : "Enregistrer la transaction"}
                    </Button>
                </div>
            </div>

            {/* Mode Switcher */}
            <Card className="border-none shadow-sm p-1 bg-slate-100 flex rounded-2xl">
                <button
                    onClick={() => setFormData({ ...formData, type: "income", category: "" })}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-black uppercase tracking-widest rounded-xl transition-all",
                        formData.type === "income" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                    )}
                >
                    <ArrowUpCircle size={20} /> Entrée d'argent
                </button>
                <button
                    onClick={() => setFormData({ ...formData, type: "expense", category: "" })}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-black uppercase tracking-widest rounded-xl transition-all",
                        formData.type === "expense" ? "bg-white text-rose-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                    )}
                >
                    <ArrowDownCircle size={20} /> Sortie d'argent
                </button>
            </Card>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="border-none shadow-sm overflow-hidden">
                    <CardHeader className={cn(
                        "bg-slate-50 border-b border-slate-100",
                        formData.type === "income" ? "text-emerald-600" : "text-rose-600"
                    )}>
                        <div className="flex items-center gap-2">
                            <Wallet size={20} />
                            <CardTitle className="text-lg">Détails de la Transaction</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Libellé / Raison</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <Input
                                    placeholder="Ex: Paiement 2ème tranche - KAMGA"
                                    required
                                    className="h-12 pl-10 border-slate-200 focus:ring-primary-blue text-sm font-bold"
                                    value={formData.label}
                                    onChange={e => setFormData({ ...formData, label: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Catégorie</label>
                                <select
                                    required
                                    className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-1 focus:ring-primary-blue transition-all"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="">Sélectionner une catégorie</option>
                                    {categories.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Montant (FCFA)</label>
                                <div className="relative">
                                    <Coins className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                    <Input
                                        type="number"
                                        required
                                        className="h-12 pl-10 border-slate-200 focus:ring-primary-blue text-lg font-black text-slate-800"
                                        value={formData.amount}
                                        onChange={e => setFormData({ ...formData, amount: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                    <Input
                                        type="date"
                                        required
                                        className="h-12 pl-10 border-slate-200 focus:ring-primary-blue text-sm font-bold"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Bénéficiaire / Émetteur</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                    <Input
                                        placeholder="Nom de l'élève ou employé"
                                        className="h-12 pl-10 border-slate-200 focus:ring-primary-blue text-sm font-bold"
                                        value={formData.beneficiary}
                                        onChange={e => setFormData({ ...formData, beneficiary: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Notes / Description</label>
                            <div className="relative">
                                <ClipboardList className="absolute left-3 top-3 text-slate-400" size={18} />
                                <textarea
                                    className="w-full min-h-[100px] pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-1 focus:ring-primary-blue transition-all text-slate-600 font-medium"
                                    placeholder="Informations complémentaires..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </form>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Supprimer la transaction"
                description="Êtes-vous sûr de vouloir supprimer cette transaction ? Cette action est irréversible et modifiera vos bilans financiers."
                itemName={formData.label}
            />
        </div>
    );
}

export default function NewTransactionPage() {
    return (
        <Suspense fallback={<div className="p-8 text-slate-500">Chargement…</div>}>
            <NewTransactionForm />
        </Suspense>
    );
}
