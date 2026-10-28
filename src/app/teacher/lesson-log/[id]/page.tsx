"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Edit, Trash2, Calendar, Clock, BookOpen, FileText, CheckCircle2, XCircle, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LessonLogDetailPage() {
    const router = useRouter();
    const params = useParams();
    const logId = params.id;
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Mock data - en production, ceci viendrait d'une API
    const logDetails = {
        "1": {
            id: 1,
            date: "2025-12-23",
            class: "6ème A",
            classId: "1",
            subject: "Mathématiques",
            teacher: "M. NKOMO Paul",
            title: "Equations du Second Degré",
            duration: "2h",
            content: `## Points abordés

1. **Introduction aux équations du second degré**
   - Forme générale : ax² + bx + c = 0
   - Identification des coefficients a, b, c

2. **Méthode de résolution par discriminant (Δ)**
   - Calcul du discriminant : Δ = b² - 4ac
   - Les trois cas possibles selon le signe de Δ
   - Formules des solutions

3. **Exercices d'application**
   - Exercices 1 à 4 page 38 (résolution guidée)
   - Exercices 5 à 8 page 42 (travail en groupe)

## Support utilisé
- Manuel scolaire pages 38-42
- Tableau noir pour démonstrations
- Calculatrice scientifique`,
            homework: `**À rendre pour le 28/12/2025**

- Exercices 9 à 12 page 43 (obligatoire)
- Exercice 15 page 44 (bonus pour les plus rapides)
- Réviser les formules du cours pour contrôle la semaine prochaine`,
            observations: `**Points positifs :**
- Bonne participation générale
- Les élèves ont bien compris le concept du discriminant

**Difficultés rencontrées :**
- 3 élèves absents (KAMGA, BELLA, FOTSO)
- Certains élèves confondent les signes dans la formule
- Le temps manquait pour terminer l'exercice 8

**À prévoir :**
- Séance de rattrapage pour les absents
- Révision des signes avec les élèves en difficulté`,
            status: "Validé",
            validatedBy: "M. NKOMO Paul",
            validatedAt: "2025-12-23T14:30:00",
            createdAt: "2025-12-23T14:15:00",
        },
        "2": {
            id: 2,
            date: "2025-12-22",
            class: "3ème B",
            classId: "2",
            subject: "Physique",
            teacher: "M. NKOMO Paul",
            title: "Introduction à la Trigonométrie",
            duration: "2h",
            content: `## Programme de la séance

1. Cercle trigonométrique
2. Définition de sinus et cosinus
3. Valeurs remarquables`,
            homework: "TD n°3 à rendre lundi",
            observations: "Classe très attentive",
            status: "Validé",
            validatedBy: "M. NKOMO Paul",
            validatedAt: "2025-12-22T16:00:00",
            createdAt: "2025-12-22T15:45:00",
        },
        "3": {
            id: 3,
            date: "2025-12-20",
            class: "Terminale S",
            classId: "3",
            subject: "Mathématiques",
            teacher: "M. NKOMO Paul",
            title: "Limites et Continuité",
            duration: "3h",
            content: `## Chapitre 5 : Limites et Continuité

**Partie 1 : Limites**
- Notion intuitive de limite
- Limites finies et infinies
- Opérations sur les limites

**Partie 2 : Continuité**
- Définition de la continuité en un point
- Théorème des valeurs intermédiaires`,
            homework: "Exercices 1-4 page 125",
            observations: "Séance dense. À revoir certains points la prochaine fois.",
            status: "En attente",
            validatedBy: null,
            validatedAt: null,
            createdAt: "2025-12-20T17:00:00",
        },
    }[logId as string];

    if (!logDetails) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-slate-500">Cahier de texte introuvable</p>
                    <Button onClick={() => router.back()} className="mt-4">Retour</Button>
                </div>
            </div>
        );
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDelete = () => {
        console.log("Suppression du cahier de texte:", logId);
        router.back();
    };

    const handleValidate = () => {
        console.log("Validation du cahier de texte:", logId);
        // Mettre à jour le statut
        router.back();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-500 border border-slate-200 bg-white">
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{logDetails.title}</h1>
                        <p className="text-slate-500 flex items-center gap-2 mt-1">
                            <span className="font-semibold text-primary-blue">{logDetails.class}</span>
                            • {logDetails.subject} • {formatDate(logDetails.date)}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={cn(
                        "px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider flex items-center gap-2",
                        logDetails.status === "Validé"
                            ? "text-emerald-700 bg-emerald-100"
                            : "text-amber-700 bg-amber-100"
                    )}>
                        {logDetails.status === "Validé" ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                        {logDetails.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Session Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="text-primary-blue" size={20} />
                                Informations de la Séance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date</p>
                                    <p className="text-sm font-bold text-slate-900 mt-1">{formatDate(logDetails.date)}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Classe</p>
                                    <p className="text-sm font-bold text-slate-900 mt-1">{logDetails.class}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Matière</p>
                                    <p className="text-sm font-bold text-slate-900 mt-1">{logDetails.subject}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Durée</p>
                                    <p className="text-sm font-bold text-slate-900 mt-1">{logDetails.duration}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content Covered */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="text-primary-blue" size={20} />
                                Contenu Abordé
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-sm max-w-none">
                                <div className="whitespace-pre-wrap text-slate-700 text-sm leading-relaxed">
                                    {logDetails.content}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Homework */}
                    {logDetails.homework && (
                        <Card className="border-primary-blue/30 bg-blue-50/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary-blue">
                                    <FileText size={20} />
                                    Devoirs Donnés
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="whitespace-pre-wrap text-slate-700 text-sm leading-relaxed">
                                    {logDetails.homework}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Observations */}
                    {logDetails.observations && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="text-primary-blue" size={20} />
                                    Observations
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="whitespace-pre-wrap text-slate-700 text-sm leading-relaxed">
                                    {logDetails.observations}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {logDetails.status === "En attente" && (
                                <Button
                                    onClick={handleValidate}
                                    className="w-full bg-success-green hover:bg-emerald-600 flex items-center gap-2"
                                >
                                    <CheckCircle2 size={18} />
                                    Valider
                                </Button>
                            )}
                            <Button variant="outline" className="w-full flex items-center gap-2">
                                <Edit size={18} />
                                Modifier
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-2"
                                onClick={() => setShowDeleteModal(true)}
                            >
                                <Trash2 size={18} />
                                Supprimer
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Metadata */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Métadonnées</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-xs">
                            <div>
                                <p className="text-slate-400 font-bold uppercase tracking-wider">Créé le</p>
                                <p className="text-slate-700 mt-1">{formatDateTime(logDetails.createdAt)}</p>
                            </div>
                            {logDetails.status === "Validé" && logDetails.validatedAt && (
                                <div>
                                    <p className="text-slate-400 font-bold uppercase tracking-wider">Validé le</p>
                                    <p className="text-slate-700 mt-1">{formatDateTime(logDetails.validatedAt)}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-slate-400 font-bold uppercase tracking-wider">Enseignant</p>
                                <p className="text-slate-700 mt-1 flex items-center gap-2">
                                    <User size={14} />
                                    {logDetails.teacher}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="max-w-md w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-600">
                                <XCircle size={20} />
                                Confirmer la suppression
                            </CardTitle>
                            <CardDescription>
                                Êtes-vous sûr de vouloir supprimer ce cahier de texte ? Cette action est irréversible.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1"
                            >
                                Annuler
                            </Button>
                            <Button
                                onClick={handleDelete}
                                className="flex-1 bg-red-600 hover:bg-red-700"
                            >
                                Supprimer
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
