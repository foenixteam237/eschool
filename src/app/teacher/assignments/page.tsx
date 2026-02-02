"use client";

import { useState } from "react";
import { Plus, Calendar, BookOpen, Clock, FileText, Download, Trash2, Edit, Users, CheckCircle2, AlertCircle, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function TeacherAssignmentsPage() {
    const [assignments] = useState([
        { id: 1, title: "Exercices Algèbre - Chapitre 3", class: "6ème A", subject: "Mathématiques", dueDate: "2025-12-24", submitted: 28, total: 42, status: "active", type: "Devoir Maison" },
        { id: 2, title: "Dissertation - Guerre Froide", class: "Terminale S", subject: "Histoire", dueDate: "2025-12-28", submitted: 5, total: 35, status: "pending", type: "Dissertation" },
        { id: 3, title: "TP Optique", class: "3ème B", subject: "Physique", dueDate: "2025-12-20", submitted: 38, total: 38, status: "completed", type: "Travaux Pratiques" },
        { id: 4, title: "Lecture: Le Petit Prince", class: "6ème A", subject: "Français", dueDate: "2025-12-15", submitted: 42, total: 42, status: "completed", type: "Lecture" },
    ]);

    const activeAssignments = assignments.filter(a => a.status === 'active' || a.status === 'pending');
    const pastAssignments = assignments.filter(a => a.status === 'completed');

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active": return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wide"><Clock size={12} /> En cours</span>;
            case "pending": return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wide"><AlertCircle size={12} /> À venir</span>;
            case "completed": return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 uppercase tracking-wide"><CheckCircle2 size={12} /> Terminé</span>;
            default: return null;
        }
    };

    const AssignmentCard = ({ assignment }: { assignment: any }) => (
        <Card className="group hover:border-primary-blue/30 hover:shadow-md transition-all">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                            {getStatusBadge(assignment.status)}
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md">
                                <BookOpen size={10} /> {assignment.subject}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md">
                                <Users size={10} /> {assignment.class}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-blue transition-colors mb-1">
                                {assignment.title}
                            </h3>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{assignment.type}</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500 bg-slate-50 w-fit px-3 py-1.5 rounded-lg border border-slate-100">
                            <span className="flex items-center gap-2 font-medium">
                                <Calendar size={14} className="text-slate-400" />
                                Pour le <span className="text-slate-700 font-bold">{new Date(assignment.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span>
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 md:border-l md:border-slate-100 md:pl-6">
                        <div className="text-right">
                            <div className="flex items-baseline justify-end gap-1">
                                <p className="text-3xl font-black text-slate-900">{assignment.submitted}</p>
                                <span className="text-slate-400 font-bold text-sm">/{assignment.total}</span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Copies Rendues</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-primary-blue hover:bg-blue-50 rounded-lg transition-colors" title="Modifier">
                                <Edit size={18} />
                            </Button>
                            <Button variant="outline" size="sm" className="font-bold border-slate-200 text-slate-600 hover:text-primary-blue hover:border-primary-blue/30 gap-2">
                                <FileText size={16} />
                                {assignment.status === 'completed' ? 'Corriger' : 'Gérer'}
                            </Button>
                        </div>
                    </div>
                </div>
                {/* Progress Bar */}
                <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className={cn("h-full rounded-full transition-all duration-1000",
                            assignment.status === 'completed' ? "bg-slate-400" : "bg-primary-blue"
                        )}
                        style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}
                    />
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestion des Devoirs</h1>
                    <p className="text-slate-500">Créez, distribuez et corrigez les travaux de vos élèves.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="text-slate-600 border-slate-200 hover:bg-slate-50 font-bold">
                        <Download size={18} className="mr-2" /> Rapport
                    </Button>
                    <Button className="bg-primary-blue hover:bg-blue-700 text-white shadow-lg shadow-blue-200 hover:scale-105 transition-all font-bold">
                        <Plus size={20} className="mr-2" /> Nouveau Devoir
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-inner">
                                <FileText size={24} />
                            </div>
                            <div>
                                <p className="text-indigo-600/70 text-xs font-black uppercase tracking-widest">En cours</p>
                                <h3 className="text-2xl font-black text-indigo-900 mt-1">
                                    {assignments.filter(a => a.status === 'active').length} Devoirs
                                </h3>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                                <Download size={24} />
                            </div>
                            <div>
                                <p className="text-emerald-600/70 text-xs font-black uppercase tracking-widest">Taux de Rendu</p>
                                <h3 className="text-2xl font-black text-emerald-900 mt-1">78%</h3>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-gradient-to-br from-amber-50 to-white border-amber-100">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-amber-600/70 text-xs font-black uppercase tracking-widest">À Corriger</p>
                                <h3 className="text-2xl font-black text-amber-900 mt-1">12 Copies</h3>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content with Tabs */}
            <Tabs defaultValue="active" className="space-y-6">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                    <TabsList className="bg-slate-100 p-1 rounded-xl h-auto w-full md:w-fit overflow-x-auto flex-nowrap justify-start">
                        <TabsTrigger
                            value="active"
                            className="rounded-lg px-4 py-2 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-primary-blue data-[state=active]:shadow-sm text-slate-500 transition-all whitespace-nowrap"
                        >
                            En cours & À venir
                        </TabsTrigger>
                        <TabsTrigger
                            value="past"
                            className="rounded-lg px-4 py-2 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-primary-blue data-[state=active]:shadow-sm text-slate-500 transition-all whitespace-nowrap"
                        >
                            Terminés & Archivés
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full xl:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                            <Input
                                placeholder="Rechercher..."
                                className="pl-9 h-10 w-full bg-white border-slate-200 text-sm focus:ring-primary-blue"
                            />
                        </div>
                        <Button variant="outline" size="icon" className="h-10 w-full sm:w-10 border-slate-200 text-slate-500 hover:text-primary-blue bg-white">
                            <Filter size={18} />
                        </Button>
                    </div>
                </div>

                <TabsContent value="active" className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                    {activeAssignments.length > 0 ? (
                        activeAssignments.map(assignment => (
                            <AssignmentCard key={assignment.id} assignment={assignment} />
                        ))
                    ) : (
                        <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <p>Aucun devoir en cours.</p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="past" className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                    {pastAssignments.map(assignment => (
                        <AssignmentCard key={assignment.id} assignment={assignment} />
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}
