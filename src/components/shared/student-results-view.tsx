"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Award, ChevronRight, FileDown, Printer, School } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Fragment } from "react";
import { gradesService } from "@/services/grades.service";
import { authService } from "@/services/auth.service";
import { Grade } from "@/types";
import { toast } from "react-toastify";

interface StudentResultsViewProps {
    studentName?: string;
    studentClass?: string;
    hideHeader?: boolean;
}

export function StudentResultsView({ studentName, studentClass, hideHeader = false }: StudentResultsViewProps) {
    const [grades, setGrades] = useState<Grade[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [studentInfo, setStudentInfo] = useState({
        name: studentName || "Étudiant",
        class: studentClass || "N/A",
        email: "",
        schoolYear: new Date().getFullYear().toString(),
    });
    const [stats, setStats] = useState({
        average: 0,
        min: 0,
        max: 0,
        total: 0,
    });

    useEffect(() => {
        loadStudentResults();
    }, []);

    const loadStudentResults = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get current student profile
            const profile = await authService.getProfile();
            setStudentInfo(prev => ({
                ...prev,
                name: `${profile.firstName || profile.nom || ''} ${profile.lastName || profile.prenom || ''}`.trim() || prev.name,
                email: profile.email,
            }));

            // Fetch grades
            const result = await gradesService.getGradesByStudent(profile.id);
            setGrades(result);

            // Calculate statistics
            if (result.length > 0) {
                const values = result.map(g => g.value);
                const sum = values.reduce((a, b) => a + b, 0);
                const average = sum / values.length;
                
                setStats({
                    average: parseFloat(average.toFixed(2)),
                    min: Math.min(...values),
                    max: Math.max(...values),
                    total: result.length,
                });
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur lors du chargement des résultats';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="text-center py-12">
                    <p className="text-slate-600">Chargement de vos résultats...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-8">
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4">
                        <p className="text-red-700">{error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Group grades by subject
    const gradesBySubject = grades.reduce((acc: Record<string, Grade[]>, grade) => {
        const subject = grade.subjectId || 'Autre';
        if (!acc[subject]) acc[subject] = [];
        acc[subject].push(grade);
        return acc;
    }, {});

    return (
        <div className="space-y-8 print:w-full print:max-w-none print:p-0">
            {!hideHeader && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Mes Résultats</h1>
                        <p className="text-slate-500">{studentInfo.schoolYear} • Année scolaire</p>
                    </div>
                    <Button className="bg-primary-blue flex items-center gap-2" onClick={() => window.print()}>
                        <Printer size={18} /> Imprimer
                    </Button>
                </div>
            )}

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-4">
                        <div className="text-center">
                            <TrendingUp className="mx-auto mb-2 text-blue-600" size={24} />
                            <p className="text-sm text-slate-600 mb-1">Moyenne Générale</p>
                            <p className="text-3xl font-bold text-blue-600">{stats.average}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-4">
                        <div className="text-center">
                            <Award className="mx-auto mb-2 text-green-600" size={24} />
                            <p className="text-sm text-slate-600 mb-1">Meilleure Note</p>
                            <p className="text-3xl font-bold text-green-600">{stats.max}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-4">
                        <div className="text-center">
                            <div className="mx-auto mb-2 text-orange-600">▼</div>
                            <p className="text-sm text-slate-600 mb-1">Note Minimale</p>
                            <p className="text-3xl font-bold text-orange-600">{stats.min}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-4">
                        <div className="text-center">
                            <div className="mx-auto mb-2 text-purple-600 text-2xl">📊</div>
                            <p className="text-sm text-slate-600 mb-1">Total Notes</p>
                            <p className="text-3xl font-bold text-purple-600">{stats.total}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Détails des notes */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Détail des Notes par Matière</CardTitle>
                </CardHeader>
                <CardContent>
                    {Object.entries(gradesBySubject).length > 0 ? (
                        <div className="space-y-6">
                            {Object.entries(gradesBySubject).map(([subject, subjectGrades]) => (
                                <div key={subject}>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">{subject}</h3>
                                    <div className="divide-y divide-slate-100">
                                        {subjectGrades.map((grade) => (
                                            <div key={grade.id} className="py-3 flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-slate-900">{grade.gradeType || 'Note'}</p>
                                                    <p className="text-sm text-slate-500">{new Date(grade.date).toLocaleDateString('fr-FR')}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-blue-600">{grade.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-600 text-center py-8">Aucune note disponible</p>
                    )}
                </CardContent>
            </Card>

            {/* Informations étudiant */}
            <Card className="border-slate-200 shadow-sm text-sm">
                <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-slate-600 mb-1">Nom</p>
                            <p className="font-semibold text-slate-900">{studentInfo.name}</p>
                        </div>
                        <div>
                            <p className="text-slate-600 mb-1">Email</p>
                            <p className="font-semibold text-slate-900">{studentInfo.email}</p>
                        </div>
                        <div>
                            <p className="text-slate-600 mb-1">Année Scolaire</p>
                            <p className="font-semibold text-slate-900">{studentInfo.schoolYear}</p>
                        </div>
                        <div>
                            <p className="text-slate-600 mb-1">Date</p>
                            <p className="font-semibold text-slate-900">{new Date().toLocaleDateString('fr-FR')}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}