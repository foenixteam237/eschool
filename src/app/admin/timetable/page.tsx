"use client";

import { useState } from "react";
import {
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    Plus,
    ChevronLeft,
    ChevronRight,
    Filter,
    Download,
    Users,
    School,
    CheckCircle2,
    BookOpen
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CourseSession {
    id: number;
    day: "Lundi" | "Mardi" | "Mercredi" | "Jeudi" | "Vendredi";
    startHour: number; // 7, 8, 9, 10, 11, 13, 14
    duration: number; // in hours
    subject: string;
    teacher: string;
    room: string;
    color: "blue" | "emerald" | "amber" | "purple" | "indigo" | "rose" | "orange";
}

export default function AdminTimetablePage() {
    const days: ("Lundi" | "Mardi" | "Mercredi" | "Jeudi" | "Vendredi")[] = [
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi"
    ];

    const timeSlots = [
        { label: "07h30 - 08h25", start: 7 },
        { label: "08h25 - 09h20", start: 8 },
        { label: "09h20 - 10h15", start: 9 },
        { label: "10h15 - 10h30", isBreak: true, labelBreak: "PAUSE RÉCRÉATIVE" },
        { label: "10h30 - 11h25", start: 10 },
        { label: "11h25 - 12h20", start: 11 },
        { label: "12h20 - 13h00", isBreak: true, labelBreak: "PAUSE MÉRIDIENNE / DÉJEUNER" },
        { label: "13h00 - 13h55", start: 13 },
        { label: "13h55 - 14h50", start: 14 },
        { label: "14h50 - 15h40", start: 15 },
    ];

    const [selectedSchool, setSelectedSchool] = useState("Lycée Général Leclerc (Yaoundé)");
    const [selectedClass, setSelectedClass] = useState("Tle C");
    const [showNewModal, setShowNewModal] = useState(false);

    const [classTimetables, setClassTimetables] = useState<Record<string, CourseSession[]>>({
        "Tle C": [
            { id: 1, day: "Lundi", startHour: 7, duration: 2, subject: "Mathématiques", teacher: "M. DUPONT Jean", room: "Salle 102", color: "blue" },
            { id: 2, day: "Lundi", startHour: 9, duration: 1, subject: "Informatique", teacher: "Ing. TEGUIA Paul", room: "Labo Info 1", color: "indigo" },
            { id: 3, day: "Lundi", startHour: 10, duration: 2, subject: "Physique-Chimie", teacher: "M. TCHAPTCHET", room: "Labo Sciences", color: "amber" },
            { id: 4, day: "Lundi", startHour: 13, duration: 2, subject: "Philosophie", teacher: "M. ABESSOLO Pierre", room: "Salle 102", color: "purple" },

            { id: 5, day: "Mardi", startHour: 7, duration: 3, subject: "Physique-Chimie", teacher: "M. TCHAPTCHET", room: "Labo Sciences", color: "amber" },
            { id: 6, day: "Mardi", startHour: 10, duration: 2, subject: "Mathématiques", teacher: "M. DUPONT Jean", room: "Salle 102", color: "blue" },
            { id: 7, day: "Mardi", startHour: 13, duration: 2, subject: "Anglais", teacher: "Mme SMITH Marie", room: "Salle 102", color: "emerald" },

            { id: 8, day: "Mercredi", startHour: 7, duration: 2, subject: "SVT (Biologie)", teacher: "Mme LEFEBVRE", room: "Salle 102", color: "emerald" },
            { id: 9, day: "Mercredi", startHour: 9, duration: 1, subject: "Histoire-Géo", teacher: "Mme NOAH Brigitte", room: "Salle 102", color: "rose" },
            { id: 10, day: "Mercredi", startHour: 10, duration: 2, subject: "EPS (Sport)", teacher: "M. ZIDANE Patrick", room: "Plateau EPS", color: "orange" },

            { id: 11, day: "Jeudi", startHour: 7, duration: 2, subject: "Mathématiques", teacher: "M. DUPONT Jean", room: "Salle 102", color: "blue" },
            { id: 12, day: "Jeudi", startHour: 9, duration: 1, subject: "ECM (Éducation Civique)", teacher: "Mme MINKA Yvette", room: "Salle 102", color: "rose" },
            { id: 13, day: "Jeudi", startHour: 10, duration: 2, subject: "Informatique & Algo", teacher: "Ing. TEGUIA Paul", room: "Labo Info 1", color: "indigo" },
            { id: 14, day: "Jeudi", startHour: 13, duration: 2, subject: "Travaux Dirigés Maths", teacher: "M. DUPONT Jean", room: "Salle 102", color: "blue" },

            { id: 15, day: "Vendredi", startHour: 7, duration: 2, subject: "Philosophie", teacher: "M. ABESSOLO Pierre", room: "Salle 102", color: "purple" },
            { id: 16, day: "Vendredi", startHour: 9, duration: 1, subject: "Anglais", teacher: "Mme SMITH Marie", room: "Salle 102", color: "emerald" },
            { id: 17, day: "Vendredi", startHour: 10, duration: 2, subject: "Physique-Chimie", teacher: "M. TCHAPTCHET", room: "Labo Sciences", color: "amber" },
            { id: 18, day: "Vendredi", startHour: 13, duration: 2, subject: "Devoir Surveillé Hebdo", teacher: "Censeur / Surveillant", room: "Amphithéâtre", color: "purple" },
        ],
        "6ème A": [
            { id: 19, day: "Lundi", startHour: 7, duration: 2, subject: "Français", teacher: "Mme MVE Alice", room: "Salle 01", color: "purple" },
            { id: 20, day: "Lundi", startHour: 9, duration: 1, subject: "Anglais", teacher: "Mr. SMITH", room: "Salle 01", color: "emerald" },
            { id: 21, day: "Lundi", startHour: 10, duration: 2, subject: "Mathématiques", teacher: "M. TCHAPTCHET", room: "Salle 01", color: "blue" },
            { id: 22, day: "Mardi", startHour: 7, duration: 2, subject: "Mathématiques", teacher: "M. TCHAPTCHET", room: "Salle 01", color: "blue" },
            { id: 23, day: "Mardi", startHour: 10, duration: 2, subject: "Histoire-Géographie", teacher: "Mme NOAH", room: "Salle 01", color: "rose" },
            { id: 24, day: "Mercredi", startHour: 7, duration: 2, subject: "SVT", teacher: "Mme LEFEBVRE", room: "Salle 01", color: "emerald" },
            { id: 25, day: "Mercredi", startHour: 10, duration: 2, subject: "EPS", teacher: "M. ZIDANE", room: "Stade", color: "orange" },
            { id: 26, day: "Jeudi", startHour: 7, duration: 2, subject: "Informatique", teacher: "M. TEGUIA", room: "Salle Info", color: "indigo" },
            { id: 27, day: "Vendredi", startHour: 7, duration: 2, subject: "Français", teacher: "Mme MVE", room: "Salle 01", color: "purple" },
        ],
        "1ère D": [
            { id: 28, day: "Lundi", startHour: 7, duration: 2, subject: "Sciences de la Vie et Terre", teacher: "Mme LEFEBVRE", room: "Labo 2", color: "emerald" },
            { id: 29, day: "Lundi", startHour: 10, duration: 2, subject: "Mathématiques", teacher: "M. FOTSO Paul", room: "Salle 204", color: "blue" },
            { id: 30, day: "Mardi", startHour: 7, duration: 2, subject: "Physique-Chimie", teacher: "M. MBALLA Oscar", room: "Labo 1", color: "amber" },
            { id: 31, day: "Mercredi", startHour: 10, duration: 2, subject: "EPS", teacher: "M. ZIDANE", room: "Plateau", color: "orange" },
            { id: 32, day: "Jeudi", startHour: 7, duration: 2, subject: "Français & Littérature", teacher: "Mme BELLA", room: "Salle 204", color: "purple" },
            { id: 33, day: "Vendredi", startHour: 7, duration: 2, subject: "SVT TP", teacher: "Mme LEFEBVRE", room: "Labo 2", color: "emerald" },
        ]
    });

    const [newSession, setNewSession] = useState<Partial<CourseSession>>({
        day: "Lundi",
        startHour: 7,
        duration: 2,
        subject: "Mathématiques",
        teacher: "M. DUPONT Jean",
        room: "Salle 102",
        color: "blue",
    });

    const activeCourses = classTimetables[selectedClass] || classTimetables["Tle C"];

    const getCourseForSlot = (day: string, hour: number) => {
        return activeCourses.find((c) => c.day === day && c.startHour === hour);
    };

    const isSlotOccupied = (day: string, hour: number) => {
        return activeCourses.some((c) => c.day === day && hour > c.startHour && hour < c.startHour + c.duration);
    };

    const handleAddSession = (e: React.FormEvent) => {
        e.preventDefault();
        const session: CourseSession = {
            id: Date.now(),
            day: newSession.day as any,
            startHour: Number(newSession.startHour),
            duration: Number(newSession.duration),
            subject: newSession.subject || "Discipline",
            teacher: newSession.teacher || "Enseignant",
            room: newSession.room || "Salle de cours",
            color: newSession.color || "blue",
        };

        setClassTimetables((prev) => ({
            ...prev,
            [selectedClass]: [...(prev[selectedClass] || []), session],
        }));
        setShowNewModal(false);
    };

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-16 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <CalendarIcon className="text-primary-blue" size={32} />
                        Emplois du Temps Secondaires
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Planification des cours hebdomadaires conforme à la grille horaire MINESEC (07h30 - 15h40)
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2 border-slate-200">
                        <Download size={16} /> Exporter la Grille (PDF)
                    </Button>
                    <Button
                        onClick={() => setShowNewModal(true)}
                        className="bg-primary-blue hover:bg-blue-700 text-white font-bold gap-2 shadow-lg shadow-blue-100"
                    >
                        <Plus size={18} /> Programmer un Cours
                    </Button>
                </div>
            </div>

            {/* School & Class Selector */}
            <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary-blue flex items-center justify-center font-bold">
                            <School size={20} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Établissement & Classe</span>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-base font-black text-slate-900">{selectedClass}</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-xs text-slate-500 font-semibold">{selectedSchool}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        <select
                            value={selectedSchool}
                            onChange={(e) => setSelectedSchool(e.target.value)}
                            className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none cursor-pointer"
                        >
                            <option>Lycée Général Leclerc (Yaoundé)</option>
                            <option>Lycée Bilingue de Deido (Douala)</option>
                            <option>Collège Libermann (Douala)</option>
                            <option>Lycée Classique de Bafoussam</option>
                            <option>Lycée Technique de Douala-Koumassi</option>
                        </select>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="h-10 px-3 rounded-lg border border-primary-blue/30 bg-blue-50 text-xs font-black text-primary-blue outline-none cursor-pointer"
                        >
                            <option value="Tle C">Tle C (Maths & Phys)</option>
                            <option value="6ème A">6ème A (1er Cycle)</option>
                            <option value="1ère D">1ère D (Sciences Nat)</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Timetable Grid */}
            <Card className="border-none shadow-md overflow-hidden bg-white">
                <CardContent className="p-0 overflow-x-auto">
                    <div className="min-w-[1000px]">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="w-28 bg-slate-50/90 p-4 border-b border-r border-slate-100 sticky left-0 z-10 backdrop-blur-sm text-left text-[11px] font-black text-slate-400 uppercase">
                                        Horaires
                                    </th>
                                    {days.map((day) => (
                                        <th
                                            key={day}
                                            className="p-4 border-b border-r border-slate-100 bg-slate-50/60 text-slate-700 font-black text-xs uppercase tracking-wider text-center w-[18%]"
                                        >
                                            {day}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {timeSlots.map((slot, idx) => {
                                    if (slot.isBreak) {
                                        return (
                                            <tr key={idx} className="bg-amber-50/70">
                                                <td className="p-2 border-r border-b border-amber-200 text-center font-bold text-[10px] text-amber-700 sticky left-0 bg-amber-100/90">
                                                    {slot.label}
                                                </td>
                                                <td
                                                    colSpan={days.length}
                                                    className="p-2 border-b border-amber-200 text-center font-black text-[11px] uppercase tracking-widest text-amber-800"
                                                >
                                                    🔔 {slot.labelBreak} 🔔
                                                </td>
                                            </tr>
                                        );
                                    }

                                    return (
                                        <tr key={idx} className="group">
                                            <td className="p-3 border-r border-b border-slate-100 bg-slate-50/40 text-[11px] font-mono font-bold text-slate-500 text-center sticky left-0 z-10 backdrop-blur-sm group-hover:bg-slate-50">
                                                {slot.label}
                                            </td>
                                            {days.map((day) => {
                                                const course = getCourseForSlot(day, slot.start!);
                                                const occupied = isSlotOccupied(day, slot.start!);

                                                if (occupied) return null;

                                                return (
                                                    <td
                                                        key={`${day}-${slot.start}`}
                                                        className="p-1.5 border-r border-b border-slate-100 align-top h-24 relative hover:bg-slate-50/30 transition-colors"
                                                        rowSpan={course ? course.duration : 1}
                                                    >
                                                        {course ? (
                                                            <div
                                                                className={cn(
                                                                    "h-full w-full rounded-xl p-3 shadow-sm border-l-4 transition-all hover:shadow-md flex flex-col justify-between",
                                                                    course.color === "blue" ? "bg-blue-50/90 border-blue-600 text-blue-950" :
                                                                    course.color === "emerald" ? "bg-emerald-50/90 border-emerald-600 text-emerald-950" :
                                                                    course.color === "amber" ? "bg-amber-50/90 border-amber-600 text-amber-950" :
                                                                    course.color === "purple" ? "bg-purple-50/90 border-purple-600 text-purple-950" :
                                                                    course.color === "indigo" ? "bg-indigo-50/90 border-indigo-600 text-indigo-950" :
                                                                    course.color === "rose" ? "bg-rose-50/90 border-rose-600 text-rose-950" :
                                                                    "bg-orange-50/90 border-orange-600 text-orange-950"
                                                                )}
                                                            >
                                                                <div className="flex justify-between items-start">
                                                                    <span className="text-[10px] font-black uppercase tracking-wider opacity-70 bg-white/70 px-1.5 py-0.5 rounded">
                                                                        {course.room}
                                                                    </span>
                                                                    <span className="text-[10px] font-bold opacity-60">
                                                                        {course.duration}h
                                                                    </span>
                                                                </div>
                                                                <div className="my-1">
                                                                    <p className="font-black text-sm leading-tight">
                                                                        {course.subject}
                                                                    </p>
                                                                    <p className="text-[11px] font-semibold opacity-80 mt-1 flex items-center gap-1">
                                                                        <Users size={11} /> {course.teacher}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => {
                                                                        setNewSession({ ...newSession, day, startHour: slot.start });
                                                                        setShowNewModal(true);
                                                                    }}
                                                                    className="h-7 w-7 text-slate-300 hover:text-primary-blue rounded-full"
                                                                >
                                                                    <Plus size={14} />
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Modal Programmer un Cours */}
            {showNewModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="max-w-lg w-full bg-white shadow-2xl border-none">
                        <CardHeader className="bg-primary-blue text-white p-6">
                            <h2 className="text-xl font-black">Programmer une Séance de Cours</h2>
                            <p className="text-xs text-blue-100">Classe : {selectedClass} • {selectedSchool}</p>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleAddSession} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-600 uppercase">Discipline / Matière *</label>
                                    <Input
                                        placeholder="Ex: Mathématiques"
                                        required
                                        value={newSession.subject}
                                        onChange={(e) => setNewSession({ ...newSession, subject: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 uppercase">Enseignant</label>
                                        <Input
                                            placeholder="Ex: M. DUPONT Jean"
                                            value={newSession.teacher}
                                            onChange={(e) => setNewSession({ ...newSession, teacher: e.target.value })}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 uppercase">Salle / Labo</label>
                                        <Input
                                            placeholder="Ex: Salle 102"
                                            value={newSession.room}
                                            onChange={(e) => setNewSession({ ...newSession, room: e.target.value })}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 uppercase">Jour</label>
                                        <select
                                            value={newSession.day}
                                            onChange={(e) => setNewSession({ ...newSession, day: e.target.value as any })}
                                            className="w-full mt-1 h-10 px-3 border border-slate-200 rounded-md text-sm font-semibold"
                                        >
                                            {days.map((d) => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 uppercase">Heure Début</label>
                                        <select
                                            value={newSession.startHour}
                                            onChange={(e) => setNewSession({ ...newSession, startHour: Number(e.target.value) })}
                                            className="w-full mt-1 h-10 px-3 border border-slate-200 rounded-md text-sm font-semibold"
                                        >
                                            <option value={7}>07h30</option>
                                            <option value={8}>08h25</option>
                                            <option value={9}>09h20</option>
                                            <option value={10}>10h30</option>
                                            <option value={11}>11h25</option>
                                            <option value={13}>13h00</option>
                                            <option value={14}>13h55</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 uppercase">Durée</label>
                                        <select
                                            value={newSession.duration}
                                            onChange={(e) => setNewSession({ ...newSession, duration: Number(e.target.value) })}
                                            className="w-full mt-1 h-10 px-3 border border-slate-200 rounded-md text-sm font-semibold"
                                        >
                                            <option value={1}>1 Heure</option>
                                            <option value={2}>2 Heures</option>
                                            <option value={3}>3 Heures</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                                    <Button variant="outline" type="button" onClick={() => setShowNewModal(false)}>
                                        Annuler
                                    </Button>
                                    <Button type="submit" className="bg-primary-blue font-bold">
                                        Enregistrer
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
