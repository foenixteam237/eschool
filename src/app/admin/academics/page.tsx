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

import { classesService, subjectsService } from "@/services";

function AcademicsContent() {
    const searchParams = useSearchParams();
    const initialSchoolId = searchParams.get("schoolId");

    const [classes, setClasses] = useState<AcademicClass[]>([]);
    const [subjects, setSubjects] = useState<AcademicSubject[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

    const loadAcademicsData = async () => {
        setIsLoading(true);
        try {
            const [classesRes, subjectsRes] = await Promise.allSettled([
                classesService.getClasses(1, 100),
                subjectsService.getSubjects()
            ]);

            if (classesRes.status === "fulfilled" && classesRes.value.data.length > 0) {
                const mapped: AcademicClass[] = classesRes.value.data.map((c: any) => ({
                    id: c.id,
                    name: c.name || c.nom,
                    cycle: (c.level?.includes("Terminale") || c.level?.includes("Première") || c.level?.includes("Seconde") || c.name?.includes("Tle") || c.name?.includes("1ère") || c.name?.includes("2nde"))
                        ? "Second Cycle"
                        : "Premier Cycle",
                    serie: c.section || "Enseignement Général",
                    etablissement: "Lycée Général Leclerc (Yaoundé)",
                    students: c.studentCount || c.capacity || 42,
                    titular: c.teacherName || (c.teacherId === "tch_1" ? "M. Jean DUPONT" : "M. TCHAPTCHET"),
                    exam: c.name?.includes("Tle") ? "Examen Officiel Baccalauréat" : c.name?.includes("1ère") ? "Examen Officiel Probatoire" : c.name?.includes("3ème") ? "Examen Officiel BEPC" : "Passage niveau supérieur",
                }));
                setClasses(mapped);
            }

            if (subjectsRes.status === "fulfilled" && subjectsRes.value.length > 0) {
                const mappedSubs: AcademicSubject[] = subjectsRes.value.map((s: any) => {
                    const credits = s.credits || 3;
                    const grp: AcademicSubject["groupe"] = credits >= 4
                        ? "Groupe 1 (Fondamentales)"
                        : credits >= 2
                        ? "Groupe 2 (Complémentaires)"
                        : "Groupe 3 (Développement Perso)";
                    const cat: AcademicSubject["category"] = (s.code?.includes("MATH") || s.code?.includes("PC") || s.code?.includes("SVT"))
                        ? "Scientifique"
                        : s.code?.includes("INFO")
                        ? "Technique"
                        : (s.code?.includes("EPS") || s.code?.includes("TM"))
                        ? "Culture & Sport"
                        : "Littéraire";

                    return {
                        id: s.id,
                        name: s.name,
                        code: s.code,
                        coef: credits,
                        groupe: grp,
                        category: cat,
                        heuresHebdo: credits,
                    };
                });
                setSubjects(mappedSubs);
            }
        } catch (err) {
            console.error("Erreur chargement académique:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAcademicsData();
    }, []);

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

    const confirmDelete = async () => {
        if (!deleteItem) return;
        try {
            if (deleteItem.type === "class") {
                await classesService.deleteClass(deleteItem.id);
                setClasses((prev) => prev.filter((c) => c.id !== deleteItem.id));
            } else {
                await subjectsService.deleteSubject(deleteItem.id);
                setSubjects((prev) => prev.filter((s) => s.id !== deleteItem.id));
            }
        } catch (err) {
            console.error("Erreur de suppression:", err);
        } finally {
            setIsDeleteModalOpen(false);
            setDeleteItem(null);
        }
    };

    const filteredClasses = classes.filter((c) => {
        const matchesCycle = selectedCycle === "all" || c.cycle === selectedCycle;
        const matchesSearch = c.name.toLowerCase().includes(searchClass.toLowerCase()) ||
            c.serie.toLowerCase().includes(searchClass.toLowerCase()) ||
            c.titular.toLowerCase().includes(searchClass.toLowerCase());
        return matchesCycle && matchesSearch;
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

            {/* Academic Filter Bar */}
            <Card className="border-none shadow-sm bg-blue-50/50 border border-blue-100">
                <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <School className="text-primary-blue" size={24} />
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-primary-blue">
                                Structure Académique de l'Établissement
                            </span>
                            <p className="text-xs text-slate-500">Organisation pédagogique MINESEC ({classes.length} classes actives enregistrées)</p>
                        </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <select
                            value={selectedCycle}
                            onChange={(e) => setSelectedCycle(e.target.value)}
                            className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none shadow-sm cursor-pointer"
                        >
                            <option value="all">Tous Cycles ({classes.length})</option>
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
