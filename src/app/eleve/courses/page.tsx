"use client";

import { Book, FileText, Download, Search, MoreVertical, Eye, Folder } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function StudentCoursesPage() {
    const folders = ["Mathématiques", "Physique", "Français", "Anglais", "SVT"];
    const documents = [
        { title: "Cours_Equations_Log.pdf", size: "1.2 MB", type: "PDF", subject: "Maths", date: "23 Déc 2025" },
        { title: "TP_Physique_Energie.docx", size: "850 KB", type: "DOCX", subject: "Physique", date: "21 Déc 2025" },
        { title: "Lecture_Antigone.pdf", size: "4.5 MB", type: "PDF", subject: "Français", date: "15 Déc 2025" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Ressources & Supports</h1>
                    <p className="text-slate-500">Accédez à vos cours, polycopiés et supports partagés.</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <Input placeholder="Rechercher un document..." className="pl-10" />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Dossiers par Matière</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {folders.map((folder, i) => (
                        <Card key={i} className="hover:border-primary-blue hover:bg-blue-50/30 cursor-pointer transition-all group">
                            <CardContent className="p-4 flex items-center gap-3">
                                <Folder size={24} className="text-amber-500 group-hover:scale-110 transition-transform" />
                                <span className="font-bold text-slate-800 text-sm truncate">{folder}</span>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Documents Récents</CardTitle>
                    <CardDescription>Derniers fichiers ajoutés par vos enseignants.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {documents.map((doc, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                                <div className="w-12 h-12 rounded-lg bg-blue-50 text-primary-blue flex items-center justify-center shrink-0">
                                    <FileText size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-800 truncate">{doc.title}</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                                        {doc.subject} • {doc.size} • Ajouté le {doc.date}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" className="h-9 w-9 text-slate-400 hover:text-primary-blue">
                                        <Eye size={18} />
                                    </Button>
                                    <Button variant="outline" size="icon" className="h-9 w-9 text-slate-400 hover:text-emerald-600">
                                        <Download size={18} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
