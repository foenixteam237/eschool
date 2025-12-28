"use client";

import { TrendingUp, Award, ChevronRight, FileDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StudentResultsViewProps {
    studentName?: string;
    studentClass?: string;
    hideHeader?: boolean;
}

export function StudentResultsView({ studentName, studentClass, hideHeader = false }: StudentResultsViewProps) {
    const results = [
        { subject: "Mathématiques", coef: 5, average: 14.5, rank: "5ème/42", trend: "up" },
        { subject: "Français", coef: 4, average: 12.0, rank: "12ème/42", trend: "stable" },
        { subject: "Physique-Chimie", coef: 3, average: 16.5, rank: "2ème/42", trend: "up" },
        { subject: "Histoire-Géo", coef: 2, average: 11.0, rank: "20ème/42", trend: "down" },
        { subject: "Anglais", coef: 3, average: 15.0, rank: "8ème/42", trend: "up" },
    ];

    return (
        <div className="space-y-6">
            {!hideHeader && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Résultats Académiques</h1>
                        <p className="text-slate-500">{studentName || "Marie KAMGA"} • {studentClass || "3ème B"}</p>
                    </div>
                    <Button className="bg-primary-blue flex items-center gap-2">
                        <FileDown size={18} /> Télécharger Bulletin
                    </Button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-blue-50 border-blue-100 shadow-none">
                    <CardContent className="p-6">
                        <p className="text-sm font-medium text-blue-600 uppercase tracking-wider font-bold text-[10px]">Moyenne Générale</p>
                        <h3 className="text-4xl font-extrabold text-blue-900">13.88</h3>
                        <div className="flex items-center gap-2 mt-2 text-xs font-bold text-emerald-600">
                            <TrendingUp size={14} /> +1.2 pts (vs Mi-trimestre)
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-emerald-50 border-emerald-100 shadow-none">
                    <CardContent className="p-6">
                        <p className="text-sm font-medium text-emerald-600 uppercase tracking-wider font-bold text-[10px]">Rang dans la classe</p>
                        <h3 className="text-4xl font-extrabold text-emerald-900">8ème <span className="text-lg text-emerald-600 italic">/ 42</span></h3>
                        <p className="text-xs text-emerald-700 mt-2 font-medium">Tableau d'Honneur atteint</p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 text-white border-none shadow-none">
                    <CardContent className="p-6">
                        <p className="text-sm font-medium text-slate-400 uppercase tracking-wider font-bold text-[10px]">Absences / Retards</p>
                        <h3 className="text-4xl font-extrabold">2 / 0</h3>
                        <p className="text-xs text-slate-400 mt-2 italic font-medium">Toutes les absences sont justifiées</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-slate-100 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50 border-b border-slate-100">
                    <CardTitle className="text-lg text-slate-800">Détails par Matière</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-slate-400 text-[10px] uppercase tracking-widest font-bold bg-slate-50/50">
                                    <th className="py-3 px-6 font-bold">Matière</th>
                                    <th className="py-3 px-4 font-bold text-center">Coef</th>
                                    <th className="py-3 px-4 font-bold text-center">Moyenne /20</th>
                                    <th className="py-3 px-4 font-bold text-center">Rang</th>
                                    <th className="py-3 px-4 font-bold text-center">Tendance</th>
                                    <th className="py-3 px-6 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {results.map((res, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-4 px-6 font-bold text-slate-800">{res.subject}</td>
                                        <td className="py-4 px-4 text-center text-slate-500 font-medium">{res.coef}</td>
                                        <td className="py-4 px-4 text-center">
                                            <span className={cn(
                                                "font-extrabold text-lg px-3 py-1 rounded-lg",
                                                res.average >= 12 ? 'text-emerald-600 bg-emerald-50' : 'text-slate-800 bg-slate-100'
                                            )}>
                                                {res.average.toFixed(1)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center text-slate-500 font-bold text-sm tracking-tight">{res.rank}</td>
                                        <td className="py-4 px-4 text-center">
                                            {res.trend === 'up' && <TrendingUp size={16} className="text-emerald-500 mx-auto" />}
                                            {res.trend === 'stable' && <span className="text-slate-300 font-extrabold mx-auto tracking-tighter">—</span>}
                                            {res.trend === 'down' && <TrendingUp size={16} className="text-red-500 rotate-180 mx-auto" />}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold text-primary-blue hover:bg-blue-50">
                                                DÉTAILS
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center gap-4 p-5 bg-amber-50 border border-amber-100 rounded-2xl shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Award className="text-amber-500" size={24} />
                </div>
                <div>
                    <p className="font-bold text-amber-900">Note de la Direction</p>
                    <p className="text-sm text-amber-800/80 leading-relaxed italic">
                        "Excellente progression ce trimestre. L'élève fait preuve de sérieux et d'assiduité dans les matières scientifiques."
                    </p>
                </div>
            </div>
        </div>
    );
}
