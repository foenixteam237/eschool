"use client";

import { X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { StudentResultsView } from "./student-results-view";

interface ResultsModalProps {
    isOpen: boolean;
    onClose: () => void;
    studentName: string;
    studentClass: string;
}

export function ResultsModal({
    isOpen,
    onClose,
    studentName,
    studentClass
}: ResultsModalProps) {
    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            document.body.style.overflow = "hidden";
        } else {
            const timer = setTimeout(() => setIsRendered(false), 300);
            document.body.style.overflow = "unset";
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isRendered && !isOpen) return null;

    return (
        <div
            className={cn(
                "fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 transition-all duration-300",
                isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={cn(
                    "relative w-full max-w-5xl max-h-full bg-slate-50 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 transform flex flex-col",
                    isOpen ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-10 opacity-0"
                )}
            >
                <div className="bg-white px-8 py-6 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary-blue/5 flex items-center justify-center text-primary-blue">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 leading-none">Relevé de Notes Complet</h3>
                            <p className="text-slate-500 text-sm mt-1 font-medium">{studentName} • <span className="text-primary-blue font-bold tracking-tight">{studentClass}</span></p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all active:scale-90"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <StudentResultsView
                        studentName={studentName}
                        studentClass={studentClass}
                        hideHeader={true}
                    />
                </div>

                <div className="bg-white px-8 py-4 border-t border-slate-100 text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                        Portail Administratif • GESTION DES RÉSULTATS
                    </p>
                </div>
            </div>
        </div>
    );
}
