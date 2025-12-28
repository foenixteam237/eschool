"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    RefreshCw,
    Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { useSearchParams } from "next/navigation";
import { DeleteModal } from "@/components/shared/delete-modal";

export default function NewStudentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isEdit = searchParams.get("edit");
    const [loading, setLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        nom: isEdit ? "KAMGA" : "",
        prenom: isEdit ? "Jean" : "",
        email: isEdit ? "jean.kamga@gmail.com" : "",
        telephone: isEdit ? "+237 677 88 99 00" : "",
        adresse: isEdit ? "Bastos, Yaoundé" : "",
        dateNaissance: isEdit ? "2010-05-12" : "",
        genre: "M" as "M" | "F" | "Autre",
        classe: isEdit ? "3ème B" : "",
        matricule: isEdit ? "2025-ECO-0001" : ""
    });

    const generateMatricule = () => {
        const year = new Date().getFullYear();
        const random = Math.floor(1000 + Math.random() * 9000);
        setFormData(prev => ({ ...prev, matricule: `${year}-ECO-${random}` }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            router.push("/admin/students");
        }, 1000);
    };

    const confirmDelete = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push("/admin/students");
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
                    <Button variant="outline" onClick={() => router.push("/admin/students")}>
                        <X size={18} className="mr-2" /> Annuler
                    </Button>
                    <Button
                        className="bg-primary-blue"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <RefreshCw className="animate-spin mr-2" size={18} /> : <Save size={18} className="mr-2" />}
                        {isEdit ? "Enregistrer les modifications" : "Enregistrer l'élève"}
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    {isEdit ? "Modifier le Dossier Élève" : "Nouvel Élève"}
                </h1>
                <p className="text-slate-500">
                    {isEdit ? "Mettez à jour les informations de l'étudiant ci-dessous." : "Remplissez les informations ci-dessous pour inscrire un nouvel étudiant."}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section: Identité */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="border-b border-slate-50">
                        <div className="flex items-center gap-2 text-primary-blue">
                            <UserCircle size={20} />
                            <CardTitle className="text-lg">Informations d'Identité</CardTitle>
                        </div>
                        <CardDescription>Informations de base de l'étudiant</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Nom</label>
                                <Input
                                    placeholder="Ex: KAMGA"
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
                                <label className="text-xs font-bold text-slate-500 uppercase">Date de Naissance</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 text-slate-400" size={16} />
                                    <Input
                                        type="date"
                                        className="pl-10"
                                        required
                                        value={formData.dateNaissance}
                                        onChange={e => setFormData({ ...formData, dateNaissance: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Genre</label>
                                <div className="flex gap-4 pt-2">
                                    {["M", "F", "Autre"].map((g) => (
                                        <label key={g} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="genre"
                                                value={g}
                                                checked={formData.genre === g}
                                                onChange={() => setFormData({ ...formData, genre: g as "M" | "F" | "Autre" })}
                                                className="w-4 h-4 text-primary-blue focus:ring-primary-blue border-slate-200"
                                            />
                                            <span className="text-sm text-slate-600 group-hover:text-primary-blue transition-colors">
                                                {g === "M" ? "Masculin" : g === "F" ? "Féminin" : "Autre"}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section: Contact */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="border-b border-slate-50">
                        <div className="flex items-center gap-2 text-primary-blue">
                            <MapPin size={20} />
                            <CardTitle className="text-lg">Contact & Localisation</CardTitle>
                        </div>
                        <CardDescription>Comment joindre l'élève ou ses parents</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
                                    <Input
                                        type="email"
                                        placeholder="eleve@exemple.com"
                                        className="pl-10"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Téléphone</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 text-slate-400" size={16} />
                                    <Input
                                        placeholder="+237 6XX XXX XXX"
                                        className="pl-10"
                                        value={formData.telephone}
                                        onChange={e => setFormData({ ...formData, telephone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Adresse Résidentielle</label>
                            <Input
                                placeholder="Quartier, Ville, Rue..."
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
                            <CardTitle className="text-lg">Informations Académiques</CardTitle>
                        </div>
                        <CardDescription>Attribution de classe et identification</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Classe</label>
                                <select
                                    className="w-full h-11 rounded-md border border-slate-200 bg-white px-3 text-sm focus:ring-1 focus:ring-primary-blue outline-none"
                                    required
                                    value={formData.classe}
                                    onChange={e => setFormData({ ...formData, classe: e.target.value })}
                                >
                                    <option value="">Sélectionner une classe</option>
                                    <option value="6ème A">6ème A</option>
                                    <option value="5ème B">5ème B</option>
                                    <option value="4ème A">4ème A</option>
                                    <option value="3ème B">3ème B</option>
                                    <option value="2nde C">2nde C</option>
                                    <option value="1ère D">1ère D</option>
                                    <option value="Tle C">Tle C</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Matricule</label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Auto-généré ou manuel"
                                        required
                                        value={formData.matricule}
                                        onChange={e => setFormData({ ...formData, matricule: e.target.value })}
                                        className="font-mono"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="px-3"
                                        onClick={generateMatricule}
                                        title="Générer un matricule"
                                    >
                                        <RefreshCw size={18} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4 pt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        className="text-slate-500"
                        onClick={() => router.push("/admin/students")}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        className="bg-primary-blue px-8 h-12 font-bold shadow-lg shadow-blue-200 hover:scale-105 transition-all text-base"
                        disabled={loading}
                    >
                        {loading ? "Enregistrement..." : isEdit ? "Mettre à jour le dossier" : "Créer le dossier élève"}
                    </Button>
                </div>
            </form>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Supprimer l'élève"
                description="Cette action est irréversible. Toutes les données de l'élève seront définitivement effacées."
                itemName={`${formData.nom} ${formData.prenom}`}
            />
        </div>
    );
}
