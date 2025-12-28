
import { useState } from "react";
import { X, Save, AlertCircle, Check, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Student {
    id: number;
    name: string;
    matricule: string;
    average: number;
    decision?: string; // Existing override
}

interface CouncilDecisionsModalProps {
    students: Student[];
    onClose: () => void;
    onSave: (updatedStudents: Student[]) => void;
}

const DECISION_OPTIONS = [
    "Félicitations",
    "Tableau d'Honneur",
    "Encouragements",
    "Avertissement Travail",
    "Avertissement Conduite",
    "Blâme Travail",
    "Blâme Conduite",
    "Exclusion Temporaire",
    "Aucune"
];

export default function CouncilDecisionsModal({ students, onClose, onSave }: CouncilDecisionsModalProps) {
    // Local state to track modifications
    const [localStudents, setLocalStudents] = useState<Student[]>(
        // Deep copy potentially or just map to ensure we have fresh objects
        students.map(s => ({ ...s }))
    );

    // Auto-calculate logic (frontend simulation of backend logic)
    const getAutoDecision = (avg: number) => {
        if (avg >= 16) return "Félicitations";
        if (avg >= 14) return "Tableau d'Honneur";
        if (avg >= 12) return "Encouragements";
        if (avg < 8) return "Blâme Travail";
        if (avg < 10) return "Avertissement Travail";
        return "Aucune";
    };

    const handleDecisionChange = (id: number, newDecision: string) => {
        setLocalStudents(prev => prev.map(s =>
            s.id === id ? { ...s, decision: newDecision } : s
        ));
    };

    const handleSave = () => {
        onSave(localStudents);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm px-8">
            <div className="bg-white rounded-xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl border border-zinc-200">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-zinc-200">
                    <div>
                        <h2 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
                            <Settings2 className="text-primary-blue" />
                            Conseil de Classe
                        </h2>
                        <p className="text-zinc-500 text-sm mt-1">
                            Validation des décisions et appréciations pour les bulletins.
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-zinc-100 text-zinc-500">
                        <X size={24} />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden p-6 flex flex-col gap-4">

                    {/* Stats / Rules Summary Strip */}
                    <div className="grid grid-cols-4 gap-4 mb-2">
                        <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                            <div className="text-xs text-zinc-500 uppercase font-bold">Effectif</div>
                            <div className="text-2xl font-bold text-zinc-900">{students.length}</div>
                        </div>
                        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                            <div className="text-xs text-emerald-600 uppercase font-bold">Félicitations</div>
                            <div className="text-2xl font-bold text-emerald-600">
                                {localStudents.filter(s => (s.decision || getAutoDecision(s.average)) === "Félicitations").length}
                            </div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <div className="text-xs text-blue-600 uppercase font-bold">Tableau H.</div>
                            <div className="text-2xl font-bold text-blue-600">
                                {localStudents.filter(s => (s.decision || getAutoDecision(s.average)) === "Tableau d'Honneur").length}
                            </div>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                            <div className="text-xs text-red-600 uppercase font-bold">À Risque</div>
                            <div className="text-2xl font-bold text-red-600">
                                {localStudents.filter(s => s.average < 10).length}
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="flex-1 overflow-auto rounded-lg border border-zinc-200 bg-white custom-scrollbar">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 sticky top-0 z-10 border-b border-zinc-200">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Élève</th>
                                    <th className="px-6 py-3 font-medium text-center">Moyenne</th>
                                    <th className="px-6 py-3 font-medium">Décision Suggérée (Auto)</th>
                                    <th className="px-6 py-3 font-medium">Décision Finale</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200">
                                {localStudents.map((student) => {
                                    const autoDecision = getAutoDecision(student.average);
                                    const currentDecision = student.decision || autoDecision;
                                    const isModified = student.decision && student.decision !== autoDecision;

                                    return (
                                        <tr key={student.id} className="hover:bg-zinc-50 transition-colors">
                                            <td className="px-6 py-3 font-medium text-zinc-900">
                                                {student.name}
                                                <div className="text-xs text-zinc-500 font-mono">{student.matricule}</div>
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <span className={cn(
                                                    "font-bold px-2 py-1 rounded text-xs",
                                                    student.average >= 14 ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                                                        student.average >= 10 ? "bg-blue-50 text-blue-600 border border-blue-200" :
                                                            "bg-red-50 text-red-600 border border-red-200"
                                                )}>
                                                    {student.average.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-zinc-500">
                                                {autoDecision}
                                            </td>
                                            <td className="px-6 py-3">
                                                <div className="relative">
                                                    <select
                                                        className={cn(
                                                            "bg-white border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 appearance-none cursor-pointer",
                                                            isModified ? "border-amber-500 ring-1 ring-amber-500/20 text-amber-700" : "border-zinc-300 text-zinc-900"
                                                        )}
                                                        value={currentDecision}
                                                        onChange={(e) => handleDecisionChange(student.id, e.target.value)}
                                                    >
                                                        {DECISION_OPTIONS.map(opt => (
                                                            <option key={opt} value={opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                    {isModified && (
                                                        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none">
                                                            <div className="h-2 w-2 rounded-full bg-amber-500 shadow-sm"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-zinc-200 flex justify-end gap-3 bg-zinc-50 rounded-b-xl">
                    <Button variant="ghost" onClick={onClose} className="text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200">
                        Annuler
                    </Button>
                    <Button onClick={handleSave} className="bg-primary-blue hover:bg-blue-600 text-white gap-2 px-6">
                        <Save size={18} />
                        Enregistrer les Décisions
                    </Button>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e4e4e7; 
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #d4d4d8; 
                }
            `}</style>
        </div>
    );
}
