"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";

import { useSearchParams, useRouter } from "next/navigation";
import {
    ChevronLeft,
    Calendar,
    Printer,
    Download,
    Clock,
    MapPin,
    BookOpen,
    Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function TeacherTimetablePageInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const teacherId = searchParams.get("id");

    const teacherName = teacherId === "1" ? "Jean DUPONT" : "Marie SMITH";
    const userRole = "Enseignant";

    const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
    const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

    // Mock Schedule Data
    const schedule = [
        { id: 1, day: "Lundi", start: "08:00", end: "10:00", subject: "Mathématiques", class: "6ème A", room: "Salle 101", color: "bg-blue-100 text-blue-700 border-blue-200" },
        { id: 2, day: "Lundi", start: "14:00", end: "16:00", subject: "Mathématiques", class: "3ème B", room: "Salle 204", color: "bg-blue-100 text-blue-700 border-blue-200" },
        { id: 3, day: "Mardi", start: "10:00", end: "12:00", subject: "Physique", class: "Tle C", room: "Labo 2", color: "bg-purple-100 text-purple-700 border-purple-200" },
        { id: 4, day: "Jeudi", start: "08:00", end: "10:00", subject: "Mathématiques", class: "6ème A", room: "Salle 101", color: "bg-blue-100 text-blue-700 border-blue-200" },
        { id: 5, day: "Vendredi", start: "08:00", end: "11:00", subject: "Physique", class: "Tle C", room: "Labo 2", color: "bg-purple-100 text-purple-700 border-purple-200" },
    ];

    const getEventStyle = (start: string, end: string) => {
        const startHour = parseInt(start.split(":")[0]);
        const endHour = parseInt(end.split(":")[0]);
        const duration = endHour - startHour;
        const topOffset = (startHour - 8) * 64; // 64px per hour height
        const height = duration * 64;

        return {
            top: `${topOffset}px`,
            height: `${height}px`
        };
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-slate-500 hover:text-primary-blue bg-white shadow-sm border border-slate-100 rounded-xl"
                        onClick={() => router.back()}
                    >
                        <ChevronLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Emploi du Temps</h1>
                        <p className="text-slate-500 text-sm flex items-center gap-2">
                            <Users size={14} className="text-primary-blue" />
                            {teacherName} <span className="w-1 h-1 rounded-full bg-slate-300 mx-1" /> {userRole}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2 border-slate-200" onClick={() => window.print()}>
                        <Printer size={18} /> Imprimer
                    </Button>
                    <Button className="flex items-center gap-2 bg-slate-900 text-white shadow-lg shadow-slate-200">
                        <Download size={18} /> Exporter PDF
                    </Button>
                </div>
            </div>

            {/* Timetable Grid */}
            <Card className="border-none shadow-sm overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2 text-slate-700">
                            <Calendar className="text-primary-blue" size={20} />
                            Semaine en cours
                        </CardTitle>
                        <div className="text-xs font-black uppercase tracking-widest text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                            2025 - 2026
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <div className="min-w-[800px] grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] border-b border-slate-100 bg-slate-50/30">
                        <div className="p-4 border-r border-slate-100 bg-slate-50" /> {/* Corner */}
                        {days.map(day => (
                            <div key={day} className="p-4 text-center text-sm font-black uppercase tracking-widest text-slate-600 border-r border-slate-100 last:border-none">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="min-w-[800px] relative grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] bg-white">
                        {/* Time Column */}
                        <div className="border-r border-slate-100 bg-slate-50/30">
                            {hours.map((hour, i) => (
                                <div key={hour} className="h-16 border-b border-slate-100 text-xs font-bold text-slate-400 flex items-start justify-center pt-2 relative">
                                    {hour}
                                    {/* Dotted line across grid */}
                                    <div className="absolute left-full top-0 w-full border-t border-dashed border-slate-100 pointer-events-none z-0 opacity-50" style={{ width: "calc(100vw)" }} />
                                </div>
                            ))}
                        </div>

                        {/* Days Columns */}
                        {days.map((day) => (
                            <div key={day} className="relative border-r border-slate-100 last:border-none h-[576px]">
                                {hours.map((_, i) => (
                                    <div key={i} className="h-16 border-b border-slate-50" />
                                ))}

                                {/* Events */}
                                {schedule.filter(evt => evt.day === day).map(evt => (
                                    <div
                                        key={evt.id}
                                        className={cn(
                                            "absolute left-1 right-1 rounded-xl border p-2 flex flex-col justify-between shadow-sm cursor-pointer hover:brightness-95 transition-all group z-10",
                                            evt.color
                                        )}
                                        style={getEventStyle(evt.start, evt.end)}
                                    >
                                        <div>
                                            <p className="font-black text-xs md:text-sm line-clamp-1">{evt.subject}</p>
                                            <p className="text-[10px] font-bold opacity-80 uppercase tracking-wide">{evt.class}</p>
                                        </div>
                                        <div className="flex items-end justify-between">
                                            <div className="flex items-center gap-1 text-[10px] font-bold opacity-70 bg-white/40 px-1.5 py-0.5 rounded-md w-fit">
                                                <MapPin size={10} /> {evt.room}
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] font-bold opacity-70">
                                                <Clock size={10} /> {evt.start}-{evt.end}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function TeacherTimetablePage() {
    return (
        <Suspense fallback={<div className="p-8 text-slate-500">Chargement…</div>}>
            <TeacherTimetablePageInner />
        </Suspense>
    );
}
