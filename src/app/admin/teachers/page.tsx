"use client";

import { useState } from "react";
import {
    GraduationCap,
    Search,
    Plus,
    Mail,
    Phone,
    BookOpen,
    MoreVertical,
    MailQuestion,
    Edit,
    Trash2,
    Eye,
    Clock,
    Users,
    ChevronLeft
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { DeleteModal } from "@/components/shared/delete-modal";

import { useSearchParams, useRouter } from "next/navigation";

export default function AdminTeachersPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const selectedSubject = searchParams.get("subject");
    const [searchTerm, setSearchTerm] = useState("");

    const [teachers, setTeachers] = useState([
        { id: "1", name: "Jean DUPONT", subjects: ["Maths", "Physique"], classes: ["6ème A", "3ème B"], email: "j.dupont@ecole.com", phone: "699 00 11 22" },
        { id: "2", name: "Marie SMITH", subjects: ["Anglais"], classes: ["6ème A", "5ème B", "Terminal S"], email: "m.smith@ecole.com", phone: "677 33 44 55" },
        { id: "3", name: "Paul LEFEBVRE", subjects: ["SVT"], classes: ["3ème B", "2nde C"], email: "p.lefebvre@ecole.com", phone: "655 77 88 99" },
        { id: "4", name: "Alice MVE", subjects: ["Maths"], classes: ["4ème A", "Tle C"], email: "a.mve@ecole.com", phone: "688 11 22 33" },
    ]);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<{ id: string, name: string } | null>(null);

    // Extract unique subjects and their counts
    const subjectStats = teachers.reduce((acc, t) => {
        t.subjects.forEach(sub => {
            acc[sub] = (acc[sub] || 0) + 1;
        });
        return acc;
    }, {} as Record<string, number>);

    const subjects = Object.entries(subjectStats).map(([name, count]) => ({ name, count }));

    const filteredTeachers = selectedSubject === "TOUT" || !selectedSubject
        ? teachers
        : teachers.filter(t => t.subjects.includes(selectedSubject));

    const finalTeachers = filteredTeachers.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const setSubject = (subject: string | null) => {
        if (subject) {
            router.push(`/admin/teachers?subject=${subject}`);
        } else {
            router.push("/admin/teachers");
        }
    };

    const handleDeleteClick = (id: string, name: string) => {
        setSelectedTeacher({ id, name });
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (selectedTeacher) {
            setTeachers(prev => prev.filter(t => t.id !== selectedTeacher.id));
            setSelectedTeacher(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    {selectedSubject && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-500 hover:text-primary-blue bg-white shadow-sm border border-slate-100"
                            onClick={() => setSubject(null)}
                        >
                            <ChevronLeft size={20} />
                        </Button>
                    )}
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            {selectedSubject ? `Enseignants : ${selectedSubject === "TOUT" ? "Tous" : selectedSubject}` : "Corps Enseignant"}
                        </h1>
                        <p className="text-slate-500">
                            {selectedSubject ? `Liste des professeurs spécialisés en ${selectedSubject === "TOUT" ? "toutes les matières" : selectedSubject}.` : "Gérez les professeurs par spécialité ou consultez la liste complète."}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {selectedSubject && (
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                            <Input
                                placeholder="Rechercher un professeur..."
                                className="pl-9 h-10 border-slate-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    )}
                    <Link href="/admin/teachers/new">
                        <Button className="bg-slate-900 border-none flex items-center gap-2 h-10 shadow-lg shadow-slate-200">
                            <Plus size={18} /> Nouvel Enseignant
                        </Button>
                    </Link>
                </div>
            </div>

            {!selectedSubject ? (
                // Subject Categories View
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* "All" Card */}
                    <Card
                        className="group cursor-pointer hover:border-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/5 transition-all duration-300 border-dashed border-2 bg-slate-50/50"
                        onClick={() => setSubject("TOUT")}
                    >
                        <CardContent className="p-8 text-center flex flex-col items-center justify-center space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Users size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Tout voir</h3>
                                <p className="text-slate-500 text-sm font-medium uppercase tracking-widest mt-1">{teachers.length} Enseignants</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Subject Cards */}
                    {subjects.map((sub, idx) => (
                        <Card
                            key={idx}
                            className="group cursor-pointer hover:border-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/5 transition-all duration-300 bg-white"
                            onClick={() => setSubject(sub.name)}
                        >
                            <CardContent className="p-8 text-center flex flex-col items-center justify-center space-y-4">
                                <div className="w-16 h-16 rounded-2xl bg-primary-blue/5 text-primary-blue flex items-center justify-center group-hover:bg-primary-blue group-hover:text-white group-hover:scale-110 transition-all shadow-sm">
                                    <BookOpen size={30} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{sub.name}</h3>
                                    <p className="text-primary-blue text-sm font-bold uppercase tracking-widest mt-1">{sub.count} Enseignants</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                // Teachers List for Subject View
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {finalTeachers.map((teacher) => (
                        <Card key={teacher.id} className="group hover:border-primary-blue/30 transition-all shadow-sm hover:shadow-md bg-white border-slate-100 overflow-hidden">
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary-blue transition-colors">
                                    <GraduationCap size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <CardTitle className="text-base truncate">{teacher.name}</CardTitle>
                                    <CardDescription className="text-xs uppercase font-bold text-primary-blue tracking-tighter">
                                        {teacher.subjects.join(", ")}
                                    </CardDescription>
                                </div>
                                <div className="flex gap-1">
                                    <Link href={`/admin/teachers/new?edit=${teacher.id}`}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-amber-500 hover:bg-amber-50 rounded-full">
                                            <Edit size={16} />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full"
                                        onClick={() => handleDeleteClick(teacher.id, teacher.name)}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 pt-2 space-y-4">
                                <div className="space-y-2 border-l-2 border-slate-50 pl-4 py-1">
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                        <Mail size={14} className="text-slate-400" /> {teacher.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                        <Phone size={14} className="text-slate-400" /> {teacher.phone}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-50">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Classes Assignées</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {teacher.classes.map((cls, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-extrabold border border-slate-100 group-hover:border-primary-blue/10 transition-colors">
                                                {cls}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Link href={`/admin/teachers/${teacher.id}`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full text-[10px] h-9 font-bold border-slate-100 hover:bg-slate-50 text-slate-600 hover:text-primary-blue tracking-widest uppercase">
                                            PROFIL
                                        </Button>
                                    </Link>
                                    <Button variant="outline" size="sm" className="flex-1 text-[10px] h-9 font-bold border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-amber-600 tracking-widest uppercase">
                                        AGENDA
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {finalTeachers.length === 0 && (
                        <div className="col-span-full py-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                            <p className="text-slate-400 font-medium italic">Aucun enseignant trouvé pour cette recherche.</p>
                        </div>
                    )}
                </div>
            )}

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Supprimer l'enseignant"
                description="Cette action retirera cet enseignant de tous les registres de l'école. Les classes assignées devront être réattribuées."
                itemName={selectedTeacher?.name}
            />
        </div>
    );
}
