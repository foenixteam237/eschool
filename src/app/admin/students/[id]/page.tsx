"use client";

import { useParams, useRouter } from "next/navigation";
import {
    ChevronLeft,
    Edit,
    Trash2,
    Calendar,
    Mail,
    Phone,
    MapPin,
    User,
    GraduationCap,
    Clock,
    TrendingUp,
    FileText,
    CheckCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DeleteModal } from "@/components/shared/delete-modal";
import { ResultsModal } from "@/components/shared/results-modal";
import { useState } from "react";

export default function StudentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);

    const confirmDelete = () => {
        router.push("/admin/students");
    };

    // Simulation de données
    const student = {
        id,
        name: id === "1" ? "KAMGA Jean" : id === "2" ? "BELLA Marie" : "Étudiant Inconnu",
        matricule: id === "1" ? "2025-ECO-0001" : "2025-ECO-0002",
        class: id === "1" ? "3ème B" : "6ème A",
        status: "Actif",
        email: id === "1" ? "jean.kamga@gmail.com" : "marie.bella@yahoo.fr",
        phone: "+237 677 88 99 00",
        address: "Bastos, Yaoundé",
        birthDate: "12 Mai 2010",
        gender: "Masculin",
        average: 14.5,
        attendance: 95,
        recentGrades: [
            { subject: "Mathématiques", value: 16, type: "Contrôle" },
            { subject: "Français", value: 14, type: "Devoir" },
            { subject: "Anglais", value: 15, type: "Composition" },
        ]
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-12">
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-slate-500"
                    onClick={() => router.push("/admin/students")}
                >
                    <ChevronLeft size={20} /> Retour à la liste
                </Button>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="text-amber-600 border-amber-200 hover:bg-amber-50"
                        onClick={() => router.push(`/admin/students/new?edit=${id}`)}
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
                {/* Profile Overview */}
                <Card className="lg:col-span-1 border-none shadow-sm h-fit">
                    <CardContent className="p-8 text-center space-y-6">
                        <div className="w-32 h-32 rounded-full bg-slate-900 mx-auto flex items-center justify-center text-white text-4xl font-bold border-4 border-slate-100 shadow-xl">
                            {student.name.charAt(0)}
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold text-slate-900">{student.name}</h2>
                            <p className="text-primary-blue font-mono text-sm font-bold">{student.matricule}</p>
                            <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider mt-2">
                                {student.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-slate-900">{student.average}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Moyenne</p>
                            </div>
                            <div className="text-center border-l border-slate-50">
                                <p className="text-2xl font-bold text-slate-900">{student.attendance}%</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Présence</p>
                            </div>
                        </div>

                        <div className="space-y-3 text-left">
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Mail size={16} className="text-slate-400" />
                                <span>{student.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Phone size={16} className="text-slate-400" />
                                <span>{student.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <MapPin size={16} className="text-slate-400" />
                                <span>{student.address}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Calendar size={16} className="text-slate-400" />
                                <span>{student.birthDate}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Academic Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-none shadow-sm">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Classe Actuelle</CardTitle>
                                    <GraduationCap className="text-primary-blue" size={20} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-slate-900">{student.class}</p>
                                <p className="text-xs text-slate-400 mt-1">Année scolaire 2025-2026</p>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Performance</CardTitle>
                                    <TrendingUp className="text-emerald-500" size={20} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-slate-900">+1.2 pts</p>
                                <p className="text-xs text-slate-400 mt-1">Progression par rapport au dernier trimestre</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Grades */}
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <FileText size={20} className="text-primary-blue" />
                                <CardTitle className="text-lg">Notes Récentes</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {student.recentGrades.map((grade, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-primary-blue/30 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-primary-blue shadow-sm font-bold">
                                                {grade.value}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{grade.subject}</p>
                                                <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">{grade.type}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                                            <CheckCircle size={14} />
                                            <span>Validé</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button
                                variant="ghost"
                                className="w-full mt-6 text-primary-blue font-bold hover:bg-blue-50"
                                onClick={() => setIsResultsModalOpen(true)}
                            >
                                Voir tout le relevé de notes
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Attendance summary */}
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Clock size={20} className="text-amber-500" />
                                <CardTitle className="text-lg">Assiduité</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-6">
                                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary-blue w-[95%]" />
                                </div>
                                <span className="text-lg font-bold text-slate-900">95%</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-2 italic">Dernière mise à jour : Aujourd'hui à 08:30</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Supprimer l'élève"
                description="Cette action supprimera définitivement le dossier de cet élève ainsi que tout son historique académique."
                itemName={student.name}
            />

            <ResultsModal
                isOpen={isResultsModalOpen}
                onClose={() => setIsResultsModalOpen(false)}
                studentName={student.name}
                studentClass={student.class}
            />
        </div >
    );
}
