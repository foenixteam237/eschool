"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Users, Clock, Search, Filter, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import { cn } from "@/lib/utils";

export default function TeacherAttendanceHistoryPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    const history = [
        { id: 1, date: "25 Dec 2025", class: "6ème A", time: "08:00 - 10:00", subject: "Mathématiques", present: 40, absent: 2, status: "completed" },
        { id: 2, date: "24 Dec 2025", class: "3ème B", time: "10:00 - 12:00", subject: "Physique", present: 35, absent: 3, status: "completed" },
        { id: 3, date: "24 Dec 2025", class: "Terminale S", time: "14:00 - 16:00", subject: "Mathématiques", present: 30, absent: 5, status: "completed" },
        { id: 4, date: "23 Dec 2025", class: "6ème A", time: "08:00 - 10:00", subject: "Mathématiques", present: 41, absent: 1, status: "completed" },
        { id: 5, date: "22 Dec 2025", class: "3ème B", time: "10:00 - 12:00", subject: "Physique", present: 38, absent: 0, status: "completed" },
    ];

    const filteredHistory = history.filter(record =>
        record.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.date.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const navigateToDetails = (className: string) => {
        // Mock mapping for demo purposes
        const idMap: { [key: string]: string } = { "6ème A": "1", "3ème B": "2", "Terminale S": "3" };
        const id = idMap[className] || "1";
        router.push(`/teacher/attendance/mark?classId=${id}&readOnly=true`);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-500 border border-slate-200 bg-white">
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Historique des Présences</h1>
                        <p className="text-slate-500">Consultez les registres d'appels passés.</p>
                    </div>
                </div>
            </div>

            <Card className="border-none shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <Input
                                placeholder="Rechercher par classe ou date..."
                                className="pl-10 bg-slate-50 border-slate-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="flex gap-2" onClick={() => setSearchTerm("")}>
                            <Filter size={18} /> Effacer Filtres
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {filteredHistory.map((record) => (
                    <Card
                        key={record.id}
                        className="group hover:border-primary-blue/30 transition-all cursor-pointer"
                        onClick={() => navigateToDetails(record.class)}
                    >
                        <CardContent className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase rounded-md tracking-wide">
                                        {record.class}
                                    </span>
                                    <span className="text-sm font-bold text-slate-500 flex items-center gap-1">
                                        <Clock size={14} /> {record.time}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">{record.subject}</h3>
                                <p className="text-sm text-slate-500 flex items-center gap-2">
                                    <Calendar size={14} /> {record.date}
                                </p>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-2 text-sm font-medium mb-1">
                                        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                                            Present: {record.present}
                                        </span>
                                        <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded flex items-center gap-1">
                                            Absent: {record.absent}
                                        </span>
                                    </div>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Validé
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-slate-400 hover:text-primary-blue"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigateToDetails(record.class);
                                    }}
                                >
                                    <Eye size={20} />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
