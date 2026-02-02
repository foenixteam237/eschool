"use client";

import {
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    Plus,
    ChevronLeft,
    ChevronRight,
    Filter,
    Download,
    Users
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminTimetablePage() {
    const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const timeSlots = [
        { label: "08h - 09h", start: 8 },
        { label: "09h - 10h", start: 9 },
        { label: "10h - 11h", start: 10 },
        { label: "11h - 12h", start: 11 },
        { label: "12h - 13h", start: 12 },
        { label: "13h - 14h", start: 13 },
        { label: "14h - 15h", start: 14 },
        { label: "15h - 16h", start: 15 },
    ];

    // Mock data for courses
    const courses = [
        { id: 1, day: "Lundi", startHour: 8, duration: 2, subject: "Mathématiques", teacher: "M. DUPONT", room: "102", color: "blue" },
        { id: 2, day: "Lundi", startHour: 10, duration: 2, subject: "Anglais", teacher: "Mme SMITH", room: "204", color: "emerald" },
        { id: 3, day: "Mardi", startHour: 8, duration: 2, subject: "Physique", teacher: "M. TCHAPTCHET", room: "Labo 1", color: "amber" },
        { id: 4, day: "Mardi", startHour: 14, duration: 2, subject: "SVT", teacher: "Mme LEFEBVRE", room: "Labo A", color: "emerald" },
        { id: 5, day: "Mercredi", startHour: 8, duration: 2, subject: "Français", teacher: "M. MBIIDA", room: "102", color: "purple" },
        { id: 6, day: "Mercredi", startHour: 10, duration: 2, subject: "EPS", teacher: "M. ZIDANE", room: "Stade", color: "orange" },
        { id: 7, day: "Jeudi", startHour: 8, duration: 3, subject: "Informatique", teacher: "M. TEGUIA", room: "Salle Info", color: "indigo" },
        { id: 8, day: "Vendredi", startHour: 10, duration: 2, subject: "Histoire-Géo", teacher: "Mme NOAH", room: "102", color: "rose" },
    ];

    const getCourseForSlot = (day: string, hour: number) => {
        return courses.find(c => c.day === day && c.startHour === hour);
    };

    const isSlotOccupied = (day: string, hour: number) => {
        return courses.some(c => c.day === day && hour > c.startHour && hour < c.startHour + c.duration);
    };

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-12 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Emplois du Temps</h1>
                    <p className="text-slate-500">Planification hebdomadaire des cours</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Download size={18} /> Exporter PDF
                    </Button>
                    <Button className="flex items-center gap-2 bg-primary-blue shadow-lg shadow-blue-200 hover:scale-105 transition-all">
                        <Plus size={18} /> Nouvelle Séance
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 border-b border-slate-100 bg-white p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full xl:w-auto">
                        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg w-full sm:w-auto justify-between sm:justify-start">
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white hover:shadow-sm transition-all"><ChevronLeft size={16} /></Button>
                            <span className="text-sm font-bold text-slate-600 px-2 whitespace-nowrap">Semaine du 12 Jan</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white hover:shadow-sm transition-all"><ChevronRight size={16} /></Button>
                        </div>
                        <div className="h-8 w-px bg-slate-200 hidden sm:block" />
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-primary-blue flex items-center justify-center shrink-0">
                                <Users size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Classe sélectionnée</p>
                                <h2 className="text-lg font-black text-slate-900">6ème A</h2>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 w-full xl:w-auto">
                        <select className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium outline-none focus:ring-1 focus:ring-primary-blue cursor-pointer hover:border-primary-blue/50 transition-colors flex-1 sm:flex-none min-w-[120px]">
                            <option>6ème A</option>
                            <option>5ème B</option>
                            <option>Tle D</option>
                        </select>
                        <Button variant="outline" size="sm" className="flex items-center gap-2 text-xs font-bold bg-slate-50 flex-1 sm:flex-none justify-center">
                            <Filter size={14} /> Filtres
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-xs font-bold text-primary-blue bg-blue-50 flex-1 sm:flex-none justify-center">
                            <CalendarIcon size={14} /> Aujourd'hui
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <div className="min-w-[1000px]">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="w-20 bg-slate-50/80 p-4 border-b border-r border-slate-100 sticky left-0 z-10 backdrop-blur-sm"></th>
                                    {days.map(day => (
                                        <th key={day} className="p-4 border-b border-r border-slate-100 bg-slate-50/50 text-slate-500 font-bold text-xs uppercase tracking-wider text-center w-[14%]">
                                            {day}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {timeSlots.map((slot) => (
                                    <tr key={slot.label} className="group">
                                        <td className="p-3 border-r border-b border-slate-100 bg-slate-50/30 text-[10px] font-bold text-slate-400 text-center sticky left-0 z-10 backdrop-blur-sm group-hover:bg-slate-50 transition-colors">
                                            {slot.label}
                                        </td>
                                        {days.map((day) => {
                                            const course = getCourseForSlot(day, slot.start);
                                            const occupied = isSlotOccupied(day, slot.start);

                                            if (occupied) return null; // Slot covered by spanning cell

                                            return (
                                                <td
                                                    key={`${day}-${slot.start}`}
                                                    className="p-1 border-r border-b border-slate-100 align-top h-24 relative hover:bg-slate-50/30 transition-colors"
                                                    rowSpan={course ? course.duration : 1}
                                                >
                                                    {course ? (
                                                        <div className={cn(
                                                            "h-full w-full rounded-lg p-3 shadow-sm border-l-4 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between",
                                                            course.color === 'blue' ? "bg-blue-50 border-blue-500 text-blue-900" :
                                                                course.color === 'emerald' ? "bg-emerald-50 border-emerald-500 text-emerald-900" :
                                                                    course.color === 'amber' ? "bg-amber-50 border-amber-500 text-amber-900" :
                                                                        course.color === 'purple' ? "bg-purple-50 border-purple-500 text-purple-900" :
                                                                            course.color === 'rose' ? "bg-rose-50 border-rose-500 text-rose-900" :
                                                                                course.color === 'indigo' ? "bg-indigo-50 border-indigo-500 text-indigo-900" :
                                                                                    "bg-orange-50 border-orange-500 text-orange-900"
                                                        )}>
                                                            <div className="flex justify-between items-start">
                                                                <span className="text-xs font-black uppercase tracking-tight opacity-70">{course.room}</span>
                                                                <Button variant="ghost" size="icon" className="h-4 w-4 -mr-1 -mt-1 opacity-0 group-hover:opacity-50 hover:!opacity-100">
                                                                    <div className="w-1 h-1 rounded-full bg-current" />
                                                                    <div className="w-1 h-1 rounded-full bg-current mx-0.5" />
                                                                    <div className="w-1 h-1 rounded-full bg-current" />
                                                                </Button>
                                                            </div>
                                                            <div>
                                                                <p className="font-extrabold text-sm leading-tight mb-1">{course.subject}</p>
                                                                <div className="flex items-center gap-1 text-[10px] font-bold opacity-80">
                                                                    <Users size={10} /> {course.teacher}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-full group-hover:bg-slate-50/50 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-300 hover:text-primary-blue hover:bg-blue-50 rounded-full">
                                                                <Plus size={14} />
                                                            </Button>
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
