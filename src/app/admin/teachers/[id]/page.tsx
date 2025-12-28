"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
    ChevronLeft,
    Edit,
    Trash2,
    Mail,
    Phone,
    MapPin,
    Calendar,
    GraduationCap,
    BookOpen,
    Clock,
    UserCircle,
    User,
    CheckCircle,
    Award
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DeleteModal } from "@/components/shared/delete-modal";

export default function TeacherDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const teacher = {
        id,
        name: id === "1" ? "Jean DUPONT" : id === "2" ? "Marie SMITH" : "Enseignant Inconnu",
        subjects: id === "1" ? ["Mathématiques", "Physique"] : ["Anglais"],
        classes: id === "1" ? ["6ème A", "3ème B"] : ["6ème A", "5ème B", "Terminal S"],
        email: id === "1" ? "j.dupont@ecole.com" : "m.smith@ecole.com",
        phone: id === "1" ? "699 00 11 22" : "677 33 44 55",
        address: "Quartier Bastos, Yaoundé",
        joinDate: "Septembre 2020",
        birthDate: "15 Juin 1985",
        qualification: "Master en Sciences de l'Éducation",
        status: "Actif"
    };

    const confirmDelete = () => {
        router.back();
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-12">
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-slate-500 hover:text-primary-blue"
                    onClick={() => router.back()}
                >
                    <ChevronLeft size={20} /> Retour à la liste
                </Button>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="text-amber-600 border-amber-200 hover:bg-amber-50"
                        onClick={() => router.push(`/admin/teachers/new?edit=${id}`)}
                    >
                        <Edit size={18} className="mr-2" /> Modifier
                    </Button>
                    <Button
                        variant="ghost"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => setIsDeleteModalOpen(true)}
                    >
                        <Trash2 size={18} className="mr-2" /> Supprimer
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="lg:col-span-1 border-none shadow-sm">
                    <CardContent className="p-8 text-center space-y-6">
                        <div className="w-28 h-28 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400 border-4 border-white shadow-lg">
                            <GraduationCap size={48} />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold text-slate-900">{teacher.name}</h2>
                            <p className="text-primary-blue font-bold text-xs uppercase tracking-widest">{teacher.subjects.join(" & ")}</p>
                            <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider mt-2">
                                {teacher.status}
                            </span>
                        </div>

                        <div className="space-y-3 text-left pt-6 border-t border-slate-50">
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Mail size={16} className="text-slate-400" />
                                <span>{teacher.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Phone size={16} className="text-slate-400" />
                                <span>{teacher.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <MapPin size={16} className="text-slate-400" />
                                <span>{teacher.address}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Assignment & Qualification */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Award className="text-amber-500" size={20} />
                                Parcours Académique
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Diplôme Principal</p>
                                    <p className="font-bold text-slate-700">{teacher.qualification}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date d'embauche</p>
                                    <p className="font-bold text-slate-700">{teacher.joinDate}</p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-50">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 italic">Affectations actuelles</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {teacher.classes.map((cls, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-primary-blue/30 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-primary-blue shadow-sm">
                                                    <BookOpen size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800">{cls}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">{id === "1" ? "Mathématiques" : "Anglais"}</p>
                                                </div>
                                            </div>
                                            <CheckCircle className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Schedule Preview */}
                    <Card className="border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Clock className="text-primary-blue" size={20} />
                                Emploi du Temps
                            </CardTitle>
                            <Button variant="ghost" size="sm" className="text-xs font-bold text-primary-blue" onClick={() => router.push(`/admin/teachers/timetable?id=${id}`)}>
                                VOIR TOUT
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                                <p className="text-slate-400 text-sm italic">Aperçu rapide non disponible. Cliquez sur "Voir tout" pour l'emploi du temps complet.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Supprimer l'enseignant"
                description="Cette action est irréversible. L'enseignant sera retiré de toutes ses classes et matières assignées."
                itemName={teacher.name}
            />
        </div>
    );
}
