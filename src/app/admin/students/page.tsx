"use client";

import { useState, useEffect } from "react";
import {
    Users,
    Search,
    Plus,
    Edit,
    Trash2,
    Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { studentsService, CreateStudentRequest } from "@/services/students.service";
import { Student } from "@/types";
import { toast } from "react-toastify";
import Link from "next/link";
import { DeleteModal } from "@/components/shared/delete-modal";

export default function AdminStudentsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<{ id: string, name: string } | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<Partial<CreateStudentRequest>>({});

    // Charger les étudiants
    const loadStudents = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await studentsService.getStudents(page, 10, searchTerm);
            setStudents(response.data);
            setTotal(response.total);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur lors du chargement';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudents();
    }, [page, searchTerm]);

    const handleDeleteClick = (id: string, name: string) => {
        setSelectedStudent({ id, name });
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedStudent) return;

        try {
            await studentsService.deleteStudent(selectedStudent.id);
            setStudents(prev => prev.filter(s => s.id !== selectedStudent.id));
            toast.success("Étudiant supprimé avec succès");
            setIsDeleteModalOpen(false);
            loadStudents();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur lors de la suppression';
            toast.error(message);
        }
    };

    const handleCreateStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.studentId || !formData.email || !formData.firstName || !formData.lastName) {
            toast.error('Veuillez remplir tous les champs');
            return;
        }

        try {
            await studentsService.createStudent(formData as CreateStudentRequest);
            toast.success('Étudiant créé avec succès');
            setShowForm(false);
            setFormData({});
            setPage(1);
            loadStudents();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur lors de la création';
            toast.error(message);
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
                    <Button 
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2"
                    >
                        <Plus size={18} /> {showForm ? 'Annuler' : 'Nouvel Élève'}
                    </Button>
                </div>
            </div>

            {/* Formulaire de création */}
            {showForm && (
                <Card className="p-6 bg-white border border-slate-200">
                    <h3 className="text-lg font-semibold mb-4">Créer un nouvel étudiant</h3>
                    <form onSubmit={handleCreateStudent} className="grid grid-cols-2 gap-4">
                        <Input
                            placeholder="Matricule"
                            value={formData.studentId || ''}
                            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                            required
                        />
                        <Input
                            placeholder="Email"
                            type="email"
                            value={formData.email || ''}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <Input
                            placeholder="Nom"
                            value={formData.lastName || ''}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            required
                        />
                        <Input
                            placeholder="Prénom"
                            value={formData.firstName || ''}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            required
                        />
                        <Input
                            placeholder="Téléphone (optionnel)"
                            value={formData.phone || ''}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                        <div className="col-span-2 flex gap-2">
                            <Button type="submit" className="bg-green-600 hover:bg-green-700">
                                Créer
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            <Card>
                <CardHeader className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4">
                    <div className="relative w-full lg:w-96">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <Input
                            placeholder="Rechercher par nom, email..."
                            className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md mb-4">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-slate-600">Chargement des étudiants...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-slate-500 text-sm border-b border-slate-100">
                                        <th className="pb-3 pr-4 font-semibold">Élève</th>
                                        <th className="pb-3 pr-4 font-semibold">Email</th>
                                        <th className="pb-3 pr-4 font-semibold">Rôle</th>
                                        <th className="pb-3 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {students.map((student) => (
                                        <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4 pr-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-primary-blue flex items-center justify-center font-bold text-xs">
                                                        {student.lastName?.charAt(0) || 'S'}
                                                    </div>
                                                    <span className="font-bold text-slate-800">{student.lastName} {student.firstName}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 pr-4 text-slate-500 text-sm">{student.email}</td>
                                            <td className="py-4 pr-4">
                                                <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600">
                                                    STUDENT
                                                </span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-8 w-8 text-slate-400 hover:text-red-600"
                                                        onClick={() => handleDeleteClick(student.id, `${student.lastName} ${student.firstName}`)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {students.length === 0 && !loading && (
                                <div className="text-center py-12">
                                    <p className="text-slate-600">Aucun étudiant trouvé</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {total > 0 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-600">
                        Total: {total} | Page: {page}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            variant="outline"
                        >
                            Précédent
                        </Button>
                        <Button
                            onClick={() => setPage(page + 1)}
                            disabled={page * 10 >= total}
                            variant="outline"
                        >
                            Suivant
                        </Button>
                    </div>
                </div>
            )}

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Supprimer l'étudiant"
                description={`Êtes-vous sûr de vouloir supprimer ${selectedStudent?.name}?`}
            />
        </div>
    );
}

