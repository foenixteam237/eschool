"use client";

import {
    Calendar,
    Clock,
    MapPin,
    Plus,
    ChevronLeft,
    ChevronRight,
    Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminTimetablePage() {
    const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const timeSlots = ["08h - 10h", "10h - 12h", "12h - 14h", "14h - 16h", "16h - 18h"];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Emplois du Temps</h1>
                    <p className="text-slate-500">Planifiez les cours et évitez les chevauchements.</p>
                </div>
                <Button className="flex items-center gap-2">
                    <Plus size={18} /> Nouvelle Séance
                </Button>
            </div>

            <Card>
                <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-50 pb-6">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-slate-800">Classe: <span className="text-primary-blue underline underline-offset-4">6ème A</span></h2>
                        <div className="flex gap-1">
                            <Button variant="outline" size="icon" className="h-8 w-8"><ChevronLeft size={16} /></Button>
                            <Button variant="outline" size="icon" className="h-8 w-8"><ChevronRight size={16} /></Button>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex items-center gap-2 text-xs font-bold">
                            <Filter size={14} /> Filtres
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-2 text-xs font-bold text-primary-blue border-primary-blue/30 bg-blue-50/50">
                            <Calendar size={14} /> Vue Hebdomadaire
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="bg-slate-50/50 p-4 border-r border-slate-100 border-b w-32"></th>
                                    {days.map(day => (
                                        <th key={day} className="p-4 border-b border-r border-slate-100 bg-slate-50 text-slate-600 font-bold text-sm">{day}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {timeSlots.map((slot, i) => (
                                    <tr key={slot}>
                                        <td className="p-4 border-r border-slate-100 border-b bg-slate-50 text-xs font-black text-slate-400 text-center">{slot}</td>
                                        {days.map((day, j) => (
                                            <td key={`${day}-${slot}`} className="p-2 border-r border-slate-100 border-b min-w-[150px] align-top bg-white">
                                                {((i === 0 && j === 0) || (i === 1 && j === 2) || (i === 3 && j === 1)) && (
                                                    <div className="p-3 rounded-lg bg-blue-50 border-l-4 border-primary-blue space-y-1 shadow-sm">
                                                        <p className="text-xs font-black text-primary-blue uppercase">Mathématiques</p>
                                                        <p className="text-[10px] font-bold text-slate-800 flex items-center gap-1"><Clock size={10} /> 08:00 - 10:00</p>
                                                        <p className="text-[10px] text-slate-500 font-medium">M. DUPONT • Salle 102</p>
                                                    </div>
                                                )}
                                                {((i === 0 && j === 1) || (i === 2 && j === 4)) && (
                                                    <div className="p-3 rounded-lg bg-emerald-50 border-l-4 border-success-green space-y-1 shadow-sm">
                                                        <p className="text-xs font-black text-success-green uppercase">SVT</p>
                                                        <p className="text-[10px] font-bold text-slate-800 flex items-center gap-1"><Clock size={10} /> 08:00 - 10:00</p>
                                                        <p className="text-[10px] text-slate-500 font-medium">M. LEFEBVRE • Labo A</p>
                                                    </div>
                                                )}
                                            </td>
                                        ))}
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
