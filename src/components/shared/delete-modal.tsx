"use client";

import { AlertTriangle, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    itemName?: string;
}

export function DeleteModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    itemName
}: DeleteModalProps) {
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
                "fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300",
                isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={cn(
                    "relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform",
                    isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
                )}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-2">
                            <AlertTriangle size={32} />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                {description}
                                {itemName && (
                                    <span className="block mt-2 font-bold text-red-600 bg-red-50 py-1 px-3 rounded-lg inline-block">
                                        {itemName}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-8">
                        <Button
                            variant="outline"
                            className="flex-1 h-12 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                            onClick={onClose}
                        >
                            Annuler
                        </Button>
                        <Button
                            className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white border-none font-bold shadow-lg shadow-red-200 flex items-center justify-center gap-2"
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                        >
                            <Trash2 size={18} /> Supprimer
                        </Button>
                    </div>
                </div>

                <div className="bg-slate-50 px-8 py-3 text-center border-t border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        Action irréversible
                    </p>
                </div>
            </div>
        </div>
    );
}
