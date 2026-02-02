"use client";

import { Users, BookOpen, GraduationCap, Clock, ChevronRight, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResultsModal } from "@/components/shared/results-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function ParentChildrenTrackingPage() {
    const children = [
        {
            name: "KAMGA Jean",
            class: "3ème B",
            attendance: "98%",
            average: "14.5",
            rank: "5ème",
            lastExam: "Maths: 16/20",
            teachers: ["M. DUPONT", "M. LEFEBVRE"]
        },
        {
            name: "KAMGA Marie",
            class: "6ème A",
            attendance: "100%",
            average: "16.8",
            rank: "2ème",
            lastExam: "SVT: 18/20",
            teachers: ["M. DUPONT", "Mme. SMITH"]
        },
    ];

    const [selectedStudent, setSelectedStudent] = useState<{ name: string; class: string } | null>(null);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Suivi de mes Enfants</h1>
                <p className="text-slate-500">Consultez en détail les performances académiques et la discipline.</p>
            </div>

            <div className="space-y-12">
                {children.map((child, i) => (
                    <div key={i} className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary-blue text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-100 italic">
                                {child.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">{child.name}</h2>
                                <p className="text-sm font-bold text-primary-blue uppercase tracking-widest">{child.class}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <StatsCard label="Moyenne" value={child.average} sub="/20" icon={<TrendingUp size={18} />} color="text-primary-blue" bg="bg-blue-50" />
                            <StatsCard label="Rang Class" value={child.rank} icon={<GraduationCap size={18} />} color="text-amber-600" bg="bg-amber-50" />
                            <StatsCard label="Présence" value={child.attendance} icon={<Clock size={18} />} color="text-emerald-600" bg="bg-emerald-50" />
                            <StatsCard label="Dernier Exam" value={child.lastExam} icon={<BookOpen size={18} />} color="text-purple-600" bg="bg-purple-50" />
                        </div>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Dernières Notes & Évaluations</CardTitle>
                                    <CardDescription>Visualisez les progrès récents par matière.</CardDescription>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedStudent({ name: child.name, class: child.class })}
                                >
                                    Bulletin Complet
                                </Button>
                                {/* <Button variant="outline" size="sm">Bulletin Complet</Button> */}
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((_, j) => (
                                        <div key={j} className="flex items-center justify-between p-4 rounded-xl border border-slate-50 hover:bg-slate-50/50 group transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-2 bg-primary-blue h-10 rounded-full" />
                                                <div>
                                                    <p className="font-bold text-slate-800">Interrogation de Français</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">22 Déc 2025 • Coef: 2</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-black text-slate-900">14.5<span className="text-xs text-slate-400">/20</span></p>
                                                <p className="text-[10px] font-bold text-emerald-600 uppercase">Bien</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>

            {selectedStudent && (
                <ResultsModal
                    isOpen={!!selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                    studentName={selectedStudent.name}
                    studentClass={selectedStudent.class}
                />
            )}
        </div>
    );
}

function StatsCard({ label, value, sub, icon, color, bg }: any) {
    return (
        <Card className="border-none shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
                <div className={cn("p-3 rounded-xl", bg, color)}>{icon}</div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                    <h4 className="text-xl font-black text-slate-900">
                        {value}{sub && <span className="text-xs text-slate-400">{sub}</span>}
                    </h4>
                </div>
            </CardContent>
        </Card>
    );
}

