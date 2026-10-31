"use client";

import { useState } from "react";
import Link from "next/link";
import {
    School,
    Plus,
    Search,
    MapPin,
    Users,
    GraduationCap,
    BookOpen,
    Award,
    Building2,
    Phone,
    Mail,
    FileText,
    ExternalLink,
    Filter,
    CheckCircle2,
    Briefcase
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Etablissement {
    id: string;
    codeMinesec: string;
    nom: string;
    type: "Lycée Général" | "Lycée Bilingue" | "Lycée Technique" | "Collège Privé";
    secteur: "Public" | "Privé Confessionnel" | "Privé Laïc";
    region: string;
    departement: string;
    arrondissement: string;
    proviseur: string;
    censeurPrincipal: string;
    contactPhone: string;
    contactEmail: string;
    effectifTotal: number;
    nombreClasses: number;
    nombreEnseignants: number;
    tauxReussiteExamens: {
        bepc: number;
        probatoire: number;
        bac: number;
    };
    series: string[];
    anneeCreation: number;
}

const initialEtablissements: Etablissement[] = [
    {
        id: "lgl-yaounde",
        codeMinesec: "MINESEC-CEN-MF-001",
        nom: "Lycée Général Leclerc (Yaoundé)",
        type: "Lycée Général",
        secteur: "Public",
        region: "Centre",
        departement: "Mfoundi",
        arrondissement: "Yaoundé III",
        proviseur: "Dr. MBARGA François",
        censeurPrincipal: "Mme NOAH Brigitte",
        contactPhone: "+237 222 22 14 30",
        contactEmail: "contact@lgl-yaounde.cm",
        effectifTotal: 3450,
        nombreClasses: 56,
        nombreEnseignants: 142,
        tauxReussiteExamens: { bepc: 88.5, probatoire: 76.2, bac: 82.4 },
        series: ["6ème à 3ème", "2nde A4/C", "1ère A4/C/D/TI", "Tle A4/C/D/TI"],
        anneeCreation: 1952
    },
    {
        id: "lbd-douala",
        codeMinesec: "MINESEC-LIT-WR-014",
        nom: "Lycée Bilingue de Deido (Douala)",
        type: "Lycée Bilingue",
        secteur: "Public",
        region: "Littoral",
        departement: "Wouri",
        arrondissement: "Douala I",
        proviseur: "M. TCHOUANFE André",
        censeurPrincipal: "Mr. TAH Gregory",
        contactPhone: "+237 233 42 10 05",
        contactEmail: "admin@lbd-deido.cm",
        effectifTotal: 2980,
        nombreClasses: 48,
        nombreEnseignants: 118,
        tauxReussiteExamens: { bepc: 91.0, probatoire: 79.5, bac: 85.1 },
        series: ["Francophone (6e-Tle)", "Anglophone (Form 1 - Upper 6th)", "Séries Scientifiques C/D", "Séries Littéraires A4"],
        anneeCreation: 1978
    },
    {
        id: "col-libermann",
        codeMinesec: "MINESEC-LIT-WR-045",
        nom: "Collège Libermann (Douala)",
        type: "Collège Privé",
        secteur: "Privé Confessionnel",
        region: "Littoral",
        departement: "Wouri",
        arrondissement: "Douala I",
        proviseur: "Père KAMGANG Jean-Paul (P.J.)",
        censeurPrincipal: "M. NOUBISSI Paul",
        contactPhone: "+237 233 42 28 89",
        contactEmail: "direction@college-libermann.org",
        effectifTotal: 1850,
        nombreClasses: 32,
        nombreEnseignants: 86,
        tauxReussiteExamens: { bepc: 99.2, probatoire: 96.5, bac: 98.4 },
        series: ["1er Cycle Excellence", "2nd Cycle C/D/A4/TI", "Laboratoire Robotique", "Section Internationale"],
        anneeCreation: 1952
    },
    {
        id: "lcb-bafoussam",
        codeMinesec: "MINESEC-OUE-MF-008",
        nom: "Lycée Classique de Bafoussam",
        type: "Lycée Général",
        secteur: "Public",
        region: "Ouest",
        departement: "Mifi",
        arrondissement: "Bafoussam I",
        proviseur: "M. FOTSO Jean-Bosco",
        censeurPrincipal: "Mme KENGNE Viviane",
        contactPhone: "+237 233 44 15 20",
        contactEmail: "contact@lc-bafoussam.cm",
        effectifTotal: 2640,
        nombreClasses: 42,
        nombreEnseignants: 104,
        tauxReussiteExamens: { bepc: 86.4, probatoire: 74.8, bac: 80.2 },
        series: ["6ème à 3ème All/Esp", "2nde C/A4", "1ère C/D/TI", "Tle C/D/A4"],
        anneeCreation: 1965
    },
    {
        id: "lt-koumassi",
        codeMinesec: "MINESEC-LIT-WR-009",
        nom: "Lycée Technique de Douala-Koumassi",
        type: "Lycée Technique",
        secteur: "Public",
        region: "Littoral",
        departement: "Wouri",
        arrondissement: "Douala II",
        proviseur: "Ing. EBENDE Samuel",
        censeurPrincipal: "M. NJOYA Oumarou",
        contactPhone: "+237 233 43 02 18",
        contactEmail: "direction@lt-koumassi.cm",
        effectifTotal: 2410,
        nombreClasses: 38,
        nombreEnseignants: 98,
        tauxReussiteExamens: { bepc: 84.1, probatoire: 71.0, bac: 78.9 },
        series: ["Génie Électrique (F2/F3)", "Génie Civil (F4)", "Sciences Économiques (SES)", "Comptabilité Gestion (CG)"],
        anneeCreation: 1961
    }
];

export default function EtablissementsPage() {
    const [etablissements, setEtablissements] = useState<Etablissement[]>(initialEtablissements);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRegion, setSelectedRegion] = useState("all");
    const [selectedType, setSelectedType] = useState("all");
    const [selectedSchool, setSelectedSchool] = useState<Etablissement | null>(null);
    const [showNewModal, setShowNewModal] = useState(false);

    const [newForm, setNewForm] = useState({
        nom: "",
        codeMinesec: "",
        type: "Lycée Général" as Etablissement["type"],
        secteur: "Public" as Etablissement["secteur"],
        region: "Centre",
        departement: "",
        arrondissement: "",
        proviseur: "",
        contactPhone: "",
        contactEmail: "",
        effectifTotal: 1200,
        nombreClasses: 24,
        nombreEnseignants: 60,
    });

    const regions = ["Centre", "Littoral", "Ouest", "Nord", "Sud", "Est", "Sud-Ouest", "Nord-Ouest", "Adamaoua", "Extrême-Nord"];
    const types = ["Lycée Général", "Lycée Bilingue", "Lycée Technique", "Collège Privé"];

    const filtered = etablissements.filter((e) => {
        const matchesSearch =
            e.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.codeMinesec.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.proviseur.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.departement.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRegion = selectedRegion === "all" || e.region === selectedRegion;
        const matchesType = selectedType === "all" || e.type === selectedType;
        return matchesSearch && matchesRegion && matchesType;
    });

    const totalStudents = etablissements.reduce((acc, curr) => acc + curr.effectifTotal, 0);
    const totalClasses = etablissements.reduce((acc, curr) => acc + curr.nombreClasses, 0);
    const totalTeachers = etablissements.reduce((acc, curr) => acc + curr.nombreEnseignants, 0);

    const handleCreateSchool = (e: React.FormEvent) => {
        e.preventDefault();
        const school: Etablissement = {
            id: `sch-${Date.now()}`,
            codeMinesec: newForm.codeMinesec || `MINESEC-${newForm.region.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-3)}`,
            nom: newForm.nom,
            type: newForm.type,
            secteur: newForm.secteur,
            region: newForm.region,
            departement: newForm.departement || "Mfoundi",
            arrondissement: newForm.arrondissement || "Yaoundé",
            proviseur: newForm.proviseur || "M. le Proviseur",
            censeurPrincipal: "Censeur Principal",
            contactPhone: newForm.contactPhone || "+237 600 00 00 00",
            contactEmail: newForm.contactEmail || "contact@etablissement.cm",
            effectifTotal: Number(newForm.effectifTotal) || 800,
            nombreClasses: Number(newForm.nombreClasses) || 18,
            nombreEnseignants: Number(newForm.nombreEnseignants) || 45,
            tauxReussiteExamens: { bepc: 85, probatoire: 75, bac: 80 },
            series: ["1er Cycle (6e-3e)", "2nd Cycle (2nde-Tle)"],
            anneeCreation: new Date().getFullYear(),
        };

        setEtablissements([school, ...etablissements]);
        setShowNewModal(false);
        setNewForm({
            nom: "",
            codeMinesec: "",
            type: "Lycée Général",
            secteur: "Public",
            region: "Centre",
            departement: "",
            arrondissement: "",
            proviseur: "",
            contactPhone: "",
            contactEmail: "",
            effectifTotal: 1200,
            nombreClasses: 24,
            nombreEnseignants: 60,
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-16">
            {/* SuperAdmin Notification Callout */}
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                    <span className="font-bold text-indigo-900">Console SuperAdmin SaaS eSchool</span>
                    <p className="text-indigo-700 mt-0.5">
                        La souscription des écoles, le suivi des paiements d'abonnement et la gestion des tickets de support relèvent du portail SuperAdmin.
                    </p>
                </div>
                <Link href="/superadmin/dashboard">
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold whitespace-nowrap">
                        Accéder au Portail SuperAdmin
                    </Button>
                </Link>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary-blue text-white flex items-center justify-center shadow-lg shadow-blue-100">
                            <School size={26} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Établissements Secondaires</h1>
                            <p className="text-slate-500 text-sm">
                                Gestion pédagogique et administrative de l'établissement assigné (MINESEC)
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => setShowNewModal(true)}
                        className="bg-primary-blue hover:bg-blue-700 text-white shadow-lg shadow-blue-100 font-bold gap-2"
                    >
                        <Plus size={18} /> Nouvel Établissement
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-white border-l-4 border-l-primary-blue">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Établissements</span>
                            <div className="p-2 bg-blue-100 text-primary-blue rounded-lg">
                                <Building2 size={18} />
                            </div>
                        </div>
                        <p className="text-3xl font-black text-slate-900 mt-2">{etablissements.length}</p>
                        <p className="text-xs text-slate-400 mt-1">Lycées & Collèges référencés</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-gradient-to-br from-emerald-50 to-white border-l-4 border-l-emerald-500">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Effectif Global</span>
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                <Users size={18} />
                            </div>
                        </div>
                        <p className="text-3xl font-black text-slate-900 mt-2">{totalStudents.toLocaleString()} Élèves</p>
                        <p className="text-xs text-emerald-600 font-semibold mt-1">Tous campus confondus</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-gradient-to-br from-purple-50 to-white border-l-4 border-l-purple-500">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Divisions Pédagogiques</span>
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                <BookOpen size={18} />
                            </div>
                        </div>
                        <p className="text-3xl font-black text-slate-900 mt-2">{totalClasses} Classes</p>
                        <p className="text-xs text-slate-400 mt-1">1er & 2nd Cycle MINESEC</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-gradient-to-br from-amber-50 to-white border-l-4 border-l-amber-500">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Corps Enseignant</span>
                            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                                <GraduationCap size={18} />
                            </div>
                        </div>
                        <p className="text-3xl font-black text-slate-900 mt-2">{totalTeachers} Professeurs</p>
                        <p className="text-xs text-slate-400 mt-1">PLESG, PLETP, PCESG</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters & Search */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <Input
                                placeholder="Rechercher par nom, code MINESEC, ville ou proviseur..."
                                className="pl-10 h-11 bg-slate-50 border-slate-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <select
                                value={selectedRegion}
                                onChange={(e) => setSelectedRegion(e.target.value)}
                                className="h-11 px-3 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none"
                            >
                                <option value="all">Toutes les Régions</option>
                                {regions.map((r) => (
                                    <option key={r} value={r}>Région du {r}</option>
                                ))}
                            </select>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="h-11 px-3 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none"
                            >
                                <option value="all">Tous les Types</option>
                                {types.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Cards List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filtered.map((school) => (
                    <Card
                        key={school.id}
                        className="group hover:border-primary-blue/40 hover:shadow-lg transition-all duration-300 border-slate-200/80 overflow-hidden bg-white"
                    >
                        <CardHeader className="bg-slate-50/60 pb-4 border-b border-slate-100">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                        <Badge variant="outline" className="font-mono text-[10px] border-primary-blue/30 text-primary-blue bg-blue-50/50">
                                            {school.codeMinesec}
                                        </Badge>
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700">
                                            {school.type}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                            school.secteur === "Public" ? "bg-emerald-100 text-emerald-800" : "bg-purple-100 text-purple-800"
                                        }`}>
                                            {school.secteur}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-black text-slate-900 group-hover:text-primary-blue transition-colors">
                                        {school.nom}
                                    </h2>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                        <MapPin size={13} className="text-slate-400" />
                                        <span>{school.arrondissement}, Dép. {school.departement} • Région {school.region}</span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-5 space-y-5">
                            {/* Stats in Grid */}
                            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50/80 rounded-xl text-center border border-slate-100">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Élèves</p>
                                    <p className="text-lg font-black text-slate-900">{school.effectifTotal}</p>
                                </div>
                                <div className="border-x border-slate-200">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Classes</p>
                                    <p className="text-lg font-black text-slate-900">{school.nombreClasses}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Enseignants</p>
                                    <p className="text-lg font-black text-slate-900">{school.nombreEnseignants}</p>
                                </div>
                            </div>

                            {/* Administration Details */}
                            <div className="space-y-1.5 text-xs text-slate-600">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 font-medium">Chef d'Établissement / Proviseur :</span>
                                    <span className="font-bold text-slate-800">{school.proviseur}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 font-medium">Censeur Principal :</span>
                                    <span className="font-semibold text-slate-700">{school.censeurPrincipal}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 font-medium">Téléphone Intendance :</span>
                                    <span className="font-mono text-slate-700">{school.contactPhone}</span>
                                </div>
                            </div>

                            {/* Exam Success Rates */}
                            <div className="pt-2 border-t border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                    <Award size={12} className="text-amber-500" />
                                    Taux de réussite examens officiels MINESEC
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="p-2 rounded-lg bg-blue-50/60 text-center">
                                        <p className="text-[10px] font-bold text-slate-500">BEPC / CAP</p>
                                        <p className="text-sm font-black text-primary-blue">{school.tauxReussiteExamens.bepc}%</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-amber-50/60 text-center">
                                        <p className="text-[10px] font-bold text-slate-500">Probatoire</p>
                                        <p className="text-sm font-black text-amber-700">{school.tauxReussiteExamens.probatoire}%</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-emerald-50/60 text-center">
                                        <p className="text-[10px] font-bold text-slate-500">Baccalauréat</p>
                                        <p className="text-sm font-black text-emerald-700">{school.tauxReussiteExamens.bac}%</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Action Links */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedSchool(school)}
                                    className="text-xs text-slate-600 hover:text-primary-blue font-bold p-0 h-auto"
                                >
                                    Fiche détaillée MINESEC
                                </Button>
                                <div className="flex gap-2">
                                    <Link href={`/admin/students?schoolId=${school.id}`}>
                                        <Button variant="outline" size="sm" className="h-8 text-xs font-bold border-slate-200 hover:bg-blue-50 hover:text-primary-blue">
                                            <Users size={12} className="mr-1.5" /> Élèves ({school.effectifTotal})
                                        </Button>
                                    </Link>
                                    <Link href={`/admin/academics?schoolId=${school.id}`}>
                                        <Button size="sm" className="h-8 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white">
                                            <BookOpen size={12} className="mr-1.5" /> Classes ({school.nombreClasses})
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Modal Detail */}
            {selectedSchool && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="max-w-2xl w-full bg-white shadow-2xl border-none max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                        <CardHeader className="bg-slate-900 text-white relative p-6">
                            <span className="text-[10px] font-mono tracking-widest text-blue-300 uppercase">
                                Fiche Signalétique Officielle MINESEC
                            </span>
                            <h2 className="text-2xl font-black mt-1">{selectedSchool.nom}</h2>
                            <p className="text-xs text-slate-300">Code d'homologation : {selectedSchool.codeMinesec}</p>
                            <button
                                onClick={() => setSelectedSchool(null)}
                                className="absolute top-6 right-6 text-slate-400 hover:text-white text-lg font-bold"
                            >
                                ✕
                            </button>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Localisation</p>
                                    <p className="font-bold text-slate-800">{selectedSchool.arrondissement}</p>
                                    <p className="text-slate-600">Département du {selectedSchool.departement}</p>
                                    <p className="text-slate-600">Région du {selectedSchool.region}</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Administration</p>
                                    <p className="font-bold text-slate-800">{selectedSchool.proviseur}</p>
                                    <p className="text-slate-600">Fondé en {selectedSchool.anneeCreation}</p>
                                    <p className="text-slate-600">Statut : {selectedSchool.secteur}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Filières & Niveaux autorisés</h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {selectedSchool.series.map((s, idx) => (
                                        <span key={idx} className="px-2.5 py-1 bg-blue-50 text-primary-blue rounded-lg text-xs font-bold">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                                <Button variant="outline" onClick={() => setSelectedSchool(null)}>
                                    Fermer
                                </Button>
                                <Link href={`/admin/students?schoolId=${selectedSchool.id}`}>
                                    <Button className="bg-primary-blue font-bold">
                                        Consulter la liste des élèves
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Modal Nouvel Etablissement */}
            {showNewModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="max-w-2xl w-full bg-white shadow-2xl border-none max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                        <CardHeader className="bg-primary-blue text-white p-6">
                            <h2 className="text-2xl font-black">Ajouter un Établissement Scolaire</h2>
                            <p className="text-xs text-blue-100">Enregistrement dans le répertoire national des collèges et lycées</p>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleCreateSchool} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-600 uppercase">Nom de l'Établissement *</label>
                                    <Input
                                        placeholder="Ex: Lycée Bilingue de Biyem-Assi"
                                        required
                                        value={newForm.nom}
                                        onChange={(e) => setNewForm({ ...newForm, nom: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 uppercase">Code MINESEC</label>
                                        <Input
                                            placeholder="Ex: MINESEC-CEN-MF-042"
                                            value={newForm.codeMinesec}
                                            onChange={(e) => setNewForm({ ...newForm, codeMinesec: e.target.value })}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 uppercase">Type d'Établissement</label>
                                        <select
                                            value={newForm.type}
                                            onChange={(e) => setNewForm({ ...newForm, type: e.target.value as any })}
                                            className="w-full mt-1 h-10 px-3 border border-slate-200 rounded-md text-sm font-medium"
                                        >
                                            {types.map((t) => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 uppercase">Région</label>
                                        <select
                                            value={newForm.region}
                                            onChange={(e) => setNewForm({ ...newForm, region: e.target.value })}
                                            className="w-full mt-1 h-10 px-3 border border-slate-200 rounded-md text-sm font-medium"
                                        >
                                            {regions.map((r) => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 uppercase">Département</label>
                                        <Input
                                            placeholder="Ex: Mfoundi"
                                            value={newForm.departement}
                                            onChange={(e) => setNewForm({ ...newForm, departement: e.target.value })}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 uppercase">Arrondissement</label>
                                        <Input
                                            placeholder="Ex: Yaoundé VI"
                                            value={newForm.arrondissement}
                                            onChange={(e) => setNewForm({ ...newForm, arrondissement: e.target.value })}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 uppercase">Proviseur / Principal</label>
                                        <Input
                                            placeholder="Ex: M. EBOUE Michel"
                                            value={newForm.proviseur}
                                            onChange={(e) => setNewForm({ ...newForm, proviseur: e.target.value })}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 uppercase">Téléphone</label>
                                        <Input
                                            placeholder="+237 6XX XX XX XX"
                                            value={newForm.contactPhone}
                                            onChange={(e) => setNewForm({ ...newForm, contactPhone: e.target.value })}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 uppercase">Effectif Élèves</label>
                                        <Input
                                            type="number"
                                            value={newForm.effectifTotal}
                                            onChange={(e) => setNewForm({ ...newForm, effectifTotal: Number(e.target.value) })}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 uppercase">Nb Classes</label>
                                        <Input
                                            type="number"
                                            value={newForm.nombreClasses}
                                            onChange={(e) => setNewForm({ ...newForm, nombreClasses: Number(e.target.value) })}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 uppercase">Nb Enseignants</label>
                                        <Input
                                            type="number"
                                            value={newForm.nombreEnseignants}
                                            onChange={(e) => setNewForm({ ...newForm, nombreEnseignants: Number(e.target.value) })}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                                    <Button variant="outline" type="button" onClick={() => setShowNewModal(false)}>
                                        Annuler
                                    </Button>
                                    <Button type="submit" className="bg-primary-blue font-bold">
                                        Enregistrer l'établissement
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
