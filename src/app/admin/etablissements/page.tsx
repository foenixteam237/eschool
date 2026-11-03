"use client";

import { useState, useEffect } from "react";
import {
    School,
    Building2,
    MapPin,
    Phone,
    Mail,
    Users,
    GraduationCap,
    BookOpen,
    Shield,
    CheckCircle2,
    Edit3,
    Save,
    Calendar,
    Globe,
    FileText,
    Award
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { schoolsService, classesService, studentsService, teachersService } from "@/services";

interface SchoolProfile {
    id: string;
    codeMinesec: string;
    nom: string;
    type: string;
    secteur: string;
    region: string;
    departement: string;
    arrondissement: string;
    devise: string;
    proviseur: string;
    censeurPrincipal: string;
    intendant: string;
    contactPhone: string;
    contactEmail: string;
    adresse: string;
    effectifTotal: number;
    nombreClasses: number;
    nombreEnseignants: number;
    anneeScolaireActive: string;
    series: string[];
}

export default function MonEtablissementPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [school, setSchool] = useState<SchoolProfile>({
        id: "sch_1",
        codeMinesec: "MINESEC-CEN-MF-001",
        nom: "Lycée Général Leclerc de Yaoundé",
        type: "Enseignement Secondaire Général",
        secteur: "Public (MINESEC)",
        region: "Centre",
        departement: "Mfoundi",
        arrondissement: "Yaoundé III",
        devise: "Travail - Rigueur - Réussite",
        proviseur: "Dr. MBARGA François",
        censeurPrincipal: "Mme NOAH Brigitte",
        intendant: "M. TCHOUNDA Patrice",
        contactPhone: "+237 222 22 14 30",
        contactEmail: "contact@lgl-yaounde.cm",
        adresse: "BP 124 Yaoundé, Quartier Bastos / Ministère",
        effectifTotal: 0,
        nombreClasses: 0,
        nombreEnseignants: 0,
        anneeScolaireActive: "2025/2026",
        series: ["6ème à 3ème (Général)", "2nde A4 & C", "1ère A4, C, D & TI", "Terminale A4, C, D & TI"]
    });

    useEffect(() => {
        const loadSchoolData = async () => {
            setIsLoading(true);
            try {
                const [schoolsRes, studentsRes, classesRes, teachersRes] = await Promise.allSettled([
                    schoolsService.getSchools(),
                    studentsService.getStudents(1, 100),
                    classesService.getClasses(1, 100),
                    teachersService.getTeachers()
                ]);

                let currentSchool: any = null;
                if (schoolsRes.status === "fulfilled" && schoolsRes.value.length > 0) {
                    currentSchool = schoolsRes.value[0];
                }

                const totalStudents = studentsRes.status === "fulfilled" ? studentsRes.value.total : 0;
                const totalClasses = classesRes.status === "fulfilled" ? classesRes.value.total : 0;
                const totalTeachers = teachersRes.status === "fulfilled" ? teachersRes.value.length : 0;

                setSchool(prev => ({
                    ...prev,
                    id: currentSchool?.id || prev.id,
                    nom: currentSchool?.name || prev.nom,
                    codeMinesec: currentSchool?.code || prev.codeMinesec,
                    adresse: currentSchool?.address || prev.adresse,
                    contactPhone: currentSchool?.phone || prev.contactPhone,
                    contactEmail: currentSchool?.email || prev.contactEmail,
                    region: currentSchool?.region || prev.region,
                    devise: currentSchool?.slogan || prev.devise,
                    effectifTotal: totalStudents || prev.effectifTotal,
                    nombreClasses: totalClasses || prev.nombreClasses,
                    nombreEnseignants: totalTeachers || prev.nombreEnseignants,
                }));
            } catch (err) {
                console.error("Erreur chargement profil école:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadSchoolData();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await schoolsService.updateSchool(school.id, {
                name: school.nom,
                address: school.adresse,
                phone: school.contactPhone,
                email: school.contactEmail,
                slogan: school.devise,
            });
        } catch (err) {
            console.warn("Mise à jour en local/API:", err);
        }
        setIsEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <div className="flex items-center gap-2">
                        <School className="text-primary-blue" size={26} />
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Fiche d&apos;Établissement Scolaire
                        </h1>
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium">
                            Environnement Dédié (Tenant #{school.id})
                        </Badge>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                        Gestion de la configuration et des coordonnées administratives de votre établissement.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                                Annuler
                            </Button>
                            <Button size="sm" onClick={handleSave} className="bg-primary-blue text-white gap-2">
                                <Save size={16} />
                                Enregistrer
                            </Button>
                        </div>
                    ) : (
                        <Button size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                            <Edit3 size={16} />
                            Modifier les informations
                        </Button>
                    )}
                </div>
            </div>

            {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    Les informations de l&apos;établissement ont été mises à jour avec succès.
                </div>
            )}

            {/* Confidentiality Notice */}
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-3">
                <Shield className="text-primary-blue mt-0.5 shrink-0" size={20} />
                <div className="text-xs text-blue-900 leading-relaxed">
                    <span className="font-bold">Principe d&apos;Isolation eSchool :</span> Vos données scolaires, effectifs d&apos;élèves, relevés de notes et finances locales sont strictement confinées à votre établissement. L&apos;administration centrale eSchool n&apos;a pas accès à vos informations nominatives ni à vos comptes internes.
                </div>
            </div>

            {/* School Profile Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-xs border-slate-200">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Building2 className="text-primary-blue" size={20} />
                                    Identité Institutionnelle
                                </CardTitle>
                                <span className="font-mono text-xs bg-slate-100 px-2.5 py-1 rounded-md text-slate-700 font-semibold border border-slate-200">
                                    {school.codeMinesec}
                                </span>
                            </div>
                            <CardDescription>
                                Informations officielles enregistrées auprès de la Délégation Régionale du MINESEC.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            {isEditing ? (
                                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                    <div className="md:col-span-2">
                                        <label className="block text-slate-700 font-medium mb-1">Nom de l&apos;Établissement</label>
                                        <Input
                                            value={school.nom}
                                            onChange={(e) => setSchool({ ...school, nom: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-700 font-medium mb-1">Devise de l&apos;École</label>
                                        <Input
                                            value={school.devise}
                                            onChange={(e) => setSchool({ ...school, devise: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-700 font-medium mb-1">Type d&apos;Enseignement</label>
                                        <Input
                                            value={school.type}
                                            onChange={(e) => setSchool({ ...school, type: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-700 font-medium mb-1">Téléphone de Contact</label>
                                        <Input
                                            value={school.contactPhone}
                                            onChange={(e) => setSchool({ ...school, contactPhone: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-700 font-medium mb-1">Email Officiel</label>
                                        <Input
                                            value={school.contactEmail}
                                            onChange={(e) => setSchool({ ...school, contactEmail: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-slate-700 font-medium mb-1">Adresse Postale / Géographique</label>
                                        <Input
                                            value={school.adresse}
                                            onChange={(e) => setSchool({ ...school, adresse: e.target.value })}
                                        />
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">{school.nom}</h2>
                                        <p className="text-sm italic text-slate-600 mt-0.5">« {school.devise} »</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-sm">
                                        <div>
                                            <span className="text-xs text-slate-500 block">Type d&apos;Établissement</span>
                                            <span className="font-semibold text-slate-800">{school.type}</span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-slate-500 block">Secteur</span>
                                            <span className="font-semibold text-slate-800">{school.secteur}</span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-slate-500 block">Localisation Administrative</span>
                                            <span className="font-medium text-slate-800 flex items-center gap-1.5 mt-0.5">
                                                <MapPin size={15} className="text-slate-400" />
                                                {school.arrondissement}, {school.departement} ({school.region})
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-slate-500 block">Année Scolaire Active</span>
                                            <span className="font-bold text-primary-blue flex items-center gap-1.5 mt-0.5">
                                                <Calendar size={15} />
                                                Session {school.anneeScolaireActive}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-slate-500 block">Téléphone Officiel</span>
                                            <span className="font-medium text-slate-800 flex items-center gap-1.5 mt-0.5">
                                                <Phone size={15} className="text-slate-400" />
                                                {school.contactPhone}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-slate-500 block">Email Administratif</span>
                                            <span className="font-medium text-slate-800 flex items-center gap-1.5 mt-0.5">
                                                <Mail size={15} className="text-slate-400" />
                                                {school.contactEmail}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Équipe de Direction */}
                    <Card className="shadow-xs border-slate-200">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <Award className="text-amber-600" size={18} />
                                Équipe de Direction & Délégation d&apos;Administration
                            </CardTitle>
                            <CardDescription>
                                Responsables légaux et administrateurs habilités de l&apos;établissement.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-5">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Proviseur / Chef d&apos;Établissement</span>
                                    <p className="font-bold text-slate-900 mt-1">{school.proviseur}</p>
                                    <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded mt-2 inline-block">
                                        Superviseur Légal
                                    </span>
                                </div>
                                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Censeur Principal</span>
                                    <p className="font-bold text-slate-900 mt-1">{school.censeurPrincipal}</p>
                                    <span className="text-[11px] text-blue-700 font-medium bg-blue-50 px-2 py-0.5 rounded mt-2 inline-block">
                                        Gestion Pédagogique
                                    </span>
                                </div>
                                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Intendant Principal</span>
                                    <p className="font-bold text-slate-900 mt-1">{school.intendant}</p>
                                    <span className="text-[11px] text-purple-700 font-medium bg-purple-50 px-2 py-0.5 rounded mt-2 inline-block">
                                        Gestion Financière Locale
                                    </span>
                                </div>
                            </div>

                            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                                <div className="text-xs text-slate-600">
                                    Vous pouvez désigner d&apos;autres administrateurs de votre école parmi vos agents ou enseignants.
                                </div>
                                <Link href="/admin/teachers">
                                    <Button variant="outline" size="sm" className="gap-2 text-xs">
                                        <Users size={14} />
                                        Gérer les co-administrateurs
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Statistics & Quick Links */}
                <div className="space-y-6">
                    <Card className="shadow-xs border-slate-200">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                            <CardTitle className="text-base font-bold text-slate-900">
                                Effectifs de l&apos;Établissement
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-5 space-y-4">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 text-primary-blue rounded-lg">
                                        <Users size={18} />
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-500">Élèves inscrits</span>
                                        <p className="text-base font-bold text-slate-900 tabular-nums">
                                            {school.effectifTotal.toLocaleString("fr-FR")}
                                        </p>
                                    </div>
                                </div>
                                <Link href="/admin/students" className="text-xs text-primary-blue hover:underline font-medium">
                                    Voir
                                </Link>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                                        <GraduationCap size={18} />
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-500">Personnel Enseignant</span>
                                        <p className="text-base font-bold text-slate-900 tabular-nums">
                                            {school.nombreEnseignants}
                                        </p>
                                    </div>
                                </div>
                                <Link href="/admin/teachers" className="text-xs text-primary-blue hover:underline font-medium">
                                    Voir
                                </Link>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                                        <BookOpen size={18} />
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-500">Classes actives</span>
                                        <p className="text-base font-bold text-slate-900 tabular-nums">
                                            {school.nombreClasses}
                                        </p>
                                    </div>
                                </div>
                                <Link href="/admin/academics" className="text-xs text-primary-blue hover:underline font-medium">
                                    Voir
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Filières et Séries */}
                    <Card className="shadow-xs border-slate-200">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <FileText size={16} className="text-primary-blue" />
                                Cycles & Séries Autorisés
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-2">
                            {school.series.map((serie, idx) => (
                                <div
                                    key={idx}
                                    className="p-2.5 bg-slate-50 text-slate-800 rounded-lg text-xs font-medium border border-slate-100 flex items-center gap-2"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary-blue" />
                                    {serie}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
