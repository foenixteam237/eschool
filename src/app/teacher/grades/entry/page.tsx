"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { GraduationCap, Search, Save, Trash2, Plus, ArrowLeft, Info, HelpCircle, Check, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DeleteModal } from "@/components/shared/delete-modal";

export default function GradeEntryPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const classId = searchParams.get("classId") || "1";
    const sequenceId = searchParams.get("sequenceId") || "1";
    const [loading, setLoading] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    const classInfo = {
        "1": { name: "6ème A", subject: "Mathématiques" },
        "2": { name: "3ème B", subject: "Physique" },
        "3": { name: "Terminale S", subject: "Mathématiques" }
    }[classId] || { name: "Classe Inconnue", subject: "Matière Inconnue" };

    const sequenceInfo = {
        "1": { name: "Séquence 1", period: "1er Trimestre" },
        "2": { name: "Séquence 2", period: "1er Trimestre" },
        "3": { name: "Séquence 3", period: "2ème Trimestre" },
        "4": { name: "Séquence 4", period: "2ème Trimestre" },
        "5": { name: "Séquence 5", period: "3ème Trimestre" },
        "6": { name: "Séquence 6", period: "3ème Trimestre" },
    }[sequenceId] || { name: "Séquence", period: "Trimestre" };

    const [students, setStudents] = useState([
        { id: "1", name: "KAMGA Jean", matricule: "2025-001", currentGrade: 14.5, comments: "Très bon travail" },
        { id: "2", name: "BELLA Marie", matricule: "2025-002", currentGrade: 12.0, comments: "" },
        { id: "3", name: "FOTSO Paul", matricule: "2025-003", currentGrade: 16.5, comments: "Excellent" },
        { id: "4", name: "NGONO Anne", matricule: "2025-004", currentGrade: 0.0, comments: "" }, // 0.0 often implies missing or not graded yet if explicitly set
        { id: "5", name: "ABBASSI Karim", matricule: "2025-005", currentGrade: null, comments: "" },
        { id: "6", name: "ZIDANE Zinedine", matricule: "2025-006", currentGrade: 8.5, comments: "Doit faire des efforts" },
    ]);

    // Handle grade change
    const handleGradeChange = (id: string, value: string) => {
        let numValue = parseFloat(value);
        if (isNaN(numValue)) numValue = 0; // Or keep as null/string if you want to allow empty
        // Limiting between 0 and 20
        if (numValue > 20) numValue = 20;
        if (numValue < 0) numValue = 0;

        setStudents(prev => prev.map(s =>
            s.id === id ? { ...s, currentGrade: value === "" ? null : numValue } : s
        ));
    };

    const handleCommentChange = (id: string, value: string) => {
        setStudents(prev => prev.map(s =>
            s.id === id ? { ...s, comments: value } : s
        ));
    };

    const handleSave = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setLastSaved(new Date());
        }, 800);
    };

    const getGradeColor = (grade: number | null) => {
        if (grade === null) return "text-slate-400";
        if (grade < 10) return "text-rose-600 font-bold";
        if (grade >= 16) return "text-emerald-600 font-extrabold";
        if (grade >= 10) return "text-primary-blue font-bold";
        return "text-slate-700";
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    // Quick stats
    const gradedCount = students.filter(s => s.currentGrade !== null).length;
    const average = students.reduce((acc, curr) => acc + (curr.currentGrade || 0), 0) / (gradedCount || 1);

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-slate-50/95 backdrop-blur-sm z-20 py-4 border-b border-slate-200/50">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-500 hover:text-primary-blue hover:bg-white shadow-sm border border-slate-100">
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Saisie des Notes</h1>
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-primary-blue text-[10px] font-bold uppercase border border-blue-100">
                                {sequenceInfo.name}
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                            <span className="font-bold text-slate-700">{classInfo.name}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span>{classInfo.subject}</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {lastSaved && (
                        <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 animate-in fade-in duration-500">
                            <Check size={12} /> Sauvegardé à {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    )}
                    <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-100 hidden sm:flex" onClick={() => router.back()}>
                        Annuler
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className={cn(
                            "flex items-center gap-2 font-bold shadow-lg transition-all",
                            loading ? "bg-slate-400" : "bg-primary-blue hover:scale-105 hover:shadow-blue-200"
                        )}
                    >
                        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                        <span className="hidden sm:inline">Enregistrer</span>
                        <span className="sm:hidden">Sauver</span>
                    </Button>
                </div>
            </div>

            {/* Quick Stats & Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Check size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Élèves Notés</p>
                            <p className="text-xl font-black text-slate-900">{gradedCount} <span className="text-sm font-medium text-slate-400">/ {students.length}</span></p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <GraduationCap size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Moyenne Classe</p>
                            <p className="text-xl font-black text-slate-900">{average.toFixed(2)} <span className="text-sm font-medium text-slate-400">/ 20</span></p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-blue-50/50 border border-blue-100">
                    <CardContent className="p-4 flex items-center justify-between text-blue-800">
                        <div className="flex gap-3">
                            <Info size={18} className="shrink-0 mt-0.5" />
                            <p className="text-xs font-medium leading-relaxed">
                                Les notes sont enregistrées automatiquement en brouillon local.
                                <br /><span className="font-bold underline cursor-pointer">Voir les règles de saisie</span>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Table Card */}
            <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100 bg-white">
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-2.5 text-slate-400 pointer-events-none" size={16} />
                        <Input
                            placeholder="Rechercher un élève..."
                            className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="ghost" size="sm" className="text-slate-500 font-bold text-xs gap-1">
                            <HelpCircle size={14} /> Aide
                        </Button>
                        <Button variant="outline" size="sm" className="text-primary-blue border-primary-blue/20 bg-blue-50/50 font-bold text-xs gap-1 hover:bg-blue-50">
                            <Plus size={14} /> Ajouter un élève
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {/* Mobile View (Cards) */}
                    <div className="md:hidden divide-y divide-slate-100">
                        {students.map((student) => (
                            <div key={student.id} className={cn("p-4 space-y-4", student.currentGrade === null ? "bg-slate-50/50" : "bg-white")}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-black text-slate-400 font-mono shadow-sm">
                                            {getInitials(student.name)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{student.name}</p>
                                            <p className="text-[10px] text-slate-500 font-mono">{student.matricule}</p>
                                        </div>
                                    </div>
                                    {student.currentGrade !== null ? (
                                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                            <Check size={16} />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-300 flex items-center justify-center">
                                            <AlertCircle size={16} />
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Note / 20</label>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                max={20}
                                                min={0}
                                                step={0.5}
                                                placeholder="--"
                                                value={student.currentGrade === null ? "" : student.currentGrade}
                                                onChange={(e) => handleGradeChange(student.id, e.target.value)}
                                                className={cn(
                                                    "font-black text-lg h-10 border-2 focus:ring-2",
                                                    getGradeColor(student.currentGrade),
                                                    student.currentGrade === null ? "border-slate-200 bg-slate-50" : "border-slate-200 bg-white"
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Appréciation</label>
                                        <Input
                                            placeholder="Commentaire..."
                                            value={student.comments}
                                            onChange={(e) => handleCommentChange(student.id, e.target.value)}
                                            className="h-10 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop View (Table) */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="py-4 pl-6 pr-4 font-bold text-xs text-slate-500 uppercase tracking-wider w-[30%]">Élève</th>
                                    <th className="py-4 px-4 font-bold text-xs text-slate-500 uppercase tracking-wider text-center w-[20%]">Note ( / 20 )</th>
                                    <th className="py-4 px-4 font-bold text-xs text-slate-500 uppercase tracking-wider w-[40%]">Appréciation</th>
                                    <th className="py-4 px-4 font-bold text-xs text-slate-500 uppercase tracking-wider w-[10%] text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {students.map((student) => (
                                    <tr key={student.id} className={cn("group transition-colors h-20", student.currentGrade === null ? "bg-slate-50/30" : "hover:bg-blue-50/5")}>
                                        <td className="py-3 pl-6 pr-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-black text-slate-400 shadow-sm shrink-0">
                                                    {getInitials(student.name)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 text-sm group-hover:text-primary-blue transition-colors cursor-pointer">{student.name}</p>
                                                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{student.matricule}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex justify-center">
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        max={20}
                                                        min={0}
                                                        step={0.5}
                                                        placeholder="--"
                                                        value={student.currentGrade === null ? "" : student.currentGrade}
                                                        onChange={(e) => handleGradeChange(student.id, e.target.value)}
                                                        className={cn(
                                                            "w-24 text-center font-black h-12 text-lg border-2 focus:ring-4 transition-all shadow-sm rounded-xl",
                                                            getGradeColor(student.currentGrade),
                                                            student.currentGrade === null ? "border-slate-200 bg-slate-50" : "border-slate-200 bg-white focus:border-primary-blue/50 focus:ring-primary-blue/10"
                                                        )}
                                                    />
                                                    {student.currentGrade !== null && (
                                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300 pointer-events-none">
                                                            /20
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="relative">
                                                <Input
                                                    placeholder="Ajouter une appréciation..."
                                                    value={student.comments}
                                                    onChange={(e) => handleCommentChange(student.id, e.target.value)}
                                                    className="h-10 border-transparent bg-transparent hover:bg-slate-50 focus:bg-white focus:border-slate-200 focus:shadow-sm transition-all text-sm placeholder:text-slate-300"
                                                />
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            {student.currentGrade !== null ? (
                                                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                                                    <Check size={16} />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-300 flex items-center justify-center mx-auto">
                                                    <AlertCircle size={16} />
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div >
    );
}
