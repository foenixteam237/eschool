"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Search,
    Download,
    FileText,
    Filter,
    MoreVertical,
    TrendingUp,
    Trophy,
    AlertTriangle,
    ArrowUpDown,
    Printer,
    CheckCircle2,
    Settings2,
    ArrowLeft,
    Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import StudentReportCardModal from "@/components/admin/student-report-card-modal";
import CouncilDecisionsModal from "@/components/admin/council-decisions-modal"; // Import new modal

// Mock Data (simulating data fetched from ID)
const classInfo = {
    id: "6A",
    name: "6ème A",
    level: "6ème",
    mainTeacher: "M. Tchaptchet",
    studentsCount: 45,
    average: 12.4,
    successRate: 85,
    topStudent: "Nguene Marie",
    topScore: 18.5,
    lastUpdated: "24 Oct 2024"
};

// Mock Global Grades (since we don't have individual grades yet)
const mockGrades = [
    { subject: "Mathématiques", grade: 14.5, coef: 4, teacher: "M. Talla" },
    { subject: "Physique", grade: 12.0, coef: 3, teacher: "M. Kamdem" },
    { subject: "Informatique", grade: 16.5, coef: 2, teacher: "Mme. Ngono" },
    { subject: "Français", grade: 13.0, coef: 4, teacher: "M. Abessolo" },
    { subject: "Anglais", grade: 11.5, coef: 3, teacher: "Mr. Smith" },
    { subject: "Histoire", grade: 15.0, coef: 2, teacher: "M. Onana" },
    { subject: "Géographie", grade: 14.0, coef: 2, teacher: "M. Onana" },
    { subject: "ECM", grade: 16.0, coef: 1, teacher: "Mme. Minka" },
];

// Mock Students Data
const initialStudents = Array.from({ length: 45 }).map((_, i) => ({
    id: i + 1,
    name: ["Nguene Marie", "Talla Jean", "Abessolo Pierre", "Minka Yvette", "Kamga Paul"][i % 5] + ` ${i + 1}`,
    matricule: `24G${1000 + i}`,
    class: "6ème A", // Added class
    average: Number((Math.random() * 10 + 8).toFixed(2)),
    rank: i + 1,
    status: Math.random() > 0.8 ? "Redoublant" : "Nouveau",
    absences: Math.floor(Math.random() * 5),
    grades: {
        math: Number((Math.random() * 10 + 8).toFixed(1)),
        fr: Number((Math.random() * 10 + 8).toFixed(1)),
        ang: Number((Math.random() * 10 + 8).toFixed(1)),
        hist: Number((Math.random() * 10 + 8).toFixed(1)),
    },
    decision: undefined // Start undefined
}));

export default function AdminGradesDetailPage() {
    const params = useParams(); // Get class ID
    const router = useRouter(); // For back navigation
    const [searchTerm, setSearchTerm] = useState("");
    const [students, setStudents] = useState<any[]>(initialStudents); // Use state for students to update decisions

    // Modal States
    const [selectedStudent, setSelectedStudent] = useState<any>(null); // Single view
    const [isCouncilModalOpen, setIsCouncilModalOpen] = useState(false); // Council config
    const [isBatchPrintOpen, setIsBatchPrintOpen] = useState(false); // Batch print view

    const sequenceId = "SEQ1"; // This would come from URL or context in real app

    // Determine Sequence Info (Mock)
    let sequenceInfo = { name: "Séquence 1", trimester: "1er Trimestre", type: "sequence" };
    if (params.id === 'T1' || params.id === 'T2' || params.id === 'T3') {
        sequenceInfo = { name: `${params.id.slice(1)}ème Trimestre`, trimester: `${params.id.slice(1)}ème Trimestre`, type: "trimester" };
    } else if (params.id === 'ANN') {
        sequenceInfo = { name: "Résultat Annuel", trimester: "Annuel", type: "annual" };
    }

    const handleCouncilSave = (updatedStudents: any[]) => {
        setStudents(updatedStudents);
        // In real app, you would PATCH this to backend
        console.log("Updated decisions:", updatedStudents.filter(s => s.decision));
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()} className="h-10 w-10 rounded-full border-zinc-200 hover:bg-zinc-100">
                        <ArrowLeft size={18} className="text-zinc-600" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
                            {classInfo.name}
                            <Badge variant="outline" className="text-zinc-500 border-zinc-300">
                                {classInfo.studentsCount} Élèves
                            </Badge>
                        </h1>
                        <p className="text-zinc-500 text-sm mt-1">
                            Gestion des notes • {sequenceInfo.name} • PP: {classInfo.mainTeacher}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 gap-2"
                        onClick={() => setIsCouncilModalOpen(true)}
                    >
                        <Settings2 size={16} />
                        Conseil de Classe
                    </Button>
                    <Button variant="outline" size="sm" className="bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 gap-2">
                        <Download size={16} />
                        Exporter Excel
                    </Button>
                    <Button
                        size="sm"
                        className="bg-primary-blue hover:bg-blue-600 text-white gap-2"
                        onClick={() => setIsBatchPrintOpen(true)}
                    >
                        <Printer size={16} />
                        Bulletins (Tout)
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 rounded-lg">
                        <TrendingUp className="text-emerald-500" size={24} />
                    </div>
                    <div>
                        <div className="text-sm text-zinc-500">Moyenne Classe</div>
                        <div className="text-xl font-bold text-zinc-900">{classInfo.average}/20</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <Trophy className="text-blue-500" size={24} />
                    </div>
                    <div>
                        <div className="text-sm text-zinc-500">Meilleure Note</div>
                        <div className="text-xl font-bold text-zinc-900">{classInfo.topScore}/20</div>
                        <div className="text-xs text-zinc-500">{classInfo.topStudent}</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-red-50 rounded-lg">
                        <AlertTriangle className="text-red-500" size={24} />
                    </div>
                    <div>
                        <div className="text-sm text-zinc-500">À Risque (Moy &lt; 10)</div>
                        <div className="text-xl font-bold text-zinc-900">
                            {students.filter(s => s.average < 10).length} Élèves
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-50 rounded-lg">
                        <CheckCircle2 className="text-amber-500" size={24} />
                    </div>
                    <div>
                        <div className="text-sm text-zinc-500">Taux Réussite</div>
                        <div className="text-xl font-bold text-zinc-900">{classInfo.successRate}%</div>
                    </div>
                </div>
            </div>

            {/* Main Content: Student List */}
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                {/* Toolbar */}
                <div className="p-4 border-b border-zinc-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Rechercher un élève..."
                            className="bg-zinc-50 border-zinc-200 pl-9 text-zinc-900 focus:border-primary-blue/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 gap-2">
                            <Filter size={16} /> Filtrer
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-500 uppercase bg-zinc-50/50">
                            <tr>
                                <th className="px-6 py-4 font-medium">Rang</th>
                                <th className="px-6 py-4 font-medium">Élèves</th>
                                <th className="px-6 py-4 font-medium text-center">Maths</th>
                                <th className="px-6 py-4 font-medium text-center">Français</th>
                                <th className="px-6 py-4 font-medium text-center">Anglais</th>
                                <th className="px-6 py-4 font-medium text-center">Hist-Géo</th>
                                <th className="px-6 py-4 font-medium text-center cursor-pointer hover:text-black flex items-center justify-center gap-1">
                                    Moyenne <ArrowUpDown size={12} />
                                </th>
                                <th className="px-6 py-4 font-medium text-center">Statut</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200">
                            {students
                                .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map((student) => (
                                    <tr
                                        key={student.id}
                                        className="hover:bg-zinc-50 transition-colors group cursor-pointer"
                                        onClick={() => setSelectedStudent(student)}
                                    >
                                        <td className="px-6 py-4 font-medium text-zinc-500">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold
                                            ${student.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                                                    student.rank === 2 ? 'bg-zinc-200 text-zinc-600' :
                                                        student.rank === 3 ? 'bg-amber-100 text-amber-700' : 'bg-zinc-100 text-zinc-500'
                                                }`}
                                            >
                                                {student.rank}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-zinc-900">{student.name}</div>
                                            <div className="text-xs text-zinc-500">{student.matricule}</div>
                                        </td>
                                        {/* Subject Grades */}
                                        <td className="px-6 py-4 text-center text-zinc-600">{student.grades.math}</td>
                                        <td className="px-6 py-4 text-center text-zinc-600">{student.grades.fr}</td>
                                        <td className="px-6 py-4 text-center text-zinc-600">{student.grades.ang}</td>
                                        <td className="px-6 py-4 text-center text-zinc-600">{student.grades.hist}</td>

                                        {/* Average */}
                                        <td className="px-6 py-4 text-center">
                                            <Badge variant="outline" className={`
                                            ${student.average >= 10
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                                    : 'bg-red-50 text-red-600 border-red-200'}
                                        `}>
                                                {student.average}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`text-xs px-2 py-1 rounded-full ${student.status === "Nouveau" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"
                                                }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreVertical size={16} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Placeholder) */}
                <div className="p-4 border-t border-zinc-200 flex justify-between items-center text-sm text-zinc-500">
                    <div>Affichage 1 à {students.length} sur {students.length} élèves</div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled className="border-zinc-200 bg-transparent text-zinc-400">Précédent</Button>
                        <Button variant="outline" size="sm" disabled className="border-zinc-200 bg-transparent text-zinc-400">Suivant</Button>
                    </div>
                </div>
            </div>

            {/* Render Council Decisions Modal */}
            {isCouncilModalOpen && (
                <CouncilDecisionsModal
                    students={students}
                    onClose={() => setIsCouncilModalOpen(false)}
                    onSave={handleCouncilSave}
                />
            )}

            {/* Render Single Student Report Card (Preview) */}
            {selectedStudent && (
                <StudentReportCardModal
                    student={selectedStudent}
                    grades={mockGrades}
                    onClose={() => setSelectedStudent(null)}
                    sequenceInfo={sequenceInfo}
                />
            )}

            {/* Render Batch Print Report Card */}
            {isBatchPrintOpen && (
                <StudentReportCardModal
                    students={students} // Pass ALL students
                    grades={mockGrades}
                    onClose={() => setIsBatchPrintOpen(false)}
                    sequenceInfo={sequenceInfo}
                />
            )}

        </div>
    );
}
