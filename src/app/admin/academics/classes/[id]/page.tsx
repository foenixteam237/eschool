"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
    ChevronLeft,
    Edit,
    Trash2,
    Layers,
    BookOpen,
    Users as UsersIcon,
    GraduationCap,
    Plus,
    Clock,
    UserCircle,
    ArrowUpRight,
    Search,
    Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DeleteModal } from "@/components/shared/delete-modal";
import Link from "next/link";

export default function ClassDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const classData = {
        id,
        name: id === "1" ? "6ème B" : id === "2" ? "4ème All A" : "Promotion Inconnue",
        level: "Premier Cycle",
        studentCount: 42,
        titular: "Jean DUPONT",
        curriculum: [
            { subject: "Mathématiques", teacher: "Jean DUPONT", coef: 5, hours: 6 },
            { subject: "Français", teacher: "Alice MVE", coef: 4, hours: 5 },
            { subject: "Anglais", teacher: "Marie SMITH", coef: 3, hours: 4 },
            { subject: "Physique-Chimie", teacher: "Paul LEFEBVRE", coef: 4, hours: 4 },
        ],
        students: [
            { id: "101", name: "Marc NKOU", matricule: "24C001", status: "Inscrit" },
            { id: "102", name: "Sophie AMBANI", matricule: "24C002", status: "Inscrit" },
            { id: "103", name: "David TCHATCHOUA", matricule: "24C003", status: "Non Inscrit" },
        ]
    };

    const confirmDelete = () => {
        router.push("/admin/academics");
    };

    const filteredStudents = classData.students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.matricule.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-500">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-slate-500 hover:text-primary-blue bg-white shadow-sm border border-slate-100"
                    onClick={() => router.back()}
                >
                    <ChevronLeft size={20} /> Retour
                </Button>
                <div className="flex gap-2">
                    <Link href={`/admin/academics/classes/new?edit=${id}`}>
                        <Button
                            variant="outline"
                            className="text-amber-600 border-amber-200 hover:bg-amber-50 h-10"
                        >
                            <Edit size={18} className="mr-2" /> Modifier la structure
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        className="text-red-500 hover:bg-red-50 h-10"
                        onClick={() => setIsDeleteModalOpen(true)}
                    >
                        <Trash2 size={18} className="mr-2" /> Supprimer la classe
                    </Button>
                </div>
            </div>

            {/* Profile Overview Card */}
            <Card className="border-none shadow-sm bg-gradient-to-br from-white to-slate-50 overflow-hidden">
                <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                        <div className="p-8 md:w-2/3 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-primary-blue/10 flex items-center justify-center text-primary-blue shadow-inner">
                                    <Layers size={32} />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">{classData.name}</h1>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-black uppercase tracking-widest">{classData.level}</span>
                                        <span className="text-slate-300">|</span>
                                        <p className="text-primary-blue font-bold text-sm">Titulaire: {classData.titular}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6 pt-4">
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Effectif</p>
                                    <div className="flex items-end gap-2">
                                        <span className="text-2xl font-black text-slate-800">{classData.studentCount}</span>
                                        <span className="text-xs text-slate-400 pb-1 font-bold">Élèves</span>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Matières</p>
                                    <div className="flex items-end gap-2">
                                        <span className="text-2xl font-black text-slate-800">{classData.curriculum.length}</span>
                                        <span className="text-xs text-slate-400 pb-1 font-bold">Unités</span>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Heures/Sem</p>
                                    <div className="flex items-end gap-2">
                                        <span className="text-2xl font-black text-slate-800">28</span>
                                        <span className="text-xs text-slate-400 pb-1 font-bold">Heures</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/3 bg-slate-900 p-8 text-white flex flex-col justify-center space-y-4">
                            <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest">Aperçu Rapide</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Taux de présence</span>
                                    <span className="font-bold text-emerald-400">94%</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Moyenne Classe</span>
                                    <span className="font-bold text-blue-400">14.5/20</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Prochain Examen</span>
                                    <span className="font-bold text-amber-400 italic">Dans 4 jours</span>
                                </div>
                            </div>
                            <Button className="w-full bg-white/10 hover:bg-white/20 border-none text-xs font-bold tracking-widest mt-4">
                                ÉDITER LE BULLETIN
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Curriculum Section */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50">
                            <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <BookOpen className="text-emerald-500" size={20} />
                                    Programme d'Enseignement
                                </CardTitle>
                                <CardDescription className="text-xs">Répartition des matières et intervenants</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs font-bold text-primary-blue uppercase tracking-widest">
                                <Plus size={14} className="mr-1" /> Ajouter
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 border-b border-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Matière</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Enseignant</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Coeff</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Volume</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {classData.curriculum.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-slate-700 text-sm group-hover:text-primary-blue transition-colors">{item.subject}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">
                                                        <UserCircle size={14} />
                                                    </div>
                                                    <span className="text-xs font-medium text-slate-600">{item.teacher}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-black">{item.coef}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-xs font-bold text-slate-500">{item.hours}h/sem</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>

                    {/* Schedule Placeholder */}
                    <Card className="border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Clock className="text-amber-500" size={20} />
                                Emploi du Temps Hebdomadaire
                            </CardTitle>
                            <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold">CONFIGURER</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="p-12 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                                    <Clock size={32} />
                                </div>
                                <div className="max-w-xs">
                                    <p className="text-slate-400 text-sm font-bold italic">La grille horaire pour cette classe n'a pas encore été générée pour ce trimestre.</p>
                                </div>
                                <Button className="bg-slate-900 text-[10px] font-black tracking-widest mt-2 uppercase">LANCER LE GÉNÉRATEUR</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Students Sidebar */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm h-full flex flex-col">
                        <CardHeader className="border-b border-slate-50">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <UsersIcon className="text-primary-blue" size={20} />
                                Liste des Élèves
                            </CardTitle>
                            <div className="relative mt-4">
                                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                <Input
                                    placeholder="Chercher un élève..."
                                    className="pl-9 h-10 border-slate-100 bg-slate-50/50 text-xs"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 overflow-hidden">
                            <div className="divide-y divide-slate-50 overflow-y-auto max-h-[600px]">
                                {filteredStudents.map((student) => (
                                    <div key={student.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary-blue/10 group-hover:text-primary-blue transition-colors">
                                                <GraduationCap size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">{student.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{student.matricule}</p>
                                            </div>
                                        </div>
                                        <Link href={`/admin/students/${student.id}`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-primary-blue opacity-0 group-hover:opacity-100 transition-all">
                                                <ArrowUpRight size={18} />
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                                {filteredStudents.length === 0 && (
                                    <div className="p-8 text-center">
                                        <p className="text-xs text-slate-400 italic">Aucun élève trouvé.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <div className="p-4 border-t border-slate-50">
                            <Button className="w-full bg-primary-blue hover:bg-primary-blue/90 h-10 text-[10px] font-black tracking-widest uppercase">
                                <Plus size={14} className="mr-2" /> Inscrire un élève
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Supprimer la classe"
                description="Cette action est irréversible. L'historique académique de cette promotion sera archivé mais plus accessible directement."
                itemName={classData.name}
            />
        </div>
    );
}
