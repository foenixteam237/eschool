"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
    BookOpen,
    Layers,
    Plus,
    Edit,
    Trash2,
    Users as UsersIcon,
    ChevronRight,
    ArrowRight,
    School,
    GraduationCap,
    Clock,
    Search,
    Filter,
    Award,
    CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { DeleteModal } from "@/components/shared/delete-modal";

interface AcademicClass {
    id: string;
    name: string;
    cycle: "Premier Cycle" | "Second Cycle";
    serie: string;
    etablissement: string;
    students: number;
    titular: string;
    exam: string;
}

interface AcademicSubject {
    id: string;
    name: string;
    code: string;
    coef: number;
    groupe: "Groupe 1 (Fondamentales)" | "Groupe 2 (Complémentaires)" | "Groupe 3 (Développement Perso)";
    category: "Scientifique" | "Littéraire" | "Technique" | "Culture & Sport";
    heuresHebdo: number;
}

function AcademicsContent() {
    const searchParams = useSearchParams();
    const initialSchoolId = searchParams.get("schoolId");

    const [classes, setClasses] = useState<AcademicClass[]>([
        { id: "1", name: "6ème A", cycle: "Premier Cycle", serie: "Générale", etablissement: "Lycée Général Leclerc (Yaoundé)", students: 45, titular: "M. TCHAPTCHET", exam: "Orientation 5ème" },
        { id: "2", name: "5ème B", cycle: "Premier Cycle", serie: "Générale", etablissement: "Lycée Général Leclerc (Yaoundé)", students: 42, titular: "Mme MVE Alice", exam: "Orientation 4ème" },
        { id: "3", name: "4ème All A", cycle: "Premier Cycle", serie: "Langue Vivante 2 (Allemand)", etablissement: "Lycée Bilingue de Deido (Douala)", students: 40, titular: "M. FOTSO Paul", exam: "Passage 3ème" },
        { id: "4", name: "3ème Esp B", cycle: "Premier Cycle", serie: "Langue Vivante 2 (Espagnol)", etablissement: "Lycée Bilingue de Deido (Douala)", students: 44, titular: "M. KAMGA Jean", exam: "Examen Officiel BEPC" },
        { id: "5", name: "2nde C 1", cycle: "Second Cycle", serie: "Sciences & Mathématiques", etablissement: "Collège Libermann (Douala)", students: 38, titular: "M. TALLA Jean", exam: "Passage 1ère C/D" },
        { id: "6", name: "2nde A4", cycle: "Second Cycle", serie: "Lettres & Philosophie", etablissement: "Lycée Classique de Bafoussam", students: 41, titular: "Mme NGONO Anne", exam: "Passage 1ère A4" },
        { id: "7", name: "1ère D", cycle: "Second Cycle", serie: "Sciences Expérimentales", etablissement: "Lycée Général Leclerc (Yaoundé)", students: 42, titular: "M. MBALLA Oscar", exam: "Examen Officiel Probatoire D" },
        { id: "8", name: "1ère TI", cycle: "Second Cycle", serie: "Technologies de l'Information", etablissement: "Lycée Bilingue de Deido (Douala)", students: 36, titular: "Ing. TEGUIA Paul", exam: "Examen Officiel Probatoire TI" },
        { id: "9", name: "Tle C", cycle: "Second Cycle", serie: "Mathématiques & Sciences Physiques", etablissement: "Lycée Général Leclerc (Yaoundé)", students: 35, titular: "M. DUPONT Jean", exam: "Examen Officiel Baccalauréat C" },
        { id: "10", name: "Tle A4", cycle: "Second Cycle", serie: "Lettres & Langues", etablissement: "Collège Libermann (Douala)", students: 39, titular: "M. ABESSOLO Pierre", exam: "Examen Officiel Baccalauréat A4" },
        { id: "11", name: "Tle F4", cycle: "Second Cycle", serie: "Génie Civil & Bâtiment", etablissement: "Lycée Technique de Douala-Koumassi", students: 32, titular: "M. EBENDE Samuel", exam: "Examen Officiel Baccalauréat F4" },
    ]);

    const [subjects, setSubjects] = useState<AcademicSubject[]>([
        { id: "1", name: "Mathématiques", code: "MATH", coef: 5, groupe: "Groupe 1 (Fondamentales)", category: "Scientifique", heuresHebdo: 6 },
        { id: "2", name: "Physique-Chimie", code: "PC", coef: 4, groupe: "Groupe 1 (Fondamentales)", category: "Scientifique", heuresHebdo: 4 },
        { id: "3", name: "Sciences de la Vie et de la Terre (SVT)", code: "SVT", coef: 3, groupe: "Groupe 1 (Fondamentales)", category: "Scientifique", heuresHebdo: 3 },
        { id: "4", name: "Informatique / Algorithmique", code: "INFO", coef: 3, groupe: "Groupe 1 (Fondamentales)", category: "Technique", heuresHebdo: 3 },
        { id: "5", name: "Français & Littérature", code: "FR", coef: 5, groupe: "Groupe 2 (Complémentaires)", category: "Littéraire", heuresHebdo: 5 },
        { id: "6", name: "Anglais (English Language)", code: "ANG", coef: 3, groupe: "Groupe 2 (Complémentaires)", category: "Littéraire", heuresHebdo: 3 },
        { id: "7", name: "Histoire-Géographie-ECM", code: "HG", coef: 3, groupe: "Groupe 2 (Complémentaires)", category: "Littéraire", heuresHebdo: 3 },
        { id: "8", name: "Philosophie", code: "PHIL", coef: 4, groupe: "Groupe 2 (Complémentaires)", category: "Littéraire", heuresHebdo: 4 },
        { id: "9", name: "Allemand / Espagnol (LV2)", code: "LV2", coef: 3, groupe: "Groupe 2 (Complémentaires)", category: "Littéraire", heuresHebdo: 3 },
        { id: "10", name: "Éducation Physique et Sportive (EPS)", code: "EPS", coef: 2, groupe: "Groupe 3 (Développement Perso)", category: "Culture & Sport", heuresHebdo: 2 },
        { id: "11", name: "Travail Manuel / Économie Familiale", code: "TM", coef: 1, groupe: "Groupe 3 (Développement Perso)", category: "Culture & Sport", heuresHebdo: 2 },
    ]);

    const [selectedSchool, setSelectedSchool] = useState<string>("all");
    const [selectedCycle, setSelectedCycle] = useState<string>("all");
    const [selectedGroupe, setSelectedGroupe] = useState<string>("all");
    const [searchClass, setSearchClass] = useState<string>("");

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState<{ id: string; name: string; type: "class" | "subject" } | null>(null);

    const schools = [
        "Lycée Général Leclerc (Yaoundé)",
        "Lycée Bilingue de Deido (Douala)",
        "Collège Libermann (Douala)",
        "Lycée Classique de Bafoussam",
        "Lycée Technique de Douala-Koumassi"
    ];

    useEffect(() => {
        if (initialSchoolId) {
            if (initialSchoolId.includes("lgl")) setSelectedSchool("Lycée Général Leclerc (Yaoundé)");
            else if (initialSchoolId.includes("lbd")) setSelectedSchool("Lycée Bilingue de Deido (Douala)");
            else if (initialSchoolId.includes("libermann")) setSelectedSchool("Collège Libermann (Douala)");
            else if (initialSchoolId.includes("bafoussam")) setSelectedSchool("Lycée Classique de Bafoussam");
            else if (initialSchoolId.includes("koumassi")) setSelectedSchool("Lycée Technique de Douala-Koumassi");
        }
    }, [initialSchoolId]);

    const handleDeleteClick = (id: string, name: string, type: "class" | "subject") => {
        setDeleteItem({ id, name, type });
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!deleteItem) return;
        if (deleteItem.type === "class") {
            setClasses((prev) => prev.filter((c) => c.id !== deleteItem.id));
        } else {
            setSubjects((prev) => prev.filter((s) => s.id !== deleteItem.id));
        }
        setIsDeleteModalOpen(false);
        setDeleteItem(null);
    };

    const filteredClasses = classes.filter((c) => {
        const matchesSchool = selectedSchool === "all" || c.etablissement === selectedSchool;
        const matchesCycle = selectedCycle === "all" || c.cycle === selectedCycle;
        const matchesSearch = c.name.toLowerCase().includes(searchClass.toLowerCase()) ||
            c.serie.toLowerCase().includes(searchClass.toLowerCase()) ||
            c.titular.toLowerCase().includes(searchClass.toLowerCase());
        return matchesSchool && matchesCycle && matchesSearch;
    });

    const filteredSubjects = subjects.filter((s) => {
        const matchesGroupe = selectedGroupe === "all" || s.groupe.includes(selectedGroupe);
        return matchesGroupe;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Layers className="text-primary-blue" size={32} />
                        Classes & Programmes d'Enseignement
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Structure académique du secondaire camerounais (1er & 2nd Cycle) et catalogue officiel des matières
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/academics/classes/new">
                        <Button className="bg-primary-blue hover:bg-blue-700 font-bold gap-2 shadow-lg shadow-blue-100">
                            <Plus size={18} /> Créer une Classe
                        </Button>
                    </Link>
                    <Link href="/admin/academics/subjects/new">
                        <Button variant="outline" className="font-bold gap-2 border-slate-300">
                            <Plus size={18} /> Ajouter une Matière
                        </Button>
                    </Link>
                </div>
            </div>

            {/* School Switcher Bar */}
            <Card className="border-none shadow-sm bg-blue-50/50 border border-blue-100">
                <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <School className="text-primary-blue" size={24} />
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-primary-blue">
                                Filtrer la structure par établissement
                            </span>
                            <p className="text-xs text-slate-500">Sélectionnez le campus pour afficher ses divisions et son corps professoral</p>
                        </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <select
                            value={selectedSchool}
                            onChange={(e) => setSelectedSchool(e.target.value)}
                            className="h-10 px-4 rounded-xl border border-blue-200 bg-white text-xs font-bold text-primary-blue outline-none shadow-sm cursor-pointer"
                        >
                            <option value="all">🏫 Tous les Établissements ({classes.length} classes)</option>
                            {schools.map((sch) => (
                                <option key={sch} value={sch}>{sch}</option>
                            ))}
                        </select>
                        <select
                            value={selectedCycle}
                            onChange={(e) => setSelectedCycle(e.target.value)}
                            className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none shadow-sm cursor-pointer"
                        >
                            <option value="all">Tous Cycles</option>
                            <option value="Premier Cycle">1er Cycle (6e - 3e)</option>
                            <option value="Second Cycle">2nd Cycle (2nde - Tle)</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Classes Section (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
                            <div>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <BookOpen className="text-primary-blue" size={22} />
                                    Classes ({filteredClasses.length})
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Niveaux, séries et professeurs principaux
                                </CardDescription>
                            </div>
                            <div className="relative w-48">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <Input
                                    placeholder="Rechercher classe..."
                                    className="pl-8 h-8 text-xs bg-slate-50"
                                    value={searchClass}
                                    onChange={(e) => setSearchClass(e.target.value)}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                            {filteredClasses.map((cls) => (
                                <div
                                    key={cls.id}
                                    className="group relative flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-primary-blue/30 hover:bg-blue-50/10 transition-all bg-white"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex flex-col items-center justify-center font-black text-slate-700 group-hover:bg-primary-blue group-hover:text-white transition-colors">
                                            <span className="text-[10px] uppercase font-bold">{cls.name.split(" ")[0]}</span>
                                            <span className="text-xs">{cls.name.split(" ")[1] || ""}</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-black text-slate-900 text-base">{cls.name}</p>
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                                                    {cls.cycle}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                                                {cls.serie} • <span className="font-bold text-slate-700">{cls.students} élèves</span>
                                            </p>
                                            <p className="text-[11px] text-primary-blue font-bold mt-1">
                                                PP: {cls.titular} • <span className="text-slate-400 font-normal">{cls.exam}</span>
                                            </p>
                                            <p className="text-[10px] text-slate-400 mt-0.5 italic">
                                                {cls.etablissement}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link href={`/admin/academics/classes/${cls.id}`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary-blue rounded-lg">
                                                <ChevronRight size={20} />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}

                            {filteredClasses.length === 0 && (
                                <div className="p-8 text-center text-slate-400 text-xs">
                                    Aucune classe ne correspond aux critères sélectionnés.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Subjects Section (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
                            <div>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Award className="text-emerald-600" size={22} />
                                    Catalogue des Cours ({filteredSubjects.length})
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Groupes & Coefficients officiels MINESEC
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
                                <button
                                    onClick={() => setSelectedGroupe("all")}
                                    className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase transition-colors ${
                                        selectedGroupe === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                                    }`}
                                >
                                    Tous
                                </button>
                                <button
                                    onClick={() => setSelectedGroupe("Groupe 1")}
                                    className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase transition-colors ${
                                        selectedGroupe === "Groupe 1" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                                    }`}
                                >
                                    Groupe 1 (Fondam.)
                                </button>
                                <button
                                    onClick={() => setSelectedGroupe("Groupe 2")}
                                    className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase transition-colors ${
                                        selectedGroupe === "Groupe 2" ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-600"
                                    }`}
                                >
                                    Groupe 2 (Complém.)
                                </button>
                                <button
                                    onClick={() => setSelectedGroupe("Groupe 3")}
                                    className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase transition-colors ${
                                        selectedGroupe === "Groupe 3" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                                    }`}
                                >
                                    Groupe 3 (EPS/TM)
                                </button>
                            </div>

                            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                                {filteredSubjects.map((sub) => (
                                    <div
                                        key={sub.id}
                                        className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-emerald-50/10 hover:border-emerald-200 transition-all"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-[10px] font-black bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-600">
                                                        {sub.code}
                                                    </span>
                                                    <h3 className="font-black text-slate-800 text-sm">{sub.name}</h3>
                                                </div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                                                    {sub.groupe}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 font-black text-xs rounded-md">
                                                    Coeff {sub.coef}
                                                </span>
                                                <p className="text-[10px] text-slate-400 mt-1 font-bold">
                                                    {sub.heuresHebdo}h / semaine
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title={deleteItem?.type === "class" ? "Supprimer la classe" : "Supprimer la matière"}
                description="Cette action est irréversible dans la base scolaire."
                itemName={deleteItem?.name}
            />
        </div>
    );
}

export default function AdminAcademicsPage() {
    return (
        <Suspense fallback={<div className="p-8 text-slate-500">Chargement des classes et matières...</div>}>
            <AcademicsContent />
        </Suspense>
    );
}
