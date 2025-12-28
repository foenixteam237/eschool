"use client";

import { useState } from "react";
import {
    Users,
    Search,
    Plus,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Link from "next/link";
import { DeleteModal } from "@/components/shared/delete-modal";

export default function AdminStudentsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClass, setSelectedClass] = useState("Toutes les classes");
    const [students, setStudents] = useState([
        { id: "1", name: "KAMGA Jean", matricule: "2025-ECO-0001", class: "3ème B", status: "Actif", email: "jean.kamga@gmail.com" },
        { id: "2", name: "BELLA Marie", matricule: "2025-ECO-0002", class: "6ème A", status: "Actif", email: "marie.bella@yahoo.fr" },
        { id: "3", name: "FOTSO Paul", matricule: "2025-ECO-0003", class: "1ère D", status: "Inactif", email: "paul.fotso@outlook.com" },
        { id: "4", name: "NGONO Anne", matricule: "2025-ECO-0004", class: "Tle C", status: "Candidat", email: "anne.ngono@free.fr" },
    ]);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<{ id: string, name: string } | null>(null);

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.matricule.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClass = selectedClass === "Toutes les classes" || student.class === selectedClass;
        return matchesSearch && matchesClass;
    });

    const handleDeleteClick = (id: string, name: string) => {
        setSelectedStudent({ id, name });
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (selectedStudent) {
            setStudents(prev => prev.filter(s => s.id !== selectedStudent.id));
            setSelectedStudent(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestion des Élèves</h1>
                    <p className="text-slate-500">Gérez les inscriptions, dossiers et statuts des élèves.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Download size={18} /> Exporter
                    </Button>
                    <Link href="/admin/students/new">
                        <Button className="flex items-center gap-2">
                            <Plus size={18} /> Nouvel Élève
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <Input
                            placeholder="Rechercher par nom, matricule..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Filter size={14} /> Filtres
                        </Button>
                        <select
                            className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium outline-none focus:ring-1 focus:ring-primary-blue"
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                        >
                            <option>Toutes les classes</option>
                            <option>6ème A</option>
                            <option>5ème B</option>
                            <option>4ème A</option>
                            <option>3ème B</option>
                            <option>2nde C</option>
                            <option>1ère D</option>
                            <option>Tle C</option>
                        </select>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-500 text-sm border-b border-slate-100">
                                    <th className="pb-3 pr-4 font-semibold">Matricule</th>
                                    <th className="pb-3 pr-4 font-semibold">Élève</th>
                                    <th className="pb-3 pr-4 font-semibold">Classe</th>
                                    <th className="pb-3 pr-4 font-semibold">Statut</th>
                                    <th className="pb-3 pr-4 font-semibold">Email</th>
                                    <th className="pb-3 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4 pr-4 font-mono text-xs text-slate-500">{student.matricule}</td>
                                        <td className="py-4 pr-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-primary-blue flex items-center justify-center font-bold text-xs">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-slate-800">{student.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 pr-4 text-slate-600 font-medium">{student.class}</td>
                                        <td className="py-4 pr-4">
                                            <span className={cn(
                                                "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                                student.status === "Actif" ? "bg-emerald-50 text-emerald-600" :
                                                    student.status === "Candidat" ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-400"
                                            )}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="py-4 pr-4 text-slate-500 text-sm">{student.email}</td>
                                        <td className="py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={`/admin/students/${student.id}`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary-blue">
                                                        <Eye size={16} />
                                                    </Button>
                                                </Link>
                                                <Link href={`/admin/students/new?edit=${student.id}`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-amber-600">
                                                        <Edit size={16} />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-slate-400 hover:text-red-600"
                                                    onClick={() => handleDeleteClick(student.id, student.name)}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                        <p className="text-xs text-slate-500 italic">Affichage de {filteredStudents.length} sur {students.length} élèves</p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled>Précédent</Button>
                            <Button variant="outline" size="sm">Suivant</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Supprimer l'élève"
                description="Êtes-vous sûr de vouloir supprimer définitivement cet élève ? Cette action supprimera également toutes ses données académiques."
                itemName={selectedStudent?.name}
            />
        </div>
    );
}

