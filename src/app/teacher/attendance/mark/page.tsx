"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, X, Clock, Save, ArrowLeft, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createAbsenceNotification } from "@/lib/attendance";

export default function TeacherAttendanceMarkPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const classId = searchParams.get("classId") || "1";
    const isReadOnly = searchParams.get("readOnly") === "true";

    const classInfo = {
        "1": { name: "6ème A", subject: "Mathématiques", count: 42 },
        "2": { name: "3ème B", subject: "Physique", count: 38 },
        "3": { name: "Terminale S", subject: "Mathématiques", count: 35 }
    }[classId] || { name: "Classe Inconnue", subject: "Matière Inconnue", count: 0 };

    const [students, setStudents] = useState([
        { id: "1", name: "KAMGA Jean", status: "PRESENT", matricule: "2025-001" },
        { id: "2", name: "BELLA Marie", status: "PRESENT", matricule: "2025-002" },
        { id: "3", name: "FOTSO Paul", status: "ABSENT", matricule: "2025-003" },
        { id: "4", name: "NGONO Anne", status: "RETARD", matricule: "2025-004" },
    ]);

    const toggleStatus = (id: string, status: string) => {
        if (isReadOnly) return;
        if (status === "ABSENT") {
            createAbsenceNotification(id);
        }
        setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-500 border border-slate-200 bg-white">
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{isReadOnly ? "Détails de l'Appel" : "Faire l'Appel"}</h1>
                        <p className="text-slate-500">{classInfo.name} • {classInfo.subject} • {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    </div>
                </div>
                {!isReadOnly && (
                    <Button className="bg-primary-blue flex items-center gap-2 font-bold shadow-lg shadow-blue-100 animate-in slide-in-from-right-4 duration-700">
                        <Save size={18} /> Valider l'appel
                    </Button>
                )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-emerald-50 border-emerald-100 border-l-4 border-l-emerald-500 shadow-sm">
                    <CardContent className="p-4">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Présents</p>
                        <h4 className="text-2xl font-black text-emerald-900 mt-1">{students.filter(s => s.status === "PRESENT").length}</h4>
                    </CardContent>
                </Card>
                <Card className="bg-rose-50 border-rose-100 border-l-4 border-l-rose-500 shadow-sm">
                    <CardContent className="p-4">
                        <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Absents</p>
                        <h4 className="text-2xl font-black text-rose-900 mt-1">{students.filter(s => s.status === "ABSENT").length}</h4>
                    </CardContent>
                </Card>
                <Card className="bg-amber-50 border-amber-100 border-l-4 border-l-amber-500 shadow-sm">
                    <CardContent className="p-4">
                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Retards</p>
                        <h4 className="text-2xl font-black text-amber-900 mt-1">{students.filter(s => s.status === "RETARD").length}</h4>
                    </CardContent>
                </Card>
                <Card className="bg-slate-50 border-slate-100 border-l-4 border-l-slate-800 shadow-sm">
                    <CardContent className="p-4">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Classe</p>
                        <h4 className="text-2xl font-black text-slate-800 mt-1">{students.length}</h4>
                    </CardContent>
                </Card>
            </div>

            <Card className="overflow-hidden border-none shadow-sm">
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                        {students.map((s) => (
                            <div key={s.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm transition-colors",
                                        s.status === "PRESENT" ? "bg-emerald-100 text-emerald-600" :
                                            s.status === "ABSENT" ? "bg-rose-100 text-rose-600" :
                                                "bg-amber-100 text-amber-600"
                                    )}>
                                        {s.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-lg group-hover:text-primary-blue transition-colors">{s.name}</p>
                                        <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                            <Users size={12} /> {s.matricule}
                                        </p>
                                    </div>
                                </div>
                                <div className={cn("flex gap-2 w-full md:w-auto p-1 bg-slate-100 rounded-xl", isReadOnly && "opacity-75 pointer-events-none")}>
                                    <button
                                        onClick={() => toggleStatus(s.id, "PRESENT")}
                                        disabled={isReadOnly}
                                        className={cn(
                                            "flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                                            s.status === "PRESENT" ? "bg-white text-emerald-600 shadow-md transform scale-105" : "text-slate-400 hover:text-emerald-500"
                                        )}
                                    >
                                        <Check size={16} strokeWidth={3} /> <span className="hidden md:inline">Présent</span>
                                    </button>
                                    <button
                                        onClick={() => toggleStatus(s.id, "ABSENT")}
                                        disabled={isReadOnly}
                                        className={cn(
                                            "flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                                            s.status === "ABSENT" ? "bg-white text-rose-600 shadow-md transform scale-105" : "text-slate-400 hover:text-rose-500"
                                        )}
                                    >
                                        <X size={16} strokeWidth={3} /> <span className="hidden md:inline">Absent</span>
                                    </button>
                                    <button
                                        onClick={() => toggleStatus(s.id, "RETARD")}
                                        disabled={isReadOnly}
                                        className={cn(
                                            "flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                                            s.status === "RETARD" ? "bg-white text-amber-600 shadow-md transform scale-105" : "text-slate-400 hover:text-amber-500"
                                        )}
                                    >
                                        <Clock size={16} strokeWidth={3} /> <span className="hidden md:inline">Retard</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
