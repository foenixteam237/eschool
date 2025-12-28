"use client";

import { useState } from "react";
import {
    BookOpen,
    Layers,
    Plus,
    MoreVertical,
    Edit,
    Trash2,
    ListFilter,
    Users as UsersIcon,
    ChevronRight,
    ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DeleteModal } from "@/components/shared/delete-modal";

export default function AdminAcademicsPage() {
    const [classes, setClasses] = useState([
        { id: "1", name: "6ème B", level: "Premier Cycle", students: 42, titular: "Jean DUPONT" },
        { id: "2", name: "4ème All A", level: "Premier Cycle", students: 38, titular: "Paul LEFEBVRE" },
        { id: "3", name: "Tle C 1", level: "Second Cycle", students: 35, titular: "Marie SMITH" },
    ]);

    const [subjects, setSubjects] = useState([
        { id: "1", name: "Mathématiques", coef: 5, category: "Scientifique" },
        { id: "2", name: "Anglais", coef: 3, category: "Littéraire" },
        { id: "3", name: "Physique", coef: 4, category: "Scientifique" },
        { id: "4", name: "Français", coef: 4, category: "Littéraire" },
    ]);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState<{ id: string, name: string, type: 'class' | 'subject' } | null>(null);

    const handleDeleteClick = (id: string, name: string, type: 'class' | 'subject') => {
        setDeleteItem({ id, name, type });
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!deleteItem) return;
        if (deleteItem.type === 'class') {
            setClasses(prev => prev.filter(c => c.id !== deleteItem.id));
        } else {
            setSubjects(prev => prev.filter(s => s.id !== deleteItem.id));
        }
        setIsDeleteModalOpen(false);
        setDeleteItem(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Classes & Matières</h1>
                    <p className="text-slate-500 text-sm">Configurez la structure académique et le catalogue des matières.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Classes Section */}
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Layers className="text-primary-blue" size={24} /> Gestion des Classes
                            </CardTitle>
                            <CardDescription className="text-slate-400">Structure des niveaux et promotions</CardDescription>
                        </div>
                        <Link href="/admin/academics/classes/new">
                            <Button className="bg-slate-900 hover:bg-slate-800 h-10 shadow-lg shadow-slate-200">
                                <Plus size={18} className="mr-2" /> Nouvelle Classe
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {classes.map((cls) => (
                                <div key={cls.id} className="group relative flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-primary-blue/20 hover:bg-blue-50/10 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-blue/10 group-hover:text-primary-blue transition-colors">
                                            <UsersIcon size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-base">{cls.name}</p>
                                            <p className="text-xs text-slate-400 font-medium uppercase tracking-tight">{cls.level} • {cls.students} élèves</p>
                                            <p className="text-[10px] text-primary-blue font-bold mt-1.5 flex items-center gap-1">
                                                <span className="w-1 h-1 rounded-full bg-primary-blue" />
                                                Titulaire: {cls.titular}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={`/admin/academics/classes/new?edit=${cls.id}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-amber-500 rounded-full">
                                                    <Edit size={16} />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-slate-400 hover:text-red-500 rounded-full"
                                                onClick={() => handleDeleteClick(cls.id, cls.name, 'class')}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                        <Link href={`/admin/academics/classes/${cls.id}`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-primary-blue rounded-lg">
                                                <ChevronRight size={20} />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Subjects Section */}
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <BookOpen className="text-emerald-500" size={24} /> Matières & Coeffs
                            </CardTitle>
                            <CardDescription className="text-slate-400">Catalogue des enseignements</CardDescription>
                        </div>
                        <Link href="/admin/academics/subjects/new">
                            <Button variant="outline" className="border-slate-200 h-10 hover:bg-slate-50">
                                <Plus size={18} className="mr-2" /> Nouvelle Matière
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {subjects.map((sub) => (
                                <div key={sub.id} className="group p-4 rounded-xl bg-slate-50 border border-transparent hover:border-emerald-500/20 hover:bg-emerald-50/5 transition-all">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-800">{sub.name}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{sub.category}</span>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={`/admin/academics/subjects/new?edit=${sub.id}`}>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-300 hover:text-amber-500 rounded-full">
                                                    <Edit size={14} />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-slate-300 hover:text-red-500 rounded-full"
                                                onClick={() => handleDeleteClick(sub.id, sub.name, 'subject')}
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                        <div className="flex items-center gap-1.5">
                                            <p className="text-[10px] text-slate-400 uppercase font-black">Coefficient</p>
                                            <p className="font-extrabold text-emerald-600 bg-emerald-100/50 px-2 py-0.5 rounded text-xs">{sub.coef}</p>
                                        </div>
                                        <ArrowRight size={14} className="text-slate-200 group-hover:text-emerald-500 transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title={deleteItem?.type === 'class' ? "Supprimer la classe" : "Supprimer la matière"}
                description={deleteItem?.type === 'class'
                    ? "Toutes les affectations d'enseignants et les emplois du temps liés à cette classe seront supprimés."
                    : "Cette matière sera retirée de tous les programmes scolaires et coefficients associés."}
                itemName={deleteItem?.name}
            />
        </div>
    );
}
