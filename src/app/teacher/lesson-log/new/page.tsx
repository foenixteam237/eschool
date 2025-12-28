"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Calendar, BookOpen, FileText, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewLessonLogPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        class: "",
        duration: "2",
        topic: "",
        contentCovered: "",
        homework: "",
        observations: "",
    });

    const classes = [
        { id: "1", name: "6ème A" },
        { id: "2", name: "3ème B" },
        { id: "3", name: "Terminale S" },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Nouvelle séance:", formData);
        router.back();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-500 border border-slate-200 bg-white">
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Nouvelle Séance</h1>
                    <p className="text-slate-500">Enregistrez le contenu de votre cours</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="text-primary-blue" size={20} />
                                    Informations de la Séance
                                </CardTitle>
                                <CardDescription>Date, classe et durée du cours</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Date</label>
                                        <Input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            required
                                            className="border-slate-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Classe</label>
                                        <select
                                            value={formData.class}
                                            onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                                            required
                                            className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue"
                                        >
                                            <option value="">Sélectionner...</option>
                                            {classes.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Durée (heures)</label>
                                        <Input
                                            type="number"
                                            min="1"
                                            max="8"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            required
                                            className="border-slate-200"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="text-primary-blue" size={20} />
                                    Contenu du Cours
                                </CardTitle>
                                <CardDescription>Thème et points abordés</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Thème / Titre de la Séance *</label>
                                    <Input
                                        type="text"
                                        placeholder="Ex: Equations du Second Degré"
                                        value={formData.topic}
                                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                        required
                                        className="border-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Contenu Abordé *</label>
                                    <textarea
                                        placeholder="Décrivez les points principaux du cours (chapitres, exercices, exemples...)"
                                        value={formData.contentCovered}
                                        onChange={(e) => setFormData({ ...formData, contentCovered: e.target.value })}
                                        required
                                        rows={6}
                                        className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue resize-none"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="text-primary-blue" size={20} />
                                    Devoirs & Observations
                                </CardTitle>
                                <CardDescription>Travaux à faire et remarques</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Devoirs Donnés</label>
                                    <textarea
                                        placeholder="Ex: Exercices 5 et 6 page 42, TD n°3..."
                                        value={formData.homework}
                                        onChange={(e) => setFormData({ ...formData, homework: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Observations</label>
                                    <textarea
                                        placeholder="Remarques sur la séance, difficultés rencontrées, absences notables..."
                                        value={formData.observations}
                                        onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue resize-none"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="border-primary-blue/20 bg-blue-50/30">
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2 text-primary-blue">
                                    <AlertCircle size={16} />
                                    Conseils
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-xs text-slate-600">
                                <p>• <strong>Soyez précis</strong> dans la description du contenu abordé</p>
                                <p>• Mentionnez les <strong>pages du manuel</strong> utilisées</p>
                                <p>• Notez les <strong>difficultés</strong> rencontrées par les élèves</p>
                                <p>• Précisez la <strong>date limite</strong> pour les devoirs</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button type="submit" className="w-full bg-success-green hover:bg-emerald-600 flex items-center gap-2">
                                    <Save size={18} />
                                    Enregistrer
                                </Button>
                                <Button type="button" variant="outline" onClick={() => router.back()} className="w-full">
                                    Annuler
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
}
