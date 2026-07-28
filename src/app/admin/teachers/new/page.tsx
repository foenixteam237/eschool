"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ChevronLeft,
    Save,
    X,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    UserCircle,
    GraduationCap,
    BookOpen,
    Clock,
    Plus,
    Trash2,
    RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DeleteModal } from "@/components/shared/delete-modal";

function NewTeacherPageInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isEdit = searchParams.get("edit");
    const [loading, setLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        nom: isEdit ? "DUPONT" : "",
        prenom: isEdit ? "Jean" : "",
        email: isEdit ? "j.dupont@ecole.com" : "",
        telephone: isEdit ? "699 00 11 22" : "",
        adresse: isEdit ? "Quartier Bastos, Yaoundé" : "",
        subjects: isEdit ? ["Mathématiques", "Physique"] : [""] as string[],
        classes: isEdit ? ["6ème A", "3ème B"] : [""] as string[],
        genre: "M" as "M" | "F" | "Autre",
        dateNaissance: isEdit ? "1985-06-15" : "",
        dateArrivee: isEdit ? "2020-09-01" : ""
    });

    const addSubject = () => setFormData(prev => ({ ...prev, subjects: [...prev.subjects, ""] }));
    const removeSubject = (index: number) => setFormData(prev => ({
        ...prev,
        subjects: prev.subjects.filter((_, i) => i !== index)
    }));

    const addClass = () => setFormData(prev => ({ ...prev, classes: [...prev.classes, ""] }));
    const removeClass = (index: number) => setFormData(prev => ({
        ...prev,
        classes: prev.classes.filter((_, i) => i !== index)
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
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
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
                        className="bg-slate-900 border-none px-6"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <RefreshCw className="animate-spin mr-2" size={18} /> : <Save size={18} className="mr-2" />}
                        {isEdit ? "Enregistrer les modifications" : "Enregistrer l'enseignant"}
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    {isEdit ? "Modifier le Profil Enseignant" : "Nouvel Enseignant"}
                </h1>
                <p className="text-slate-500">
                    {isEdit ? "Mettez à jour les informations professionnelles de l'enseignant." : "Enregistrez un nouveau membre du corps enseignant dans le système."}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section: Identité Personnel */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="border-b border-slate-50">
                        <div className="flex items-center gap-2 text-primary-blue">
                            <UserCircle size={20} />
                            <CardTitle className="text-lg">Identité & Personnel</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Nom</label>
                                <Input
                                    placeholder="Ex: DUPONT"
                                    required
                                    value={formData.nom}
                                    onChange={e => setFormData({ ...formData, nom: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Prénom</label>
                                <Input
                                    placeholder="Ex: Jean"
                                    required
                                    value={formData.prenom}
                                    onChange={e => setFormData({ ...formData, prenom: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Genre</label>
                                <div className="flex gap-4 pt-2">
                                    {["M", "F"].map((g) => (
                                        <label key={g} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="genre"
                                                checked={formData.genre === g}
                                                onChange={() => setFormData({ ...formData, genre: g as "M" | "F" })}
                                                className="w-4 h-4 text-primary-blue"
                                            />
                                            <span className="text-sm text-slate-600">{g === "M" ? "Masculin" : "Féminin"}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Date de Naissance</label>
                                <Input
                                    type="date"
                                    value={formData.dateNaissance}
                                    onChange={e => setFormData({ ...formData, dateNaissance: e.target.value })}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section: Contact */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="border-b border-slate-50">
                        <div className="flex items-center gap-2 text-primary-blue">
                            <Mail size={20} />
                            <CardTitle className="text-lg">Contact & Localisation</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Email Académique</label>
                                <Input
                                    type="email"
                                    placeholder="j.dupont@ecole.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Téléphone</label>
                                <Input
                                    placeholder="699 00 11 22"
                                    value={formData.telephone}
                                    onChange={e => setFormData({ ...formData, telephone: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Adresse</label>
                            <Input
                                placeholder="Quartier, Ville..."
                                value={formData.adresse}
                                onChange={e => setFormData({ ...formData, adresse: e.target.value })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Section: Académique */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="border-b border-slate-50">
                        <div className="flex items-center gap-2 text-primary-blue">
                            <GraduationCap size={20} />
                            <CardTitle className="text-lg">Spécialisations & Classes</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-500 uppercase">Matières Enseignées</label>
                                <Button type="button" variant="ghost" size="sm" className="text-primary-blue text-[10px] font-bold" onClick={addSubject}>
                                    <Plus size={14} className="mr-1" /> AJOUTER
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {formData.subjects.map((sub, i) => (
                                    <div key={i} className="flex gap-2 bg-white rounded-lg border border-slate-200 px-3 py-1 items-center focus-within:ring-1 focus-within:ring-primary-blue transition-all">
                                        <select
                                            className="flex-1 h-9 bg-transparent text-sm font-medium text-slate-700 outline-none"
                                            value={sub}
                                            onChange={e => {
                                                const newSubs = [...formData.subjects];
                                                newSubs[i] = e.target.value;
                                                setFormData({ ...formData, subjects: newSubs });
                                            }}
                                        >
                                            <option value="">Sélectionner une matière</option>
                                            <option value="Maths">Mathématiques</option>
                                            <option value="Physique">Physique-Chimie</option>
                                            <option value="SVT">SVT</option>
                                            <option value="Français">Français</option>
                                            <option value="Anglais">Anglais</option>
                                            <option value="Histoire-Géo">Histoire-Géo</option>
                                            <option value="Informatique">Informatique</option>
                                            <option value="EPS">Éducation Physique</option>
                                            <option value="Philosophie">Philosophie</option>
                                            <option value="Allemand">Allemand</option>
                                            <option value="Espagnol">Espagnol</option>
                                        </select>
                                        {formData.subjects.length > 1 && (
                                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-red-500 rounded-full" onClick={() => removeSubject(i)}>
                                                <X size={16} />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-500 uppercase">Classes Assignées</label>
                                <Button type="button" variant="ghost" size="sm" className="text-primary-blue text-[10px] font-bold" onClick={addClass}>
                                    <Plus size={14} className="mr-1" /> AJOUTER
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {formData.classes.map((cls, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-slate-50 pl-3 pr-1 py-1 rounded-lg border border-slate-100">
                                        <select
                                            className="bg-transparent text-sm font-bold text-slate-700 outline-none"
                                            value={cls}
                                            onChange={e => {
                                                const newClasses = [...formData.classes];
                                                newClasses[i] = e.target.value;
                                                setFormData({ ...formData, classes: newClasses });
                                            }}
                                        >
                                            <option value="">Classe</option>
                                            <option value="6ème A">6ème A</option>
                                            <option value="5ème B">5ème B</option>
                                            <option value="4ème A">4ème A</option>
                                            <option value="3ème B">3ème B</option>
                                            <option value="Terminal S">Terminal S</option>
                                        </select>
                                        {formData.classes.length > 1 && (
                                            <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-red-500" onClick={() => removeClass(i)}>
                                                <X size={14} />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </form>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Supprimer l'enseignant"
                description="Cette action est irréversible. Toutes les données professionnelles et les affectations de cet enseignant seront supprimées."
                itemName={`${formData.prenom} ${formData.nom}`}
            />
        </div>
    );
}

export default function NewTeacherPage() {
    return (
        <Suspense fallback={<div className="p-8 text-slate-500">Chargement…</div>}>
            <NewTeacherPageInner />
        </Suspense>
    );
}
