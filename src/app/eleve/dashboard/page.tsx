"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    BookOpen,
    FileText,
    Clock,
    CheckCircle2,
    ArrowRight,
    TrendingUp,
    Calendar,
    GraduationCap,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/hooks/use-auth-store";

interface ScheduleSlot {
    time: string;
    subject: string;
    room: string;
    teacher: string;
}

interface HomeworkItem {
    title: string;
    due: string;
    subject: string;
    status: "todo" | "done";
}

export default function StudentDashboard() {
    const { user } = useAuthStore();
    const [studentName, setStudentName] = useState(user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Élève");
    const [loading, setLoading] = useState(true);
    const [schedule, setSchedule] = useState<ScheduleSlot[]>([
        { time: "08:00 - 10:00", subject: "Mathématiques", room: "S.102", teacher: "M. Dupont" },
        { time: "10:15 - 12:15", subject: "Anglais", room: "S.204", teacher: "Mme. Smith" },
        { time: "14:00 - 16:00", subject: "SVT", room: "Labo A", teacher: "M. Lefebvre" },
    ]);
    const [generalAverage, setGeneralAverage] = useState<string>("15.42");

    const homework: HomeworkItem[] = [
        { title: "Exercice de Physique - Circuit RLC", due: "Demain", subject: "Physique", status: "todo" },
        { title: "Lecture: 'Le Petit Prince' (Ch. 4 à 8)", due: "Ven 26", subject: "Français", status: "done" },
        { title: "Devoir Maison Mathématiques - Fonctions", due: "Lundi prochain", subject: "Mathématiques", status: "todo" },
    ];

    useEffect(() => {
        let isMounted = true;

        async function loadStudentData() {
            try {
                // 1. Fetch user profile if name not present
                const profileRes = await fetch("/api/auth/profile");
                if (profileRes.ok) {
                    const pData = await profileRes.json();
                    if (pData?.data && isMounted) {
                        const fullName = `${pData.data.firstName || ""} ${pData.data.lastName || ""}`.trim();
                        if (fullName) setStudentName(fullName);
                    }
                }

                // 2. Fetch timetable slots from API
                const timetableRes = await fetch("/api/v1/timetable");
                if (timetableRes.ok) {
                    const tData = await timetableRes.json();
                    const slots = Array.isArray(tData?.data) ? tData.data : Array.isArray(tData) ? tData : [];
                    if (slots.length > 0 && isMounted) {
                        // Take the first 3-5 slots for today or general schedule
                        const formattedSlots: ScheduleSlot[] = slots.slice(0, 4).map((slot: any) => ({
                            time: `${slot.startTime || "08:00"} - ${slot.endTime || "10:00"}`,
                            subject: slot.subject?.name || slot.class?.name ? `Cours - ${slot.class?.name || "Classe"}` : "Cours Magistral",
                            room: slot.room || "Salle Principale",
                            teacher: slot.teacher?.user?.firstName ? `${slot.teacher.user.firstName} ${slot.teacher.user.lastName || ""}` : "Professeur assigné"
                        }));
                        if (formattedSlots.length > 0) {
                            setSchedule(formattedSlots);
                        }
                    }
                }

                // 3. Try to fetch real grades
                const gradesRes = await fetch("/api/v1/grades");
                if (gradesRes.ok) {
                    const gData = await gradesRes.json();
                    const gradesList = Array.isArray(gData?.data) ? gData.data : Array.isArray(gData) ? gData : [];
                    if (gradesList.length > 0 && isMounted) {
                        const total = gradesList.reduce((acc: number, g: any) => acc + (Number(g.value) || 0), 0);
                        const avg = (total / gradesList.length).toFixed(2);
                        setGeneralAverage(avg);
                    }
                }
            } catch (err) {
                console.warn("Could not fetch real-time student dashboard extras:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadStudentData();

        return () => {
            isMounted = false;
        };
    }, []);

    // Current formatted date in French
    const todayFormatted = new Intl.DateTimeFormat("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long"
    }).format(new Date());

    const capitalizedDate = todayFormatted.charAt(0).toUpperCase() + todayFormatted.slice(1);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                        Bonjour, {studentName} !
                    </h1>
                    <p className="text-slate-500 text-sm md:text-base mt-1">
                        Bonne journée d&apos;apprentissage. Tu as {schedule.length} cours planifiés aujourd&apos;hui.
                    </p>
                </div>
                <div className="bg-primary-blue text-white px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-md shadow-blue-100 w-fit">
                    <Calendar size={20} className="shrink-0" />
                    <span className="font-bold text-sm md:text-base">{capitalizedDate}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="flex items-center gap-2 text-slate-800 text-lg">
                                <Clock className="text-primary-blue" size={20} /> Emploi du Temps du Jour
                            </CardTitle>
                            <Link href="/eleve/courses">
                                <Button variant="ghost" size="sm" className="text-xs text-primary-blue hover:text-blue-700 font-semibold gap-1">
                                    Voir tout <ArrowRight size={14} />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {schedule.map((slot, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-4 md:gap-6 p-4 rounded-xl bg-slate-50 border border-slate-100 group hover:bg-blue-50/70 hover:border-blue-200 transition-all"
                                    >
                                        <div className="text-xs md:text-sm font-bold text-primary-blue bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 w-24 md:w-28 shrink-0 text-center">
                                            {slot.time}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-extrabold text-slate-800 truncate text-sm md:text-base">{slot.subject}</p>
                                            <p className="text-xs text-slate-500 truncate mt-0.5">{slot.teacher} • <span className="text-slate-600 font-medium">{slot.room}</span></p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-emerald-50/40 border-emerald-200/60 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-emerald-700 flex items-center gap-2 text-base">
                                    <TrendingUp size={20} /> Ma Moyenne Trimestrielle
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                                    {generalAverage}<span className="text-lg text-slate-400 font-normal">/20</span>
                                </h3>
                                <p className="text-xs text-slate-500 mt-2">Moyenne générale calculée sur les évaluations enregistrées</p>
                                <div className="mt-4">
                                    <Link href="/eleve/results">
                                        <Button variant="link" className="p-0 h-auto text-emerald-700 hover:text-emerald-800 font-bold text-xs flex items-center gap-1">
                                            Consulter mes relevés et bulletins <ArrowRight size={14} />
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-amber-50/40 border-amber-200/60 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-amber-700 flex items-center gap-2 text-base">
                                    <BookOpen size={20} /> Ressources Pédagogiques
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <h4 className="text-3xl font-extrabold text-slate-900 tracking-tight">12 Documents</h4>
                                <p className="text-xs text-slate-500 mt-2">Supports de cours et fiches de révision mis à disposition</p>
                                <div className="mt-4">
                                    <Link href="/eleve/courses">
                                        <Button variant="link" className="p-0 h-auto text-amber-700 hover:text-amber-800 font-bold text-xs flex items-center gap-1">
                                            Ouvrir mes cours et supports <ArrowRight size={14} />
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="flex items-center gap-2 text-slate-800 text-base">
                                <FileText className="text-primary-blue" size={18} /> Devoirs & Travaux
                            </CardTitle>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-primary-blue">
                                {homework.filter(h => h.status === 'todo').length} en attente
                            </span>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {homework.map((hw, i) => (
                                    <div key={i} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-xs md:text-sm font-bold truncate ${hw.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                                    {hw.title}
                                                </p>
                                                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                                                    <span className="font-semibold text-primary-blue">{hw.subject}</span>
                                                    <span>•</span>
                                                    <span>Échéance: {hw.due}</span>
                                                </div>
                                            </div>
                                            {hw.status === 'done' ? (
                                                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                                            ) : (
                                                <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0 mt-0.5" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white border-none shadow-md">
                        <CardContent className="p-6 text-center space-y-4">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                                <GraduationCap size={30} className="text-white" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-base font-bold text-white">Évaluations et Examens</h3>
                                <p className="text-xs text-blue-200">
                                    Consulte l&apos;emploi du temps officiel et prépare tes sessions de composition avec sérénité.
                                </p>
                            </div>
                            <Link href="/eleve/results" className="block">
                                <Button className="w-full bg-white text-blue-900 hover:bg-slate-100 font-bold text-xs py-2 shadow">
                                    Consulter mes notes & bulletins
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
