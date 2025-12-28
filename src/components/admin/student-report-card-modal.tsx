"use client";

import React from "react";
import { X, Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Student {
    id: number;
    name: string;
    matricule: string;
    class: string;
    average: number;
    rank: number;
    status: string;
    absences?: number; // Added for batch logic
    decision?: string; // Added for overridden decision
}

interface StudentReportCardModalProps {
    student?: Student; // Optional now
    students?: Student[]; // New prop for batch
    grades?: any[]; // Keep simple for now, in real app would be per student
    sequenceInfo: {
        name: string;
        trimester: string;
        type?: string;
    };
    onClose: () => void;
    councilRules?: any; // To pass rules later
}

export default function StudentReportCardModal({ student, students, grades = [], sequenceInfo, onClose }: StudentReportCardModalProps) {
    // Determine list to render: either the single student in an array, or the batch list
    const studentsToRender = students || (student ? [student] : []);

    // Mock grades generator if not provided (since we passed global grades before)
    // In a real app, grades would be keyed by student ID. 
    // Here we'll just reuse the same mock grades for demo, slightly randomized if we wanted but let's keep consistent for now.

    const getAppreciation = (grade: number) => {
        if (grade >= 18) return "Excellent";
        if (grade >= 16) return "Très Bien";
        if (grade >= 14) return "Bien";
        if (grade >= 12) return "Assez Bien";
        if (grade >= 10) return "Passable";
        if (grade >= 8) return "Insuffisant";
        return "Faible";
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm no-print" onClick={onClose}>
            {/* Main Container */}
            <div
                className="bg-zinc-800 rounded-lg w-full max-w-[1050px] h-[95vh] flex flex-col shadow-2xl overflow-hidden no-print-container"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Toolbar */}
                <div className="bg-zinc-900 text-white px-6 py-4 flex justify-between items-center shrink-0 border-b border-zinc-700 no-print">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary-blue/20 p-2 rounded-lg">
                            <Printer className="text-primary-blue" size={20} />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg leading-tight">
                                {studentsToRender.length > 1 ? `Impression en lot (${studentsToRender.length} bulletins)` : "Aperçu du Bulletin"}
                            </h2>
                            <p className="text-xs text-zinc-400">
                                {studentsToRender.length > 1 ? `${sequenceInfo.name} • ${studentsToRender.length} élèves` : `${studentsToRender[0]?.name} • ${sequenceInfo.name}`}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button size="sm" variant="outline" className="gap-2 bg-zinc-800 border-zinc-600 text-white hover:bg-zinc-700">
                            <Download size={16} /> PDF
                        </Button>
                        <Button size="sm" className="gap-2 bg-primary-blue hover:bg-blue-700 text-white" onClick={handlePrint}>
                            <Printer size={16} /> Imprimer {studentsToRender.length > 1 ? "Tout" : ""}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={onClose} className="hover:bg-zinc-700 text-zinc-400 hover:text-white ml-2">
                            <X size={20} />
                        </Button>
                    </div>
                </div>

                {/* Scrollable Paper Container */}
                <div className="overflow-y-auto flex-1 p-8 bg-zinc-800 flex justify-center custom-scrollbar no-print-scrollbar">

                    <div className="flex flex-col gap-8 print:block print:gap-0">
                        {studentsToRender.map((currentStudent, index) => {
                            // Recalculate generic stats for this student demo
                            // In real app, 'grades' would probably come from currentStudent.grades
                            // We will simulate slight variation or just use the passed grades for now
                            const currentGrades = grades; // Using passed Mock grades
                            const totalPoints = currentGrades.reduce((sum, g) => sum + (g.grade * g.coef), 0);
                            const totalCoefs = currentGrades.reduce((sum, g) => sum + g.coef, 0);
                            // Use student's pre-calculated average if available for consistency with the list
                            const average = currentStudent.average.toFixed(2);

                            const groupedGrades = {
                                "GROUPE 1: SCIENTIFIQUE & TECHNIQUE": currentGrades.slice(0, 3).map(g => ({ ...g, skills: "S'approprier les concepts fondamentaux" })),
                                "GROUPE 2: LITTERAIRE & LINGUISTIQUE": currentGrades.slice(3, 5).map(g => ({ ...g, skills: "Communiquer efficacement à l'écrit/oral" })),
                                "GROUPE 3: SCIENCES HUMAINES & DIVERS": currentGrades.slice(5).map(g => ({ ...g, skills: "Comprendre le monde contemporain" })),
                            };

                            return (
                                /* A4 Paper Wrapper */
                                <div key={currentStudent.id} className="bg-white w-[210mm] min-h-[297mm] shadow-xl p-[10mm] text-black relative flex flex-col font-[Times_New_Roman] printable-content box-border mb-8 print:mb-0 print:break-after-page">

                                    {/* 1. Header Block */}
                                    <div className="flex justify-between items-start text-center uppercase leading-[1.1]">
                                        {/* Left: French Header */}
                                        <div className="w-[35%] space-y-[2px]">
                                            <p className="font-bold text-[10px]">République du Cameroun</p>
                                            <p className="text-[9px]">Paix - Travail - Patrie</p>
                                            <p className="text-[9px] mt-1">Ministère des Enseignements Secondaires</p>
                                            <p className="text-[9px]">Région du Centre</p>
                                            <p className="text-[9px]">Délégation Départementale du Mfoundi</p>
                                            <p className="font-black text-[11px] mt-1">LYCÉE BILINGUE D'EXCELLENCE</p>
                                            <p className="text-[9px]">B.P. 1234 YAOUNDÉ</p>
                                        </div>

                                        {/* Center: Logo */}
                                        <div className="flex-1 flex flex-col items-center justify-start -mt-2">
                                            <div className="w-[80px] h-[80px] rounded-full border-[3px] border-double border-black flex items-center justify-center p-1 mb-1">
                                                <div className="text-center">
                                                    <span className="block text-[24px] leading-none">🦅</span>
                                                </div>
                                            </div>
                                            <div className="text-[8px] italic font-bold">Discipline - Travail - Succès</div>
                                        </div>

                                        {/* Right: English Header */}
                                        <div className="w-[35%] space-y-[2px]">
                                            <p className="font-bold text-[10px]">Republic of Cameroon</p>
                                            <p className="text-[9px]">Peace - Work - Fatherland</p>
                                            <p className="text-[9px] mt-1">Ministry of Secondary Education</p>
                                            <p className="text-[9px]">Center Region</p>
                                            <p className="text-[9px]">Mfoundi Divisional Delegation</p>
                                            <p className="font-black text-[11px] mt-1">GOVERNMENT BILINGUAL HIGH SCHOOL</p>
                                            <p className="text-[9px]">P.O. BOX 1234 YAOUNDE</p>
                                        </div>
                                    </div>

                                    {/* 2. Bulletin Title */}
                                    <div className="mt-4 border-[2px] border-black bg-zinc-100 py-2 text-center rounded-sm">
                                        <h1 className="text-xl font-black uppercase tracking-widest scale-x-110">
                                            {sequenceInfo.type === 'annual'
                                                ? "BULLETIN ANNUEL DE NOTES"
                                                : `BULLETIN DE NOTES ${sequenceInfo.type === 'sequence' ? 'DE LA' : 'DU'} ${sequenceInfo.name.toUpperCase()}`
                                            }
                                        </h1>
                                        <p className="text-sm font-bold italic mt-1">Année Scolaire 2024 - 2025</p>
                                    </div>

                                    {/* 3. Student Details Box */}
                                    <div className="mt-4 border-2 border-black p-3 relative text-[11px]">
                                        {/* Photos & QR */}
                                        <div className="absolute top-2 left-2 w-16 h-16 border border-black flex items-center justify-center bg-white p-1">
                                            <div className="w-full h-full bg-black flex items-center justify-center text-white text-[8px] text-center font-mono leading-tight">
                                                SCAN<br />QR
                                            </div>
                                        </div>
                                        <div className="absolute top-2 right-2 w-20 h-24 border border-black bg-zinc-50 flex items-center justify-center">
                                            <span className="text-3xl grayscale opacity-50">👤</span>
                                        </div>

                                        {/* Info Grid */}
                                        <div className="ml-[70px] mr-[85px] space-y-[6px]">
                                            <div className="flex items-baseline">
                                                <span className="font-bold w-24">Noms & Prénoms :</span>
                                                <span className="font-black text-sm uppercase flex-1 border-b border-black border-dotted pl-2">{currentStudent.name}</span>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="flex-1 flex items-baseline">
                                                    <span className="font-bold w-24">Né(e) le :</span>
                                                    <span className="font-medium flex-1 border-b border-black border-dotted pl-2">12 Février 2010</span>
                                                    <span className="font-bold px-2">à</span>
                                                    <span className="font-medium w-32 border-b border-black border-dotted">Yaoundé</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="w-1/2 flex items-baseline">
                                                    <span className="font-bold w-12">Classe :</span>
                                                    <span className="font-black flex-1 border-b border-black border-dotted pl-2 uppercase">{currentStudent.class}</span>
                                                </div>
                                                <div className="w-1/2 flex items-baseline">
                                                    <span className="font-bold w-16">Matricule :</span>
                                                    <span className="font-bold font-mono flex-1 border-b border-black border-dotted pl-2">{currentStudent.matricule}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="w-1/3 flex items-baseline">
                                                    <span className="font-bold w-12">Sexe :</span>
                                                    <span className="font-medium flex-1 border-b border-black border-dotted pl-2">Masculin</span>
                                                </div>
                                                <div className="w-1/3 flex items-baseline">
                                                    <span className="font-bold w-20">Redoublant :</span>
                                                    <span className="font-medium flex-1 border-b border-black border-dotted pl-2">Non</span>
                                                </div>
                                                <div className="w-1/3 flex items-baseline">
                                                    <span className="font-bold w-20">Effectif :</span>
                                                    <span className="font-medium flex-1 border-b border-black border-dotted pl-2">45</span>
                                                </div>
                                            </div>
                                            <div className="flex items-baseline pt-1">
                                                <span className="font-bold w-32 shrink-0">Professeur Principal :</span>
                                                <span className="font-bold uppercase flex-1 border-b border-black border-dotted pl-2 text-[10px]">M. TCHAPTCHET ROGER</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 4. Grades Table */}
                                    <div className="mt-4">
                                        <table className="w-full border-collapse border-[1.5px] border-black text-[10px]">
                                            <thead>
                                                <tr className="bg-white uppercase text-[9px]">
                                                    <th className="border border-black p-1 text-left w-[30%]">Matières / Enseignants</th>
                                                    <th className="border border-black p-1 text-center w-[25%]">Compétences Visées</th>
                                                    <th className="border border-black p-1 text-center w-[6%]">Note<br />/20</th>
                                                    <th className="border border-black p-1 text-center w-[6%]">Coef</th>
                                                    <th className="border border-black p-1 text-center w-[7%]">Total</th>
                                                    <th className="border border-black p-1 text-center w-[12%]">Appréciation</th>
                                                    <th className="border border-black p-1 text-center w-[6%]">Rang</th>
                                                    <th className="border border-black p-1 text-center w-[8%]">Signature</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(groupedGrades).map(([groupName, groupGrades]) => {
                                                    const groupTotalPoints = groupGrades.reduce((sum, g) => sum + (g.grade * g.coef), 0);
                                                    const groupTotalCoefs = groupGrades.reduce((sum, g) => sum + g.coef, 0);
                                                    const groupAverage = groupTotalCoefs > 0 ? (groupTotalPoints / groupTotalCoefs).toFixed(2) : "0.00";

                                                    return (
                                                        <React.Fragment key={groupName}>
                                                            {/* Group Header */}
                                                            <tr className="bg-white">
                                                                <td colSpan={8} className="border border-black px-2 py-[2px] font-bold text-[9px] uppercase tracking-wide">
                                                                    {groupName}
                                                                </td>
                                                            </tr>

                                                            {/* Subject Rows */}
                                                            {groupGrades.map((g, idx) => (
                                                                <tr key={idx} className="leading-tight">
                                                                    <td className="border border-black px-2 py-1">
                                                                        <div className="font-bold uppercase text-[9px]">{g.subject}</div>
                                                                        <div className="text-[8px] text-zinc-600 uppercase">{g.teacher}</div>
                                                                    </td>
                                                                    <td className="border border-black px-2 py-1 italic text-[8.5px] text-center align-middle">
                                                                        {g.skills}
                                                                    </td>
                                                                    <td className={cn(
                                                                        "border border-black text-center font-bold align-middle text-[10px]",
                                                                        g.grade < 10 ? "text-red-600" : "text-black"
                                                                    )}>
                                                                        {g.grade.toFixed(2)}
                                                                    </td>
                                                                    <td className="border border-black text-center align-middle">
                                                                        {g.coef}
                                                                    </td>
                                                                    <td className="border border-black text-center font-bold align-middle">
                                                                        {(g.grade * g.coef).toFixed(2)}
                                                                    </td>
                                                                    <td className="border border-black text-center text-[9px] align-middle uppercase">
                                                                        {getAppreciation(g.grade)}
                                                                    </td>
                                                                    <td className="border border-black text-center text-[9px] align-middle">
                                                                        {Math.ceil(Math.random() * 5)}e
                                                                    </td>
                                                                    <td className="border border-black"></td>
                                                                </tr>
                                                            ))}

                                                            {/* Group Summary */}
                                                            <tr className="bg-white font-bold border-b-2 border-black">
                                                                <td className="border border-black px-2 py-[2px] text-right text-[9px] italic" colSpan={2}>
                                                                    Moyenne du Groupe :
                                                                </td>
                                                                <td className={cn(
                                                                    "border border-black text-center text-[10px]",
                                                                    Number(groupAverage) < 10 ? "text-red-600" : ""
                                                                )}>
                                                                    {groupAverage}
                                                                </td>
                                                                <td className="border border-black text-center text-[10px]">
                                                                    {groupTotalCoefs}
                                                                </td>
                                                                <td className="border border-black text-center text-[10px]">
                                                                    {groupTotalPoints.toFixed(2)}
                                                                </td>
                                                                <td colSpan={3} className="border border-black"></td>
                                                            </tr>
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </tbody>
                                            <tfoot>
                                                <tr className="border-t-[2px] border-black bg-white">
                                                    <td colSpan={2} className="border border-black px-2 py-1 text-right font-black uppercase text-[10px]">
                                                        Totaux Généraux
                                                    </td>
                                                    <td className="border border-black bg-white"></td>
                                                    <td className="border border-black text-center font-black text-[11px]">
                                                        {totalCoefs}
                                                    </td>
                                                    <td className="border border-black text-center font-black text-[11px]">
                                                        {totalPoints.toFixed(2)}
                                                    </td>
                                                    <td colSpan={3} className="border border-black bg-white"></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>

                                    {/* 5. Footer Summary Block */}
                                    <div className="text-[10px] flex border-2 border-t-0 border-black mb-0">

                                        {/* LEFT: Stats & Discipline */}
                                        <div className="w-[55%] flex flex-col border-r border-black font-serif">

                                            {/* Top: Period Averages */}
                                            <div className="flex border-b border-black">
                                                <div className="w-1/2 border-r border-black p-2 flex flex-col items-center justify-center bg-white py-4">
                                                    <span className="font-bold uppercase text-[9px] mb-2">Moyenne {sequenceInfo.type === 'annual' ? 'Annuelle' : 'Trimestrielle'}</span>
                                                    <div className="border-2 border-black px-6 py-2 rounded bg-white font-black text-2xl mb-2 shadow-sm">
                                                        {average} <span className="text-[10px] font-normal text-zinc-500">/20</span>
                                                    </div>
                                                    <div className="flex w-full justify-between px-1 text-[10px] font-bold">
                                                        <span>Rang: {currentStudent.rank}e / 45</span>
                                                        <span className="uppercase">{getAppreciation(Number(average))}</span>
                                                    </div>
                                                </div>
                                                <div className="w-1/2 p-2 relative overflow-hidden flex flex-col min-h-[100px]">
                                                    <div className="font-bold underline mb-2">Appréciation Globale :</div>
                                                    <div className="flex-1 flex items-center justify-center">
                                                        <div className="font-handwriting text-2xl text-blue-700 -rotate-6 opacity-90 text-center leading-tight">
                                                            {Number(average) >= 14 ? "Excellent Travail,\ncontinuez ainsi !" : Number(average) >= 10 ? "Travail Satisfaisant,\ncontinuez !" : "Insuffisant,\ndoit faire mieux."}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bottom: Discipline & Reminders */}
                                            <div className="flex bg-white flex-1">
                                                <div className="w-2/3 border-r border-black p-2">
                                                    <table className="w-full text-[9px] border-collapse">
                                                        <thead className="bg-white">
                                                            <tr>
                                                                <th className="border border-black px-1 text-left py-1">Discipline</th>
                                                                <th className="border border-black px-1 w-10 text-center">Nbr</th>
                                                                <th className="border border-black px-1 w-10 text-center">Just.</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td className="border border-black px-1 py-1">Absences (h)</td>
                                                                <td className="border border-black text-center font-bold">{currentStudent.absences || 2}</td>
                                                                <td className="border border-black text-center">-</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="border border-black px-1 py-1">Retards</td>
                                                                <td className="border border-black text-center font-bold">1</td>
                                                                <td className="border border-black bg-white"></td>
                                                            </tr>
                                                            <tr>
                                                                <td className="border border-black px-1 py-1">Punitions</td>
                                                                <td className="border border-black text-center font-bold">0</td>
                                                                <td className="border border-black bg-white"></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="w-1/3 flex flex-col justify-center items-center bg-white p-2 text-center">
                                                    <span className="font-bold text-[9px] mb-1">Moy. Annuelle</span>
                                                    <div className="font-black text-xl text-zinc-400 border border-dashed border-zinc-400 rounded px-2 py-1 bg-white">
                                                        --.--
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* RIGHT: Council & Signatures */}
                                        <div className="w-[45%] flex flex-col bg-white">
                                            {/* Top: Decisions */}
                                            <div className="flex-1 border-b border-black flex">
                                                <div className="w-1/2 border-r border-black p-2 flex flex-col justify-center gap-[4px]">
                                                    <div className="font-bold underline mb-1 text-center">Décision du Conseil</div>
                                                    {["Tableau d'Honneur", "Encouragements", "Félicitations", "Avertissement", "Blâme"].map((d, i) => (
                                                        <div key={i} className="flex items-center gap-2 text-[9px]">
                                                            <div className={cn("w-3.5 h-3.5 border border-black flex items-center justify-center rounded-[2px]",
                                                                /* Automated Logic or Manual Override */
                                                                (currentStudent.decision === d) ||
                                                                    (!currentStudent.decision && i === 1 && Number(average) > 12) ? "bg-black text-white" : "bg-white"
                                                            )}>
                                                                {((currentStudent.decision === d) || (!currentStudent.decision && i === 1 && Number(average) > 12)) && "✓"}
                                                            </div>
                                                            <span className="truncate font-medium">{d}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="w-1/2 p-2 flex flex-col justify-center items-center bg-white">
                                                    <div className="font-bold text-center underline mb-2">Visa du Parent</div>
                                                    <div className="w-3/4 h-16 border border-black border-dashed rounded bg-white"></div>
                                                </div>
                                            </div>

                                            {/* Bottom: Proviseur */}
                                            <div className="h-[120px] p-3 relative flex flex-col justify-between">
                                                <div className="text-right italic text-[9px]">
                                                    Fait à Yaoundé, le {new Date().toLocaleDateString('fr-FR')}
                                                </div>
                                                <div className="font-bold text-right pr-4 text-[11px] underline">Le Proviseur</div>

                                                {/* Stamp */}
                                                <div className="absolute top-6 right-8 opacity-80 rotate-[-12deg] pointer-events-none">
                                                    <div className="w-[80px] h-[80px] rounded-full border-[3px] border-blue-900 text-blue-900 flex flex-col items-center justify-center text-[7px] font-bold leading-tight p-1 text-center bg-white/40 backdrop-blur-[0.5px]">
                                                        <span>REP. CAMEROUN</span>
                                                        <span>MINESEC</span>
                                                        <span className="text-[14px] my-[1px]">★</span>
                                                        <span>LE PROVISEUR</span>
                                                        <span>GBHS YDE</span>
                                                    </div>
                                                </div>

                                                {/* Signature */}
                                                <div className="absolute bottom-2 right-12 text-blue-900 font-handwriting text-xl -rotate-6 pointer-events-none">
                                                    M. Le Proviseur
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <style jsx global>{`
                    @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
                    
                    .font-handwriting {
                        font-family: 'Dancing Script', cursive;
                    }

                    .custom-scrollbar::-webkit-scrollbar {
                        width: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: #27272a;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #52525b; 
                        border-radius: 5px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #71717a; 
                    }

                    @media print {
                        @page {
                            margin: 0;
                            size: A4;
                        }
                        
                        body * {
                            visibility: hidden;
                        }

                        .printable-content, .printable-content * {
                            visibility: visible;
                        }

                        .printable-content {
                            position: relative; /* Changed from absolute to allow stacking */
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: auto; /* Let content flow */
                            min-height: 297mm;
                            margin: 0;
                            padding: 10mm;
                            box-shadow: none !important;
                            background: white !important;
                            print-color-adjust: exact;
                            -webkit-print-color-adjust: exact;
                            page-break-after: always;
                        }
                        
                        /* Remove break from last item if needed, but usually safe to have empty page at end if multiple */
                        .print\:break-after-page {
                            break-after: page;
                            page-break-after: always;
                        }

                        .no-print, .no-print-container, .no-print-scrollbar {
                            display: none !important;
                        }

                        /* Ensure background colors are printed */
                        * {
                            -webkit-print-color-adjust: exact !important;   /* Chrome, Safari */
                            print-color-adjust: exact !important;           /* Firefox */
                        }
                    }
                `}</style>
            </div>
        </div>
    );
}



