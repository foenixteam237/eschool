"use client";

import {
    Users,
    Clock,
    BookOpen,
    GraduationCap,
    FileText,
    Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TeacherDashboard() {
    const classes = [
        { name: "6ème A", students: 42, subject: "Mathématiques", nextSession: "Aujourd'hui, 14:00" },
        { name: "3ème B", students: 38, subject: "Physique", nextSession: "Demain, 08:30" },
        { name: "Terminale S", students: 35, subject: "Mathématiques", nextSession: "Mercredi, 10:00" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Bonjour, M. Dupont</h1>
                <p className="text-slate-500">Voici vos cours et activités pour aujourd'hui.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-primary-blue text-white overflow-hidden relative">
                    <div className="absolute right-[-20px] top-[-20px] opacity-10">
                        <Calendar size={120} />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-white/80 text-sm font-medium">Prochain Cours</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-2xl font-bold">Mathématiques - 6ème A</h3>
                        <p className="mt-2 flex items-center gap-2 text-white/90">
                            <Clock size={16} /> 14:00 - 16:00 (Salle 102)
                        </p>
                        <Link href="/teacher/attendance" className="w-full mt-4 block">
                            <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 text-white border-none">
                                Marquer les présences
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:border-primary-blue/30 transition-colors cursor-pointer group">
                    <Link href="/teacher/classes">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider group-hover:text-primary-blue transition-colors">Statistiques Trimestre</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-3xl font-bold">12.4/20</p>
                                    <p className="text-xs text-slate-500">Moyenne générale de vos classes</p>
                                </div>
                                <div className="text-success-green font-bold text-sm flex items-center gap-1">
                                    +0.5 pts
                                </div>
                            </div>
                        </CardContent>
                    </Link>
                </Card>

                <Card className="hover:border-primary-blue/30 transition-colors cursor-pointer group">
                    <Link href="/teacher/lesson-log">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider group-hover:text-primary-blue transition-colors">Cahier de Texte</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary-blue w-[85%]" />
                                </div>
                                <span className="font-bold">85%</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">12 séances à renseigner cette semaine</p>
                        </CardContent>
                    </Link>
                </Card>
            </div>

            <h2 className="text-xl font-bold text-slate-800">Mes Classes Assignées</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls, i) => (
                    <Card key={i} className="hover:border-primary-blue/30 transition-colors">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded"> {cls.subject} </span>
                                <Users size={18} className="text-slate-400" />
                            </div>
                            <CardTitle className="mt-2">{cls.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-slate-500 space-y-2">
                                <p className="flex items-center gap-2"><Users size={14} /> {cls.students} élèves</p>
                                <p className="flex items-center gap-2 font-medium text-slate-800"><Clock size={14} /> {cls.nextSession}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-6">
                                <Link href={`/teacher/grades?classId=${i + 1}`}>
                                    <Button variant="outline" size="sm" className="w-full text-xs">Notes</Button>
                                </Link>
                                <Link href="/teacher/lesson-log">
                                    <Button variant="outline" size="sm" className="w-full text-xs">Programme</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
