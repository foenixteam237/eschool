"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ChevronLeft,
    Save,
    X,
    BookOpen,
    Trash2,
    RefreshCw,
    Award,
    Hash
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DeleteModal } from "@/components/shared/delete-modal";

export default function NewSubjectPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isEdit = searchParams.get("edit");
    const [loading, setLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: isEdit ? "Mathématiques" : "",
        category: isEdit ? "Scientifique" : "Scientifique",
        defaultCoef: isEdit ? 5 : 1,
        description: isEdit ? "Enseignement des sciences mathématiques et logique." : ""
    });

    const categories = [
        "Scientifique",
        "Littéraire",
        "Arts & Culture",
        "Technique",
        "Langues",
        "Sport",
        "Général"
    ];

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
        <div className="space-y-6 max-w-2xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                        className="bg-slate-900 border-none px-6 shadow-lg shadow-slate-200"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <RefreshCw className="animate-spin mr-2" size={18} /> : <Save size={18} className="mr-2" />}
                        {isEdit ? "Enregistrer les modifications" : "Créer la matière"}
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-2 text-center py-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-sm">
                    <BookOpen size={32} />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    {isEdit ? "Modifier la Matière" : "Nouvelle Matière"}
                </h1>
                <p className="text-slate-500 text-sm">
                    {isEdit ? "Mettez à jour les paramètres globaux de cet enseignement." : "Définissez une nouvelle discipline dans le catalogue scolaire."}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="border-none shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                        <div className="flex items-center gap-2 text-emerald-600">
                            <Award size={20} />
                            <CardTitle className="text-lg">Informations Générales</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Nom de la Matière</label>
                            <Input
                                placeholder="Ex: Mathématiques"
                                required
                                className="h-12 border-slate-200 focus:ring-emerald-500 text-lg font-medium"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Catégorie</label>
                                <select
                                    className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-medium text-slate-700"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {categories.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Coefficient par défaut</label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                    <Input
                                        type="number"
                                        min="1"
                                        max="10"
                                        required
                                        className="h-12 pl-10 border-slate-200 focus:ring-emerald-500 font-black text-slate-700 text-lg"
                                        value={formData.defaultCoef}
                                        onChange={e => setFormData({ ...formData, defaultCoef: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Description (Optionnel)</label>
                            <textarea
                                className="w-full min-h-[120px] p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-1 focus:ring-emerald-500 transition-all text-slate-600"
                                placeholder="Décrivez brièvement le contenu de cet enseignement..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </CardContent>
                </Card>
            </form>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Supprimer la matière"
                description="Attention : Cette action retirera cette matière de tous les règlements de classe et programmes. Les données de notation historiques ne seront pas supprimées mais archivées."
                itemName={formData.name}
            />
        </div>
    );
}
