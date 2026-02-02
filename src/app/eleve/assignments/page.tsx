"use client";

import { useState } from "react";
import { FileText, Clock, CheckCircle2, AlertCircle, Upload, ChevronRight, File, Paperclip, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function StudentAssignmentsPage() {
    const [assignments] = useState([
        { id: 1, title: "Dissertation de Français", subject: "Français", due: "24 Déc 2025", status: "pending", priority: "high", description: "Rédiger une dissertation sur le thème de la solitude dans 'La Peste' de Camus." },
        { id: 2, title: "Exercices Trigonométrie", subject: "Mathématiques", due: "26 Déc 2025", status: "submitted", priority: "medium", description: "Faire les exercices 12 à 18 page 45 du manuel." },
        { id: 3, title: "Rapport de TP SVT", subject: "SVT", due: "28 Déc 2025", status: "graded", mark: "15/20", priority: "low", description: "Compte rendu de l'observation microscopique." },
        { id: 4, title: "History Project", subject: "History", due: "05 Jan 2026", status: "pending", priority: "medium", description: "Recherche sur la guerre froide." },
    ]);

    const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
    const [dragActive, setDragActive] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);

    const pendingAssignments = assignments.filter(a => a.status === 'pending');
    const submittedAssignments = assignments.filter(a => a.status === 'submitted' || a.status === 'graded');

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setUploadedFile(e.dataTransfer.files[0].name);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadedFile(e.target.files[0].name);
        }
    };

    const StatusIcon = ({ status }: { status: string }) => {
        switch (status) {
            case "submitted": return <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckCircle2 size={16} /></div>;
            case "graded": return <div className="w-8 h-8 rounded-full bg-blue-50 text-primary-blue flex items-center justify-center"><FileText size={16} /></div>;
            default: return <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center"><Clock size={16} /></div>;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Mes Devoirs</h1>
                <p className="text-slate-500">Gérez vos rendus et consultez vos notes.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* List Column */}
                <div className={cn("space-y-6 transition-all duration-300", selectedAssignment ? "hidden lg:block lg:col-span-7" : "col-span-1 lg:col-span-12")}>
                    <Tabs defaultValue="todo" className="w-full">
                        <TabsList className="bg-slate-100 p-1 rounded-xl w-full sm:w-auto mb-6">
                            <TabsTrigger value="todo" className="w-1/2 sm:w-auto px-6 py-2 rounded-lg text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-primary-blue data-[state=active]:shadow-sm text-slate-500">
                                À Faire <span className="ml-2 bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full text-[10px]">{pendingAssignments.length}</span>
                            </TabsTrigger>
                            <TabsTrigger value="done" className="w-1/2 sm:w-auto px-6 py-2 rounded-lg text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-primary-blue data-[state=active]:shadow-sm text-slate-500">
                                Terminés / Notés <span className="ml-2 bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full text-[10px]">{submittedAssignments.length}</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="todo" className="space-y-4">
                            {pendingAssignments.map((hw) => (
                                <Card
                                    key={hw.id}
                                    className={cn(
                                        "cursor-pointer hover:border-primary-blue/30 transition-all hover:shadow-md group",
                                        selectedAssignment?.id === hw.id ? "border-primary-blue shadow-md ring-1 ring-primary-blue" : ""
                                    )}
                                    onClick={() => { setSelectedAssignment(hw); setUploadedFile(null); }}
                                >
                                    <CardContent className="p-5 flex items-start gap-4">
                                        <StatusIcon status={hw.status} />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-slate-900 group-hover:text-primary-blue transition-colors">{hw.title}</h3>
                                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">{hw.subject}</p>
                                                </div>
                                                {hw.priority === 'high' && (
                                                    <span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-1 rounded-full font-black uppercase tracking-tight flex items-center gap-1">
                                                        <AlertCircle size={10} /> Urgent
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 font-medium">
                                                <span className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">
                                                    <Clock size={12} /> Échéance : {hw.due}
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} className="text-slate-300 group-hover:text-primary-blue self-center" />
                                    </CardContent>
                                </Card>
                            ))}
                        </TabsContent>

                        <TabsContent value="done" className="space-y-4">
                            {submittedAssignments.map((hw) => (
                                <Card key={hw.id} className="opacity-75 hover:opacity-100 transition-opacity">
                                    <CardContent className="p-5 flex items-center gap-4">
                                        <StatusIcon status={hw.status} />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-900 line-through decoration-slate-300">{hw.title}</h3>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{hw.subject}</p>
                                        </div>
                                        {hw.status === 'graded' && (
                                            <div className="text-right">
                                                <span className="text-xl font-black text-slate-900">{hw.mark}</span>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">Note</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Detail / Upload Column */}
                {selectedAssignment && (
                    <div className="lg:col-span-5 animate-in slide-in-from-right-4 duration-500 lg:sticky lg:top-24 h-fit col-span-1">
                        <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-6 relative">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 hover:bg-white"
                                    onClick={() => setSelectedAssignment(null)}
                                >
                                    <X size={18} />
                                </Button>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-blue bg-blue-50 px-2 py-1 rounded w-fit">
                                        {selectedAssignment.subject}
                                    </span>
                                    <CardTitle className="text-xl leading-tight pt-2">{selectedAssignment.title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <h4 className="text-sm font-bold text-slate-900">Instructions</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                                        {selectedAssignment.description}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                        <Upload size={16} /> Rendre mon devoir
                                    </h4>

                                    {!uploadedFile ? (
                                        <div
                                            className={cn(
                                                "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer",
                                                dragActive ? "border-primary-blue bg-blue-50 scale-[0.99]" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                            )}
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                            onClick={() => document.getElementById('file-upload')?.click()}
                                        >
                                            <input
                                                id="file-upload"
                                                type="file"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
                                                <Paperclip size={20} />
                                            </div>
                                            <p className="text-sm font-bold text-slate-700">Cliquez ou glissez un fichier</p>
                                            <p className="text-xs text-slate-400 mt-1">PDF, Word, Images (Max 5MB)</p>
                                        </div>
                                    ) : (
                                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-white text-emerald-600 flex items-center justify-center shadow-sm">
                                                    <FileText size={20} />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-bold text-slate-900 truncate max-w-[150px]">{uploadedFile}</p>
                                                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Prêt à envoyer</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500" onClick={() => setUploadedFile(null)}>
                                                <X size={18} />
                                            </Button>
                                        </div>
                                    )}

                                    <Button className="w-full font-bold shadow-lg shadow-blue-200" disabled={!uploadedFile}>
                                        Confirmer l'envoi
                                    </Button>
                                    <p className="text-center text-[10px] text-slate-400">
                                        Assurez-vous d'avoir bien relu votre travail avant d'envoyer.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
