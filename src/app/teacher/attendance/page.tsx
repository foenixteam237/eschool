"use client";

import { useRouter } from "next/navigation";
import { Users, GraduationCap, ArrowRight, BookOpen, Clock, CalendarDays, CheckCircle2, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


export default function TeacherAttendanceDashboard() {
    const router = useRouter();

    const classes = [
        { id: "1", name: "6ème A", subject: "Mathématiques", students: 42, attendanceRate: 98, lastSession: "Aujourd'hui" },
        { id: "2", name: "3ème B", subject: "Physique", students: 38, attendanceRate: 92, lastSession: "Hier" },
        { id: "3", name: "Terminale S", subject: "Mathématiques", students: 35, attendanceRate: 88, lastSession: "Lundi" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestion des Présences</h1>
                <p className="text-slate-500">Suivez l'assiduité de vos élèves et gérez les appels quotidiens.</p>
            </div>

            {/* Global Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-slate-900 text-white border-none shadow-xl shadow-slate-200">
                    <CardContent className="p-6 relative overflow-hidden">
                        <div className="absolute right-[-20px] top-[-20px] opacity-10">
                            <Clock size={120} />
                        </div>
                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Taux de présence Moyen</p>
                        <h3 className="text-4xl font-black mt-2">94%</h3>
                        <p className="text-emerald-400 text-xs mt-2 font-bold flex items-center gap-1">
                            <CheckCircle2 size={14} /> Excellent cette semaine
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:border-primary-blue/30 transition-all cursor-pointer group" onClick={() => router.push('/teacher/attendance/mark?classId=1')}>
                    <CardContent className="p-6 flex flex-col justify-between h-full">
                        <div>
                            <div className="w-12 h-12 rounded-full bg-primary-blue/10 text-primary-blue flex items-center justify-center mb-4 group-hover:bg-primary-blue group-hover:text-white transition-colors">
                                <CheckCircle2 size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Appel Rapide</h3>
                            <p className="text-sm text-slate-500 mt-1">Votre prochain cours commence dans 15 min avec la <span className="font-bold text-slate-800">6ème A</span>.</p>
                        </div>
                        <Button className="w-full mt-4 bg-primary-blue hover:bg-blue-700">Commençer l'appel</Button>
                    </CardContent>
                </Card>

                <Card className="hover:border-primary-blue/30 transition-all cursor-pointer">
                    <CardContent className="p-6 flex flex-col justify-between h-full">
                        <div>
                            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                                <History size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Historique Complète</h3>
                            <p className="text-sm text-slate-500 mt-1">Consultez les registres passés ou rectifiez une erreur d'appel.</p>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full mt-4 hover:bg-slate-50"
                            onClick={() => router.push('/teacher/attendance/history')}
                        >
                            Consulter
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Classes List */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Users size={20} className="text-primary-blue" /> Mes Classes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((cls) => (
                        <Card key={cls.id} className="group hover:shadow-lg hover:border-primary-blue/40 transition-all">
                            <CardHeader className="pb-3 border-b border-slate-50">
                                <div className="flex justify-between items-start">
                                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-full tracking-wide">
                                        {cls.subject}
                                    </span>
                                    <span className={cls.attendanceRate > 90 ? "text-emerald-600 font-bold text-xs" : "text-amber-600 font-bold text-xs"}>
                                        {cls.attendanceRate}% Présence
                                    </span>
                                </div>
                                <CardTitle className="text-xl mt-3">{cls.name}</CardTitle>
                                <CardDescription className="flex items-center gap-2 text-xs font-medium">
                                    <Users size={14} /> {cls.students} Élèves
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-3">
                                <div className="flex items-center justify-between text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
                                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
                                        <CalendarDays size={14} /> Dernier Appel
                                    </span>
                                    <span className="font-bold text-slate-900">{cls.lastSession}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <Button
                                        onClick={() => router.push(`/teacher/attendance/mark?classId=${cls.id}`)}
                                        className="w-full bg-slate-900 hover:bg-primary-blue text-white shadow-lg shadow-slate-200"
                                    >
                                        Faire l'appel
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full border-slate-200 text-slate-600 hover:bg-slate-50"
                                        onClick={() => router.push('/teacher/attendance/history')}
                                    >
                                        Historique
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
