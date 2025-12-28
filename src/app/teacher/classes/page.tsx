"use client";

import { useRouter } from "next/navigation";
import { Users, GraduationCap, ArrowRight, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TeacherClassesPage() {
    const router = useRouter();

    const classes = [
        { id: "1", name: "6ème A", subject: "Mathématiques", students: 42, avg: 12.5 },
        { id: "2", name: "3ème B", subject: "Physique", students: 38, avg: 11.2 },
        { id: "3", name: "Terminale S", subject: "Mathématiques", students: 35, avg: 13.8 },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Mes Classes</h1>
                <p className="text-slate-500">Sélectionnez une classe pour gérer les notes et voir les statistiques.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {classes.map((cls) => (
                    <Card
                        key={cls.id}
                        className="group hover:border-primary-blue/50 hover:shadow-lg transition-all cursor-pointer overflow-hidden relative"
                        onClick={() => router.push(`/teacher/grades?classId=${cls.id}`)}
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <GraduationCap size={100} />
                        </div>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wide">
                                    <BookOpen size={12} /> {cls.subject}
                                </span>
                            </div>
                            <CardTitle className="text-2xl mt-4 text-slate-800">{cls.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2 text-slate-500">
                                        <Users size={16} /> Effectif
                                    </span>
                                    <span className="font-bold text-slate-900">{cls.students} Élèves</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Moyenne Classe</span>
                                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                        {cls.avg}/20
                                    </span>
                                </div>
                                <Button className="w-full mt-4 bg-slate-900 text-white hover:bg-primary-blue group-hover:shadow-md transition-all">
                                    Gérer les Notes <ArrowRight size={16} className="ml-2" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
