"use client";

import { X, Award, TrendingUp, TrendingDown, User, School } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StudentReportCardModalProps {
    student: {
        name: string;
        matricule: string;
        class: string;
        average: number;
        rank: number;
    };
    grades: {
        subject: string;
        grade: number;
        coef: number;
        teacher: string;
    }[];
    sequenceInfo: {
        name: string;
        trimester: string;
    };
    onClose: () => void;
}

export default function StudentReportCardModal({ student, grades, sequenceInfo, onClose }: StudentReportCardModalProps) {
    const totalPoints = grades.reduce((sum, g) => sum + (g.grade * g.coef), 0);
    const totalCoefs = grades.reduce((sum, g) => sum + g.coef, 0);
    const average = totalCoefs > 0 ? (totalPoints / totalCoefs).toFixed(2) : "0.00";

    const passedSubjects = grades.filter(g => g.grade >= 10).length;
    const failedSubjects = grades.filter(g => g.grade < 10).length;

    const getGradeColor = (grade: number) => {
        if (grade >= 16) return "text-emerald-600 bg-emerald-50";
        if (grade >= 14) return "text-blue-600 bg-blue-50";
        if (grade >= 12) return "text-cyan-600 bg-cyan-50";
        if (grade >= 10) return "text-amber-600 bg-amber-50";
        return "text-red-600 bg-red-50";
    };

    const getMention = (avg: number) => {
        if (avg >= 16) return { label: "Très Bien", color: "text-emerald-700" };
        if (avg >= 14) return { label: "Bien", color: "text-blue-700" };
        if (avg >= 12) return { label: "Assez Bien", color: "text-cyan-700" };
        if (avg >= 10) return { label: "Passable", color: "text-amber-700" };
        return { label: "Insuffisant", color: "text-red-700" };
    };

    const mention = getMention(parseFloat(average));

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-blue to-blue-600 text-white p-6 relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:bg-white/20"
                    >
                        <X size={24} />
                    </Button>
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                            <User className="text-white" size={40} />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-3xl font-black">{student.name}</h2>
                            <div className="flex items-center gap-4 mt-2 text-blue-100">
                                <span className="flex items-center gap-1">
                                    <School size={16} />
                                    {student.class}
                                </span>
                                <span>•</span>
                                <span>{student.matricule}</span>
                                <span>•</span>
                                <span>{sequenceInfo.name} - {sequenceInfo.trimester}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="border-l-4 border-l-primary-blue">
                            <CardContent className="p-4">
                                <p className="text-xs font-bold text-slate-400 uppercase">Moyenne Générale</p>
                                <p className="text-3xl font-black text-primary-blue mt-1">{average}/20</p>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-emerald-500">
                            <CardContent className="p-4">
                                <p className="text-xs font-bold text-slate-400 uppercase">Rang</p>
                                <p className="text-3xl font-black text-emerald-600 mt-1">{student.rank}ème</p>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-green-500">
                            <CardContent className="p-4">
                                <p className="text-xs font-bold text-slate-400 uppercase">Matières Réussies</p>
                                <p className="text-3xl font-black text-green-600 mt-1">{passedSubjects}</p>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-red-500">
                            <CardContent className="p-4">
                                <p className="text-xs font-bold text-slate-400 uppercase">Échecs</p>
                                <p className="text-3xl font-black text-red-600 mt-1">{failedSubjects}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Mention */}
                    <Card className="border-2 border-primary-blue">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Award className={mention.color} size={32} />
                                <div>
                                    <p className="text-sm font-bold text-slate-500">Mention</p>
                                    <p className={cn("text-2xl font-black", mention.color)}>{mention.label}</p>
                                </div>
                            </div>
                            {parseFloat(average) >= student.average ? (
                                <div className="flex items-center gap-2 text-emerald-600">
                                    <TrendingUp size={24} />
                                    <span className="font-bold">Au-dessus de la moyenne classe</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-amber-600">
                                    <TrendingDown size={24} />
                                    <span className="font-bold">En dessous de la moyenne classe</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Grades Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Détail des Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b-2 border-slate-200">
                                            <th className="text-left p-3 text-xs font-bold text-slate-500 uppercase">Matière</th>
                                            <th className="text-center p-3 text-xs font-bold text-slate-500 uppercase">Note /20</th>
                                            <th className="text-center p-3 text-xs font-bold text-slate-500 uppercase">Coef</th>
                                            <th className="text-center p-3 text-xs font-bold text-slate-500 uppercase">Points</th>
                                            <th className="text-left p-3 text-xs font-bold text-slate-500 uppercase">Professeur</th>
                                            <th className="text-center p-3 text-xs font-bold text-slate-500 uppercase">Appréciation</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {grades.map((grade, idx) => (
                                            <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                                                <td className="p-3 font-bold text-slate-900">{grade.subject}</td>
                                                <td className="p-3 text-center">
                                                    <span className={cn("px-3 py-1.5 rounded-lg font-black text-lg", getGradeColor(grade.grade))}>
                                                        {grade.grade.toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-center font-bold text-slate-600">{grade.coef}</td>
                                                <td className="p-3 text-center font-bold text-primary-blue">{(grade.grade * grade.coef).toFixed(2)}</td>
                                                <td className="p-3 text-sm text-slate-600">{grade.teacher}</td>
                                                <td className="p-3 text-center">
                                                    {grade.grade >= 16 && <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold">Excellent</span>}
                                                    {grade.grade >= 14 && grade.grade < 16 && <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-bold">Très Bien</span>}
                                                    {grade.grade >= 12 && grade.grade < 14 && <span className="text-xs px-2 py-1 rounded-full bg-cyan-100 text-cyan-700 font-bold">Bien</span>}
                                                    {grade.grade >= 10 && grade.grade < 12 && <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-bold">Passable</span>}
                                                    {grade.grade < 10 && <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 font-bold">Insuffisant</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-slate-50 border-t-2 border-slate-200">
                                            <td className="p-3 font-black text-slate-900">TOTAL</td>
                                            <td className="p-3 text-center font-black text-primary-blue text-xl">{average}/20</td>
                                            <td className="p-3 text-center font-black text-slate-600">{totalCoefs}</td>
                                            <td className="p-3 text-center font-black text-primary-blue">{totalPoints.toFixed(2)}</td>
                                            <td colSpan={2}></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Appreciation */}
                    <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="p-4">
                            <p className="text-sm font-bold text-blue-900 mb-2">Observation du Conseil de Classe</p>
                            <p className="text-sm text-blue-800">
                                {parseFloat(average) >= 14
                                    ? "Excellent travail. Félicitations ! Continuez ainsi."
                                    : parseFloat(average) >= 12
                                        ? "Bon travail dans l'ensemble. Peut mieux faire dans certaines matières."
                                        : parseFloat(average) >= 10
                                            ? "Travail satisfaisant. Doit fournir plus d'efforts."
                                            : "Résultats insuffisants. Doit redoubler d'efforts et se faire aider."}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Footer */}
                <div className="border-t p-4 bg-slate-50 flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Fermer</Button>
                    <Button className="bg-primary-blue">
                        Imprimer le Bulletin
                    </Button>
                </div>
            </div>
        </div>
    );
}
