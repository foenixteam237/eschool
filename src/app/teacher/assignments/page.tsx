"use client";

import { useState } from "react";
import { Plus, Calendar, BookOpen, Clock, FileText, Download, Trash2, Edit, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function TeacherAssignmentsPage() {
    const [assignments] = useState([
        { id: 1, title: "Exercices Algèbre - Chapitre 3", class: "6ème A", subject: "Mathématiques", dueDate: "2025-12-24", submitted: 28, total: 42, status: "active" },
        { id: 2, title: "Dissertation - Guerre Froide", class: "Terminale S", subject: "Histoire", dueDate: "2025-12-28", submitted: 5, total: 35, status: "pending" },
        { id: 3, title: "TP Optique", class: "3ème B", subject: "Physique", dueDate: "2025-12-20", submitted: 38, total: 38, status: "completed" },
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
            case "completed": return "bg-slate-100 text-slate-700 border-slate-200";
            default: return "bg-slate-100 text-slate-700";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "active": return "En cours";
            case "pending": return "À venir";
            case "completed": return "Terminé";
            default: return status;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestion des Devoirs</h1>
                    <p className="text-slate-500">Créez et suivez les devoirs de vos classes.</p>
                </div>
                <Button className="bg-primary-blue hover:bg-blue-700 text-white shadow-lg shadow-blue-200">
                    <Plus size={20} className="mr-2" /> Nouveau Devoir
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-indigo-50 border-l-4 border-indigo-500">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl text-indigo-600 shadow-sm">
                                <FileText size={24} />
                            </div>
                            <div>
                                <p className="text-indigo-600 text-xs font-black uppercase tracking-widest">En cours</p>
                                <h3 className="text-2xl font-black text-indigo-900 mt-1">
                                    {assignments.filter(a => a.status === 'active').length} Devoirs
                                </h3>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-emerald-50 border-l-4 border-emerald-500">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl text-emerald-600 shadow-sm">
                                <Download size={24} />
                            </div>
                            <div>
                                <p className="text-emerald-600 text-xs font-black uppercase tracking-widest">Taux de Rendu</p>
                                <h3 className="text-2xl font-black text-emerald-900 mt-1">78%</h3>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-amber-50 border-l-4 border-amber-500">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl text-amber-600 shadow-sm">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-amber-600 text-xs font-black uppercase tracking-widest">À Corriger</p>
                                <h3 className="text-2xl font-black text-amber-900 mt-1">12 Copies</h3>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4">
                {assignments.map((assignment) => (
                    <Card key={assignment.id} className="group hover:border-primary-blue/30 transition-all overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-3 flex-1">
                                    <div className="flex items-center gap-3">
                                        <span className={cn("px-2.5 py-0.5 text-xs rounded-md border border-transparent font-bold", getStatusColor(assignment.status))}>
                                            {getStatusLabel(assignment.status)}
                                        </span>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                            <BookOpen size={12} /> {assignment.subject}
                                        </span>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                            <Users size={12} /> {assignment.class}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-blue transition-colors">
                                            {assignment.title}
                                        </h3>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar size={14} className="text-slate-400" />
                                                Pour le {new Date(assignment.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-2xl font-black text-slate-900">
                                            {assignment.submitted}<span className="text-slate-300 text-lg">/{assignment.total}</span>
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rendus</p>
                                    </div>

                                    <div className="flex items-center gap-2 border-l border-slate-100 pl-6">
                                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary-blue">
                                            <Edit size={18} />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500">
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
