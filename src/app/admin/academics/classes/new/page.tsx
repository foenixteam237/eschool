"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ChevronLeft,
    Save,
    X,
    Layers,
    User,
    BookOpen,
    Plus,
    Trash2,
    RefreshCw,
    GraduationCap,
    Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DeleteModal } from "@/components/shared/delete-modal";

export default function NewClassPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isEdit = searchParams.get("edit");
    const [loading, setLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        baseLevel: isEdit ? "6ème" : "6ème",
        section: isEdit ? "A" : "A",
        option: isEdit ? "" : "",
        level: isEdit ? "Premier Cycle" : "Premier Cycle",
        titular: isEdit ? "Jean DUPONT" : "",
        subjects: isEdit ? [
            { id: "1", name: "Mathématiques", coef: 5 },
            { id: "2", name: "Français", coef: 4 }
        ] : [{ id: "", name: "", coef: 1 }]
    });

    const baseLevels = ["6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Tle"];
    const sections = ["A", "B", "C", "D", "1", "2", "3", "4"];

    // Options / Filières
    const getOptionsForLevel = (level: string) => {
        if (level === "4ème" || level === "3ème") {
            return ["All", "Esp", "Lat", "Chin", "Ar"];
        }
        if (["2nde", "1ère", "Tle"].includes(level)) {
            return ["A", "C", "D", "TI", "SES", "L", "S"];
        }
        return [];
    };

    const currentOptions = getOptionsForLevel(formData.baseLevel);

    // Auto-update Cycle based on level
    useEffect(() => {
        if (["6ème", "5ème", "4ème", "3ème"].includes(formData.baseLevel)) {
            setFormData(prev => ({ ...prev, level: "Premier Cycle" }));
        } else {
            setFormData(prev => ({ ...prev, level: "Second Cycle" }));
        }

        // Reset option if not applicable
        if (getOptionsForLevel(formData.baseLevel).length === 0) {
            setFormData(prev => ({ ...prev, option: "" }));
        }
    }, [formData.baseLevel]);

    const getFullClassName = () => {
        const parts = [formData.baseLevel];
        if (formData.option) parts.push(formData.option);
        parts.push(formData.section);
        return parts.join(" ");
    };

    const teachers = [
        "Jean DUPONT",
        "Marie SMITH",
        "Paul LEFEBVRE",
        "Alice MVE",
        "Robert KOFFI"
    ];

    const availableSubjects = [
        "Mathématiques",
        "Français",
        "Anglais",
        "Physique-Chimie",
        "SVT",
        "Histoire-Géo",
        "Informatique",
        "EPS",
        "Philosophie"
    ];

    const addSubject = () => setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, { id: "", name: "", coef: 1 }]
    }));

    const removeSubject = (index: number) => setFormData(prev => ({
        ...prev,
        subjects: prev.subjects.filter((_, i) => i !== index)
    }));

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
        <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-slate-500 hover:text-primary-blue"
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
                        {isEdit ? "Mettre à jour la classe" : "Créer la classe"}
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    {isEdit ? "Modifier la Classe" : "Nouvelle Classe"}
                </h1>
                <p className="text-slate-500 font-bold">
                    {getFullClassName()}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section: Identité de la Classe */}
                <Card className="border-none shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                        <div className="flex items-center gap-2 text-primary-blue">
                            <Layers size={20} />
                            <CardTitle className="text-lg">Structure & Identité</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Niveau de base</label>
                                <select
                                    className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-1 focus:ring-primary-blue transition-all"
                                    value={formData.baseLevel}
                                    onChange={e => setFormData({ ...formData, baseLevel: e.target.value })}
                                >
                                    {baseLevels.map(lvl => (
                                        <option key={lvl} value={lvl}>{lvl}</option>
                                    ))}
                                </select>
                            </div>

                            {currentOptions.length > 0 && (
                                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Option / Filière</label>
                                    <select
                                        className="w-full h-11 px-4 bg-emerald-50/30 border border-emerald-100 rounded-xl text-sm font-bold text-emerald-700 outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                                        value={formData.option}
                                        onChange={e => setFormData({ ...formData, option: e.target.value })}
                                    >
                                        <option value="">Standard / Sans option</option>
                                        {currentOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Index / Section</label>
                                <select
                                    className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-1 focus:ring-primary-blue transition-all"
                                    value={formData.section}
                                    onChange={e => setFormData({ ...formData, section: e.target.value })}
                                >
                                    {sections.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aperçu du Nom</label>
                                <div className="h-11 flex items-center px-4 bg-slate-100 rounded-xl border border-dashed border-slate-200 text-slate-500 font-black text-lg">
                                    {getFullClassName()}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cycle Automatique</label>
                                <div className="h-11 flex items-center px-4 bg-slate-100 rounded-xl border border-slate-200 text-slate-400 font-bold text-xs uppercase tracking-widest">
                                    {formData.level}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 pt-4">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Professeur Titulaire</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                <select
                                    className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary-blue transition-all"
                                    value={formData.titular}
                                    onChange={e => setFormData({ ...formData, titular: e.target.value })}
                                >
                                    <option value="">Sélectionner un titulaire</option>
                                    {teachers.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section: Programme Scolaire */}
                <Card className="border-none shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-emerald-600">
                                <BookOpen size={20} />
                                <CardTitle className="text-lg">Programme & Matières</CardTitle>
                            </div>
                            <Button type="button" variant="ghost" size="sm" className="text-emerald-600 text-[10px] font-black tracking-widest uppercase hover:bg-emerald-50" onClick={addSubject}>
                                <Plus size={14} className="mr-1" /> Ajouter une matière
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="space-y-3">
                            {formData.subjects.map((sub, i) => (
                                <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group transition-all hover:border-emerald-500/20">
                                    <div className="flex-1 space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Matière</label>
                                        <select
                                            className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                                            value={sub.name}
                                            onChange={e => {
                                                const newSubs = [...formData.subjects];
                                                newSubs[i].name = e.target.value;
                                                setFormData({ ...formData, subjects: newSubs });
                                            }}
                                        >
                                            <option value="">Choisir une matière</option>
                                            {availableSubjects.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-32 space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Coefficient</label>
                                        <Input
                                            type="number"
                                            min="1"
                                            max="10"
                                            className="h-11 border-slate-200 text-center font-bold text-slate-700"
                                            value={sub.coef}
                                            onChange={e => {
                                                const newSubs = [...formData.subjects];
                                                newSubs[i].coef = parseInt(e.target.value);
                                                setFormData({ ...formData, subjects: newSubs });
                                            }}
                                        />
                                    </div>
                                    <div className="flex items-end pb-1.5 font-bold">
                                        {formData.subjects.length > 1 && (
                                            <Button type="button" variant="ghost" size="icon" className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full" onClick={() => removeSubject(i)}>
                                                <X size={18} />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </form>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Supprimer la classe"
                description="Attention : Cette action supprimera définitivement la classe, ses affectations et l'historique associé. Les élèves devront être réaffectés."
                itemName={getFullClassName()}
            />
        </div>
    );
}
