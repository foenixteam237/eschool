"use client";

import {
    BookOpen,
    FileText,
    Clock,
    CheckCircle2,
    ArrowRight,
    TrendingUp,
    Calendar,
    GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StudentDashboard() {
    const schedule = [
        { time: "08:00 - 10:00", subject: "Mathématiques", room: "S.102", teacher: "M. Dupont" },
        { time: "10:15 - 12:15", subject: "Anglais", room: "S.204", teacher: "Mme. Smith" },
        { time: "14:00 - 16:00", subject: "SVT", room: "Labo A", teacher: "M. Lefebvre" },
    ];

    const homework = [
        { title: "Exercice de Physique", due: "Demain", subject: "Physique", status: "todo" },
        { title: "Lecture: 'Le Petit Prince'", due: "Ven 26", subject: "Français", status: "done" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Bonjour, Marie !</h1>
                    <p className="text-slate-500">Bonne journée d'apprentissage. Tu as 3 cours aujourd'hui.</p>
                </div>
                <div className="bg-primary-blue text-white px-4 py-2 rounded-lg flex items-center gap-3 shadow-md shadow-blue-100">
                    <Calendar size={20} />
                    <span className="font-bold">Mardi, 23 Décembre</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="text-primary-blue" /> Emploi du Temps du Jour
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {schedule.map((slot, i) => (
                                    <div key={i} className="flex items-center gap-6 p-4 rounded-xl bg-slate-50 border border-slate-100 group hover:bg-blue-50 hover:border-blue-100 transition-all">
                                        <div className="text-sm font-bold text-slate-400 w-24">{slot.time}</div>
                                        <div className="flex-1">
                                            <p className="font-extrabold text-slate-800">{slot.subject}</p>
                                            <p className="text-xs text-slate-500">{slot.teacher} • {slot.room}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="group-hover:text-primary-blue">
                                            <ArrowRight size={18} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-success-green/5 border-success-green/20">
                            <CardHeader>
                                <CardTitle className="text-success-green flex items-center gap-2">
                                    <TrendingUp size={20} /> Ma Moyenne
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <h3 className="text-4xl font-extrabold text-slate-900">15.42<span className="text-lg text-slate-400">/20</span></h3>
                                <p className="text-sm text-slate-500 mt-2">Moyenne générale trimestre 1</p>
                                <Button variant="link" className="p-0 h-auto mt-4 text-success-green font-bold">Voir tous les résultats</Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-alert-orange/5 border-alert-orange/20">
                            <CardHeader>
                                <CardTitle className="text-alert-orange flex items-center gap-2">
                                    <BookOpen size={20} /> Ressources
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <h4 className="text-xl font-bold">12 Documents</h4>
                                <p className="text-sm text-slate-500 mt-2">Nouveaux cours partagés cette semaine</p>
                                <Button variant="link" className="p-0 h-auto mt-4 text-alert-orange font-bold">Ouvrir ma bibliothèque</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="text-primary-blue" /> Devoirs à Rendre
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {homework.map((hw, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className={`text-sm font-bold ${hw.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{hw.title}</p>
                                                <p className="text-[10px] text-slate-500">{hw.subject} • Échéance: {hw.due}</p>
                                            </div>
                                            {hw.status === 'done' ? (
                                                <CheckCircle2 size={18} className="text-success-green" />
                                            ) : (
                                                <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button className="w-full mt-6" variant="outline">Tous les devoirs</Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-blue-900 text-white border-none">
                        <CardContent className="p-6 text-center space-y-4">
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                                <GraduationCap size={32} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold">Prep Examen</h3>
                                <p className="text-xs text-white/70">Les compositions commencent dans 12 jours. Révise bien !</p>
                            </div>
                            <Button className="w-full bg-white text-blue-900 border-none hover:bg-slate-100 font-bold">
                                Planning Examen
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
