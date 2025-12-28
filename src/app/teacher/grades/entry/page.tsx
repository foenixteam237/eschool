"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { GraduationCap, Search, Save, Trash2, Plus, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GradeEntryPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const classId = searchParams.get("classId") || "1";
    const sequenceId = searchParams.get("sequenceId") || "1";

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

    const [students] = useState([
        { id: "1", name: "KAMGA Jean", matricule: "2025-001", currentGrade: 14.5 },
        { id: "2", name: "BELLA Marie", matricule: "2025-002", currentGrade: 12.0 },
        { id: "3", name: "FOTSO Paul", matricule: "2025-003", currentGrade: 16.5 },
        { id: "4", name: "NGONO Anne", matricule: "2025-004", currentGrade: 0.0 },
    ]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-500">
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Saisie des Notes</h1>
                        <p className="text-slate-500">{classInfo.name} • {classInfo.subject} • {sequenceInfo.name} ({sequenceInfo.period})</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Trash2 size={18} /> Annuler
                    </Button>
                    <Button className="flex items-center gap-2 bg-success-green hover:bg-emerald-600">
                        <Save size={18} /> Enregistrer Tout
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div>
                        <CardTitle>Liste de la Classe</CardTitle>
                        <CardDescription>Entrez la note de {sequenceInfo.name} sur /20 pour chaque élève</CardDescription>
                    </div>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <Input placeholder="Rechercher un élève..." className="pl-9 h-9" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-500 text-sm">
                                    <th className="pb-3 pr-4 font-semibold">Matricule</th>
                                    <th className="pb-3 pr-4 font-semibold">Nom Complet</th>
                                    <th className="pb-3 pr-4 font-semibold w-32 text-center">Note /20</th>
                                    <th className="pb-3 font-semibold">Commentaire (Facultatif)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {students.map((student) => (
                                    <tr key={student.id} className="group hover:bg-slate-50/50">
                                        <td className="py-4 pr-4 font-medium text-slate-500 text-sm">{student.matricule}</td>
                                        <td className="py-4 pr-4 font-bold text-slate-800">{student.name}</td>
                                        <td className="py-4 pr-4 text-center">
                                            <Input
                                                type="number"
                                                max={20}
                                                min={0}
                                                step={0.25}
                                                defaultValue={student.currentGrade > 0 ? student.currentGrade : ""}
                                                className="w-20 text-center font-bold h-9 mx-auto border-slate-200 focus:border-primary-blue"
                                            />
                                        </td>
                                        <td className="py-4">
                                            <Input
                                                placeholder="Ex: Excellent travail..."
                                                className="h-9 border-slate-200 text-sm"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Button variant="ghost" className="mt-4 w-full border border-dashed border-slate-200 text-slate-500 hover:bg-slate-50">
                        < Plus size={16} className="mr-2" /> Ajouter un élève manuellement
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
