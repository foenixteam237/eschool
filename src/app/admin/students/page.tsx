"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
    Users,
    Search,
    Plus,
    Trash2,
    Eye,
    School,
    BookOpen,
    Download,
    FileSpreadsheet,
    FileText,
    Filter,
    CheckCircle2,
    AlertCircle,
    Clock,
    Phone,
    Mail,
    UserCheck,
    Coins,
    Award
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { studentsService, StudentExtended, mockStudentsDatabase } from "@/services/students.service";
import { DeleteModal } from "@/components/shared/delete-modal";

function AdminStudentsContent() {
    const searchParams = useSearchParams();
    const initialSchoolId = searchParams.get("schoolId");

    const [students, setStudents] = useState<StudentExtended[]>(mockStudentsDatabase);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSchool, setSelectedSchool] = useState<string>("all");
    const [selectedClass, setSelectedClass] = useState<string>("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [selectedGender, setSelectedGender] = useState<string>("all");

    const [selectedStudent, setSelectedStudent] = useState<StudentExtended | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<StudentExtended | null>(null);
    const [showForm, setShowForm] = useState(false);

    // Formulaire d'inscription élève
    const [formData, setFormData] = useState({
        matricule: "",
        nom: "",
        prenom: "",
        email: "",
        genre: "M" as "M" | "F",
        dateNaissance: "2010-01-01",
        classeNom: "6ème A",
        etablissementNom: "Lycée Général Leclerc (Yaoundé)",
        parentNom: "",
        parentTelephone: "+237 6",
        statutFrais: "SOLDE" as "SOLDE" | "PARTIEL" | "IMPAYE",
        montantDu: 0,
    });

    const schools = [
        "Lycée Général Leclerc (Yaoundé)",
        "Lycée Bilingue de Deido (Douala)",
        "Collège Libermann (Douala)",
        "Lycée Classique de Bafoussam",
        "Lycée Technique de Douala-Koumassi"
    ];

    const classes = [
        "6ème A",
        "5ème B",
        "4ème All",
        "3ème Esp",
        "2nde C",
        "2nde A4",
        "1ère D",
        "1ère TI",
        "Tle C",
        "Tle D"
    ];

    const [apiError, setApiError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadStudents = async () => {
            setIsLoading(true);
            try {
                const res = await studentsService.getStudents(1, 50);
                if (res && res.data && res.data.length > 0) {
                    setStudents(res.data);
                }
            } catch (err: any) {
                console.warn("Échec chargement élèves distant:", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadStudents();
    }, []);

    useEffect(() => {
        if (initialSchoolId) {
            if (initialSchoolId.includes("lgl")) setSelectedSchool("Lycée Général Leclerc (Yaoundé)");
            else if (initialSchoolId.includes("lbd")) setSelectedSchool("Lycée Bilingue de Deido (Douala)");
            else if (initialSchoolId.includes("libermann")) setSelectedSchool("Collège Libermann (Douala)");
            else if (initialSchoolId.includes("bafoussam")) setSelectedSchool("Lycée Classique de Bafoussam");
            else if (initialSchoolId.includes("koumassi")) setSelectedSchool("Lycée Technique de Douala-Koumassi");
        }
    }, [initialSchoolId]);

    // Filtrage dynamique
    const filteredStudents = students.filter((s) => {
        const matchesSearch =
            s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSchool = selectedSchool === "all" || s.etablissementNom === selectedSchool;
        const matchesClass = selectedClass === "all" || s.classeNom === selectedClass;
        const matchesStatus = selectedStatus === "all" || s.statutFrais === selectedStatus;
        const matchesGender = selectedGender === "all" || s.genre === selectedGender;

        return matchesSearch && matchesSchool && matchesClass && matchesStatus && matchesGender;
    });

    const handleCreateStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError(null);
        const matriculeCode = formData.matricule || `STU${Math.floor(100 + Math.random() * 900)}`;

        const newStudentPayload = {
            studentId: matriculeCode,
            email: formData.email || `${formData.prenom.toLowerCase()}.${formData.nom.toLowerCase()}@eschool.cm`,
            firstName: formData.prenom,
            lastName: formData.nom.toUpperCase(),
            phone: formData.parentTelephone,
            classId: "cls_1",
            schoolId: "sch_1",
        };

        const localExtended: StudentExtended = {
            id: `std-${Date.now()}`,
            matricule: matriculeCode,
            firstName: formData.prenom,
            lastName: formData.nom.toUpperCase(),
            email: newStudentPayload.email,
            genre: formData.genre,
            dateNaissance: formData.dateNaissance,
            role: "ELEVE",
            estActif: true,
            classeNom: formData.classeNom,
            etablissementNom: formData.etablissementNom,
            parentNom: formData.parentNom || "Parent d'Élève",
            parentTelephone: formData.parentTelephone,
            statutFrais: formData.statutFrais,
            montantDu: formData.statutFrais === "SOLDE" ? 0 : formData.montantDu || 45000,
        };

        try {
            const created = await studentsService.createStudent(newStudentPayload);
            setStudents([created, ...students]);
        } catch (err: any) {
            console.warn("Création API échouée, sauvegarde locale:", err);
            setStudents([localExtended, ...students]);
        }

        setShowForm(false);
        setFormData({
            matricule: "",
            nom: "",
            prenom: "",
            email: "",
            genre: "M",
            dateNaissance: "2010-01-01",
            classeNom: "6ème A",
            etablissementNom: "Lycée Général Leclerc (Yaoundé)",
            parentNom: "",
            parentTelephone: "+237 6",
            statutFrais: "SOLDE",
            montantDu: 0,
        });
    };

    const confirmDelete = async () => {
        if (!studentToDelete) return;
        try {
            await studentsService.deleteStudent(studentToDelete.id);
        } catch (err) {
            console.warn("Suppression API non effectuée:", err);
        }
        setStudents(students.filter((s) => s.id !== studentToDelete.id));
        setIsDeleteModalOpen(false);
        setStudentToDelete(null);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Users className="text-primary-blue" size={32} />
                        Répertoire des Élèves
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Suivi scolaire des élèves par classe et par établissement secondaire (MINESEC)
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 border-slate-200">
                        <Download size={16} /> Exporter Registre (PDF)
                    </Button>
                    <Button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-primary-blue hover:bg-blue-700 font-bold gap-2 shadow-lg shadow-blue-100"
                    >
                        <Plus size={18} /> {showForm ? "Fermer le formulaire" : "Nouvel Élève"}
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-none shadow-sm bg-white border-l-4 border-l-primary-blue">
                    <CardContent className="p-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sélectionné</p>
                        <p className="text-2xl font-black text-slate-900 mt-1">{filteredStudents.length} Élèves</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white border-l-4 border-l-emerald-500">
                    <CardContent className="p-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Frais Soldés (APEE)</p>
                        <p className="text-2xl font-black text-emerald-600 mt-1">
                            {filteredStudents.filter((s) => s.statutFrais === "SOLDE").length}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white border-l-4 border-l-amber-500">
                    <CardContent className="p-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Paiement Partiel</p>
                        <p className="text-2xl font-black text-amber-600 mt-1">
                            {filteredStudents.filter((s) => s.statutFrais === "PARTIEL").length}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white border-l-4 border-l-rose-500">
                    <CardContent className="p-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Insolvables</p>
                        <p className="text-2xl font-black text-rose-600 mt-1">
                            {filteredStudents.filter((s) => s.statutFrais === "IMPAYE").length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Formulaire Nouvel Élève */}
            {showForm && (
                <Card className="border-none shadow-md overflow-hidden bg-slate-50/50 border border-blue-100 animate-in slide-in-from-top-4 duration-300">
                    <CardHeader className="bg-white border-b border-slate-100">
                        <CardTitle className="text-lg flex items-center gap-2 text-primary-blue">
                            <UserCheck size={20} /> Inscription d'un Nouvel Élève
                        </CardTitle>
                        <CardDescription>Renseignez les données administratives et l'affectation pédagogique</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 bg-white">
                        <form onSubmit={handleCreateStudent} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-600 uppercase">Matricule MINESEC</label>
                                    <Input
                                        placeholder="Ex: 24C099"
                                        value={formData.matricule}
                                        onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
                                        className="mt-1 font-mono font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-600 uppercase">Nom de famille *</label>
                                    <Input
                                        placeholder="Ex: TCHAMI"
                                        required
                                        value={formData.nom}
                                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                        className="mt-1 font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-600 uppercase">Prénoms *</label>
                                    <Input
                                        placeholder="Ex: Eric Bernard"
                                        required
                                        value={formData.prenom}
                                        onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-600 uppercase">Genre</label>
                                    <select
                                        value={formData.genre}
                                        onChange={(e) => setFormData({ ...formData, genre: e.target.value as "M" | "F" })}
                                        className="w-full mt-1 h-10 px-3 border border-slate-200 rounded-md text-sm font-semibold"
                                    >
                                        <option value="M">Masculin (Garçon)</option>
                                        <option value="F">Féminin (Fille)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-600 uppercase">Établissement *</label>
                                    <select
                                        value={formData.etablissementNom}
                                        onChange={(e) => setFormData({ ...formData, etablissementNom: e.target.value })}
                                        className="w-full mt-1 h-10 px-3 border border-slate-200 rounded-md text-sm font-bold text-primary-blue"
                                    >
                                        {schools.map((sch) => (
                                            <option key={sch} value={sch}>{sch}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-600 uppercase">Classe d'affectation *</label>
                                    <select
                                        value={formData.classeNom}
                                        onChange={(e) => setFormData({ ...formData, classeNom: e.target.value })}
                                        className="w-full mt-1 h-10 px-3 border border-slate-200 rounded-md text-sm font-bold text-slate-800"
                                    >
                                        {classes.map((cls) => (
                                            <option key={cls} value={cls}>{cls}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-600 uppercase">Statut Frais Scolaires</label>
                                    <select
                                        value={formData.statutFrais}
                                        onChange={(e) => setFormData({ ...formData, statutFrais: e.target.value as any })}
                                        className="w-full mt-1 h-10 px-3 border border-slate-200 rounded-md text-sm font-bold"
                                    >
                                        <option value="SOLDE">Soldé (Totalité payée)</option>
                                        <option value="PARTIEL">Paiement Partiel (1ère tranche)</option>
                                        <option value="IMPAYE">Impayé (En attente)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-600 uppercase">Nom du Parent / Tuteur</label>
                                    <Input
                                        placeholder="Ex: M. TCHAMI Joseph"
                                        value={formData.parentNom}
                                        onChange={(e) => setFormData({ ...formData, parentNom: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-600 uppercase">Téléphone Parent (MoMo/Orange)</label>
                                    <Input
                                        placeholder="+237 6XX XX XX XX"
                                        value={formData.parentTelephone}
                                        onChange={(e) => setFormData({ ...formData, parentTelephone: e.target.value })}
                                        className="mt-1 font-mono"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                                <Button variant="outline" type="button" onClick={() => setShowForm(false)}>
                                    Annuler
                                </Button>
                                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                                    Valider l'Inscription
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Filter Bar */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                        <div className="md:col-span-4 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <Input
                                placeholder="Rechercher par nom, matricule ou email..."
                                className="pl-10 h-11 bg-slate-50 border-slate-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filtre Établissement */}
                        <div className="md:col-span-3">
                            <select
                                value={selectedSchool}
                                onChange={(e) => setSelectedSchool(e.target.value)}
                                className="w-full h-11 px-3 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none"
                            >
                                <option value="all">🏫 Tous les Établissements</option>
                                {schools.map((sch) => (
                                    <option key={sch} value={sch}>{sch}</option>
                                ))}
                            </select>
                        </div>

                        {/* Filtre Classe */}
                        <div className="md:col-span-2">
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full h-11 px-3 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none"
                            >
                                <option value="all">📚 Toutes Classes</option>
                                {classes.map((cls) => (
                                    <option key={cls} value={cls}>Classe : {cls}</option>
                                ))}
                            </select>
                        </div>

                        {/* Filtre Statut Frais */}
                        <div className="md:col-span-2">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full h-11 px-3 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none"
                            >
                                <option value="all">💰 Tous Paiements</option>
                                <option value="SOLDE">Soldé (100%)</option>
                                <option value="PARTIEL">Partiel</option>
                                <option value="IMPAYE">Impayé</option>
                            </select>
                        </div>

                        {/* Reset */}
                        <div className="md:col-span-1">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSelectedSchool("all");
                                    setSelectedClass("all");
                                    setSelectedStatus("all");
                                    setSelectedGender("all");
                                    setSearchTerm("");
                                }}
                                className="w-full h-11 text-xs font-bold"
                            >
                                Reset
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Students Table */}
            <Card className="border-none shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                    <th className="py-3.5 px-4">Matricule</th>
                                    <th className="py-3.5 px-4">Élève</th>
                                    <th className="py-3.5 px-4">Établissement</th>
                                    <th className="py-3.5 px-4">Classe</th>
                                    <th className="py-3.5 px-4 text-center">Genre</th>
                                    <th className="py-3.5 px-4">Parent / Tuteur</th>
                                    <th className="py-3.5 px-4 text-center">Frais Scolaires</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-blue-50/20 transition-colors group">
                                        <td className="py-3.5 px-4 font-mono font-bold text-xs text-primary-blue">
                                            {student.matricule}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                                                    {student.lastName.charAt(0)}{student.firstName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 text-sm">
                                                        {student.lastName} {student.firstName}
                                                    </p>
                                                    <p className="text-xs text-slate-400">{student.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                                            {student.etablissementNom}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-black">
                                                {student.classeNom}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-center">
                                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black ${
                                                student.genre === "F" ? "bg-pink-100 text-pink-700" : "bg-blue-100 text-blue-700"
                                            }`}>
                                                {student.genre === "F" ? "Fille" : "Garçon"}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-xs">
                                            <p className="font-bold text-slate-800">{student.parentNom}</p>
                                            <p className="text-slate-400 font-mono text-[11px]">{student.parentTelephone}</p>
                                        </td>
                                        <td className="py-3.5 px-4 text-center">
                                            {student.statutFrais === "SOLDE" ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                                    <CheckCircle2 size={11} /> Soldé
                                                </span>
                                            ) : student.statutFrais === "PARTIEL" ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                                    <Clock size={11} /> Reste {student.montantDu?.toLocaleString()} F
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                                                    <AlertCircle size={11} /> Impayé ({student.montantDu?.toLocaleString()} F)
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setSelectedStudent(student)}
                                                    className="h-8 w-8 text-slate-400 hover:text-primary-blue rounded-lg"
                                                    title="Dossier scolaire"
                                                >
                                                    <Eye size={16} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setStudentToDelete(student);
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                    className="h-8 w-8 text-slate-400 hover:text-rose-600 rounded-lg"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredStudents.length === 0 && (
                            <div className="p-12 text-center text-slate-500 space-y-2">
                                <Users size={40} className="mx-auto text-slate-300" />
                                <p className="font-bold text-slate-700">Aucun élève trouvé</p>
                                <p className="text-xs">Modifiez vos critères de recherche ou ajoutez un nouvel élève.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Modal Dossier Élève */}
            {selectedStudent && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="max-w-2xl w-full bg-white shadow-2xl border-none max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                        <CardHeader className="bg-slate-900 text-white p-6 relative">
                            <span className="text-[10px] font-mono tracking-widest text-blue-300 uppercase">
                                Dossier Individuel de Scolarité • MINESEC
                            </span>
                            <div className="flex items-center gap-4 mt-2">
                                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-xl font-black text-white border border-white/20">
                                    {selectedStudent.lastName.charAt(0)}{selectedStudent.firstName.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black">{selectedStudent.lastName} {selectedStudent.firstName}</h2>
                                    <p className="text-xs text-slate-300 font-mono">Matricule : {selectedStudent.matricule} • {selectedStudent.classeNom}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="absolute top-6 right-6 text-slate-400 hover:text-white text-lg font-bold"
                            >
                                ✕
                            </button>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Affectation Scolaire</p>
                                    <p className="font-bold text-slate-800">{selectedStudent.etablissementNom}</p>
                                    <p className="text-slate-600">Classe : <span className="font-bold">{selectedStudent.classeNom}</span></p>
                                    <p className="text-slate-600">Né(e) le : {selectedStudent.dateNaissance} ({selectedStudent.genre === "F" ? "Fille" : "Garçon"})</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Parent & Tuteur Légal</p>
                                    <p className="font-bold text-slate-800">{selectedStudent.parentNom}</p>
                                    <p className="font-mono text-slate-600 flex items-center gap-1">
                                        <Phone size={12} /> {selectedStudent.parentTelephone}
                                    </p>
                                    <p className="text-slate-500">Contact d'urgence validé</p>
                                </div>
                            </div>

                            {/* Statut Financier & Frais */}
                            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-2">
                                        <Coins size={14} className="text-amber-500" /> État des Cotisations & APEE
                                    </span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                                        selectedStudent.statutFrais === "SOLDE" ? "bg-emerald-100 text-emerald-800" :
                                        selectedStudent.statutFrais === "PARTIEL" ? "bg-amber-100 text-amber-800" :
                                        "bg-rose-100 text-rose-800"
                                    }`}>
                                        {selectedStudent.statutFrais}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-600">
                                    Montant restant dû : <strong className="text-slate-900">{selectedStudent.montantDu?.toLocaleString()} FCFA</strong> (sur 120 000 FCFA au titre de l'année 2024/2025).
                                </p>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                                <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                                    Fermer
                                </Button>
                                <Button className="bg-primary-blue font-bold gap-2">
                                    <FileText size={16} /> Générer Certificat de Scolarité
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Modal Suppression */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Supprimer l'élève"
                description={`Êtes-vous sûr de vouloir radier l'élève ${studentToDelete?.lastName} ${studentToDelete?.firstName} (${studentToDelete?.matricule}) de la base ?`}
            />
        </div>
    );
}

export default function AdminStudentsPage() {
    return (
        <Suspense fallback={<div className="p-8 text-slate-500">Chargement du répertoire des élèves...</div>}>
            <AdminStudentsContent />
        </Suspense>
    );
}
