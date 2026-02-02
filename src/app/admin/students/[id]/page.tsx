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
    GraduationCap,
    Clock,
    TrendingUp,
    FileText,
    CheckCircle,
    Download,
    Euro,
    Plus,
    Check
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DeleteModal } from "@/components/shared/delete-modal";
import { ResultsModal } from "@/components/shared/results-modal";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function StudentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);

    const confirmDelete = () => {
        router.push("/admin/students");
    };

    // Simulation de données complète
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
            { subject: "Mathématiques", value: 16, type: "Contrôle", date: "15 Jan" },
            { subject: "Français", value: 14, type: "Devoir", date: "12 Jan" },
            { subject: "Anglais", value: 15, type: "Composition", date: "10 Jan" },
        ],
        payments: [
            { id: 1, type: "Tranche 1", amount: 50000, status: "Paid", date: "01 Sept 2025" },
            { id: 2, type: "Tranche 2", amount: 50000, status: "Pending", date: "01 Jan 2026" },
        ],
        documents: [
            { name: "Certificat de naissance.pdf", date: "01 Sept 2025" },
            { name: "Bulletin Trimestre 1.pdf", date: "20 Déc 2025" },
        ]
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" className="text-slate-500 gap-2" onClick={() => router.push("/admin/students")}>
                    <ChevronLeft size={20} /> Retour
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" className="text-amber-600 border-amber-200 hover:bg-amber-50" onClick={() => router.push(`/admin/students/new?edit=${id}`)}>
                        <Edit size={18} className="mr-2" /> Modifier
                    </Button>
                    <Button variant="ghost" className="text-red-500 hover:bg-red-50" onClick={() => setIsDeleteModalOpen(true)}>
                        <Trash2 size={18} className="mr-2" /> Supprimer
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Sidebar Profile Card */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-md overflow-hidden">
                        <div className="h-32 bg-gradient-to-br from-slate-900 to-slate-800 relative">
                            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                                <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden flex items-center justify-center">
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-4xl font-bold text-slate-400">
                                        {student.name.charAt(0)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <CardContent className="pt-20 px-6 pb-8 text-center space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{student.name}</h2>
                                <p className="text-primary-blue font-mono font-bold">{student.matricule}</p>
                                <div className="flex justify-center mt-2">
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                        student.status === "Actif" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                                    )}>
                                        {student.status}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 divide-x divide-slate-100 border-t border-b border-slate-100 py-4">
                                <div className="text-center">
                                    <p className="text-2xl font-black text-slate-900">{student.average}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Moy. Gen.</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-black text-slate-900">{student.attendance}%</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assiduité</p>
                                </div>
                            </div>

                            <div className="space-y-4 text-left">
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Mail size={16} className="text-slate-400 shrink-0" />
                                    <span className="truncate">{student.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Phone size={16} className="text-slate-400 shrink-0" />
                                    <span>{student.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <MapPin size={16} className="text-slate-400 shrink-0" />
                                    <span>{student.address}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Areas */}
                <div className="lg:col-span-8">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="w-full justify-start border-b border-slate-200 bg-transparent rounded-none p-0 h-auto gap-6">
                            <TabsTrigger value="overview" className="border-b-2 border-transparent data-[state=active]:border-primary-blue data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-0 pb-3 font-bold text-slate-500 data-[state=active]:text-primary-blue">
                                Vue d'ensemble
                            </TabsTrigger>
                            <TabsTrigger value="finance" className="border-b-2 border-transparent data-[state=active]:border-primary-blue data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-0 pb-3 font-bold text-slate-500 data-[state=active]:text-primary-blue">
                                Finance
                            </TabsTrigger>
                            <TabsTrigger value="documents" className="border-b-2 border-transparent data-[state=active]:border-primary-blue data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-0 pb-3 font-bold text-slate-500 data-[state=active]:text-primary-blue">
                                Documents
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="mt-6 space-y-6">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100 shadow-sm">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Classe Actuelle</p>
                                            <p className="text-2xl font-black text-slate-900">{student.class}</p>
                                        </div>
                                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                            <GraduationCap size={20} />
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100 shadow-sm">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Progression</p>
                                            <p className="text-2xl font-black text-slate-900">+1.2 pts</p>
                                        </div>
                                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                                            <TrendingUp size={20} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Recent Grades */}
                            <Card className="border-none shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-base font-bold text-slate-800">Dernières Notes</CardTitle>
                                    <Button variant="ghost" size="sm" className="text-primary-blue text-xs font-bold" onClick={() => setIsResultsModalOpen(true)}>
                                        Voir le bulletin
                                    </Button>
                                </CardHeader>
                                <CardContent className="grid gap-3">
                                    {student.recentGrades.map((grade, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 shadow-sm text-sm">
                                                    {grade.value}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">{grade.subject}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase">{grade.type} • {grade.date}</p>
                                                </div>
                                            </div>
                                            <CheckCircle size={16} className="text-emerald-500" />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="finance" className="mt-6 space-y-6">
                            <Card className="border-none shadow-sm bg-slate-900 text-white">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Scolarité Totale</p>
                                            <p className="text-3xl font-black mt-1">250 000 FCFA</p>
                                        </div>
                                        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-emerald-400">
                                            <Euro size={24} />
                                        </div>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                                        <div className="h-full bg-emerald-500 w-[40%]" />
                                    </div>
                                    <div className="flex justify-between text-xs font-medium text-slate-400">
                                        <span>Payé: 100 000 FCFA</span>
                                        <span>Reste: 150 000 FCFA</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-base font-bold text-slate-800">Historique des Paiements</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-3">
                                    {student.payments.map((payment) => (
                                        <div key={payment.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:shadow-sm transition-all bg-white">
                                            <div className="flex items-center gap-4">
                                                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", payment.status === 'Paid' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600")}>
                                                    {payment.status === 'Paid' ? <Check size={20} /> : <Clock size={20} />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{payment.type}</p>
                                                    <p className="text-xs text-slate-500">{payment.date}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-slate-900">{payment.amount.toLocaleString()} FCFA</p>
                                                <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full", payment.status === 'Paid' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600")}>
                                                    {payment.status === 'Paid' ? "Payé" : "En attente"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="documents" className="mt-6">
                            <Card className="border-none shadow-sm">
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-base font-bold text-slate-800">Dossier Administratif</CardTitle>
                                        <Button size="sm" variant="outline" className="flex items-center gap-2">
                                            <Download size={14} /> Tout télécharger
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="grid gap-3">
                                    {student.documents.map((doc, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:border-primary-blue/30 transition-colors cursor-pointer group">
                                            <div className="flex items-center gap-3">
                                                <FileText size={20} className="text-slate-400 group-hover:text-primary-blue transition-colors" />
                                                <div>
                                                    <p className="font-medium text-sm text-slate-900 group-hover:text-primary-blue transition-colors">{doc.name}</p>
                                                    <p className="text-xs text-slate-500">Ajouté le {doc.date}</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary-blue">
                                                <Download size={16} />
                                            </Button>
                                        </div>
                                    ))}
                                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-slate-400 gap-2 hover:border-primary-blue/50 hover:bg-blue-50/50 transition-all cursor-pointer">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                            <Plus size={20} />
                                        </div>
                                        <span className="text-sm font-medium">Ajouter un document</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
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
        </div>
    );
}
