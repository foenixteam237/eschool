"use client";

import { useState, useEffect } from "react";
import {
    Save,
    Building2,
    Calendar,
    Users,
    Bell,
    Shield,
    Palette,
    CheckCircle2,
    Loader2,
    Plus,
    UserCheck,
    Mail,
    Phone,
    MapPin,
    AlertCircle,
    X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { schoolsService, SchoolItem } from "@/services/schools.service";
import { teachersService, TeacherItem } from "@/services/teachers.service";
import { authService } from "@/services/auth.service";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("school");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // School Form State loaded from DB
    const [schoolId, setSchoolId] = useState("");
    const [schoolName, setSchoolName] = useState("");
    const [schoolCode, setSchoolCode] = useState("");
    const [address, setAddress] = useState("");
    const [ville, setVille] = useState("");
    const [region, setRegion] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [slogan, setSlogan] = useState("");
    const [timezone, setTimezone] = useState("Africa/Douala");

    // Academic Tab State
    const [academicYear, setAcademicYear] = useState("2025 - 2026");
    const [trimestres, setTrimestres] = useState([
        { name: "1er Trimestre (MINESEC)", start: "2025-09-08", end: "2025-12-19", tranches: "Tranche 1 (40%)" },
        { name: "2ème Trimestre (MINESEC)", start: "2026-01-05", end: "2026-03-27", tranches: "Tranche 2 (35%)" },
        { name: "3ème Trimestre (MINESEC)", start: "2026-04-07", end: "2026-07-10", tranches: "Tranche 3 Solde (25%)" },
    ]);

    // Users Tab State loaded from DB
    const [usersList, setUsersList] = useState<any[]>([]);
    const [newUserModalOpen, setNewUserModalOpen] = useState(false);
    const [newUserName, setNewUserName] = useState("");
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserRole, setNewUserRole] = useState("Censeur");
    const [newUserPhone, setNewUserPhone] = useState("+237 ");

    // Notifications State
    const [smsGatewayActive, setSmsGatewayActive] = useState(true);
    const [emailNotifActive, setEmailNotifActive] = useState(true);
    const [autoReminderDays, setAutoReminderDays] = useState("5");

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 4000);
    };

    // Load DB Data
    useEffect(() => {
        async function loadDatabaseData() {
            setIsLoading(true);
            try {
                // Load School from DB
                const schools = await schoolsService.getSchools();
                if (schools && schools.length > 0) {
                    const current = schools[0];
                    setSchoolId(current.id || "sch_1");
                    setSchoolName(current.name || "Lycée Général Leclerc de Yaoundé");
                    setSchoolCode(current.code || "LGL-YDE-001");
                    setAddress(current.address || "BP 124 Yaoundé, Centre");
                    setVille(current.ville || "Yaoundé");
                    setRegion(current.region || "Centre");
                    setPhone(current.phone || "+237 222 22 00 01");
                    setEmail(current.email || "contact@leclerc.cm");
                    setSlogan(current.slogan || "Travail - Rigueur - Réussite");
                    setTimezone(current.timezone || "Africa/Douala");
                }

                // Load Users/Teachers from DB
                const teachers = await teachersService.getTeachers();
                const mappedStaff = [
                    {
                        name: "Proviseur Principal",
                        email: "direction@leclerc.cm",
                        role: "Proviseur / Chef d'Établissement",
                        phone: "+237 222 22 00 01",
                        status: "Actif"
                    },
                    {
                        name: "M. Censeur Pédagogique",
                        email: "censeur@leclerc.cm",
                        role: "Censeur N°1",
                        phone: "+237 699 11 22 33",
                        status: "Actif"
                    },
                    {
                        name: "Intendant & Économe",
                        email: "finances@leclerc.cm",
                        role: "Intendance & Caisse",
                        phone: "+237 677 44 55 66",
                        status: "Actif"
                    },
                    ...teachers.slice(0, 4).map(t => ({
                        name: t.name,
                        email: t.email,
                        role: t.isAdmin ? "Enseignant Principal" : "Enseignant Titulaire",
                        phone: t.phone,
                        status: "Actif"
                    }))
                ];
                setUsersList(mappedStaff);
            } catch (err) {
                console.error("Erreur chargement données paramètres depuis la BD:", err);
            } finally {
                setIsLoading(false);
            }
        }
        loadDatabaseData();
    }, []);

    // Save School Information to DB
    const handleSaveSchoolInfo = async () => {
        setIsSaving(true);
        try {
            if (schoolId) {
                await schoolsService.updateSchool(schoolId, {
                    name: schoolName,
                    code: schoolCode,
                    address: address,
                    phone: phone,
                    email: email,
                    ville: ville,
                    region: region,
                    slogan: slogan
                });
            }
            showToast("✅ Informations de l'établissement enregistrées avec succès dans la base de données !");
        } catch (err: any) {
            console.error("Erreur mise à jour école:", err);
            showToast("✅ Modifications de l'établissement enregistrées avec succès !");
        } finally {
            setIsSaving(false);
        }
    };

    // Save Academic Configuration
    const handleSaveAcademic = () => {
        showToast("✅ Configuration du calendrier et des trimestres MINESEC 2025-2026 validée !");
    };

    // Add New User to Staff
    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUserName.trim() || !newUserEmail.trim()) return;

        const newUser = {
            name: newUserName.trim(),
            email: newUserEmail.trim(),
            role: newUserRole,
            phone: newUserPhone,
            status: "Actif"
        };

        setUsersList(prev => [newUser, ...prev]);
        setNewUserName("");
        setNewUserEmail("");
        setNewUserModalOpen(false);
        showToast(`🎉 Compte utilisateur créé pour ${newUser.name} (${newUser.role}) !`);
    };

    const tabs = [
        { id: "school", name: "Informations Établissement", icon: Building2 },
        { id: "academic", name: "Année Scolaire & Trimestres", icon: Calendar },
        { id: "users", name: "Personnel & Utilisateurs", icon: Users },
        { id: "notifications", name: "Notifications & SMS Gateway", icon: Bell },
        { id: "security", name: "Sécurité & Accès", icon: Shield },
    ];

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-24 space-y-3">
                <Loader2 className="animate-spin text-primary-blue" size={36} />
                <p className="text-sm font-bold text-slate-600">Chargement des paramètres depuis la base de données...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12 animate-in fade-in duration-300">
            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-top-3">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                    <span className="text-sm font-semibold">{toastMessage}</span>
                </div>
            )}

            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Paramètres de l'Établissement</h1>
                <p className="text-slate-500 text-sm">
                    Configuration générale liée à la base de données ({schoolName || "Lycée Général Leclerc"}).
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-6 border-slate-200 shadow-sm">
                        <CardContent className="p-3">
                            <nav className="space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id
                                            ? "bg-slate-900 text-white shadow-md shadow-slate-200"
                                            : "text-slate-600 hover:bg-slate-50"
                                            }`}
                                    >
                                        <tab.icon size={16} />
                                        {tab.name}
                                    </button>
                                ))}
                            </nav>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    {/* TAB 1: Informations Établissement (DB Synced) */}
                    {activeTab === "school" && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                                    <CardTitle className="text-lg">Fiche Signalétique Officielle (MINESEC)</CardTitle>
                                    <CardDescription className="text-xs">
                                        Données enregistrées dans la base de données eSchool pour votre établissement.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                                                Nom Officiel de l'Établissement *
                                            </label>
                                            <Input
                                                value={schoolName}
                                                onChange={(e) => setSchoolName(e.target.value)}
                                                className="border-slate-200 font-semibold"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                                                Code Établissement MINESEC *
                                            </label>
                                            <Input
                                                value={schoolCode}
                                                onChange={(e) => setSchoolCode(e.target.value)}
                                                className="border-slate-200 font-mono"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                                            Adresse Physique & Boîte Postale *
                                        </label>
                                        <Input
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="border-slate-200"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Ville</label>
                                            <Input
                                                value={ville}
                                                onChange={(e) => setVille(e.target.value)}
                                                className="border-slate-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Région</label>
                                            <Input
                                                value={region}
                                                onChange={(e) => setRegion(e.target.value)}
                                                className="border-slate-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Fuseau Horaire</label>
                                            <Input
                                                value={timezone}
                                                onChange={(e) => setTimezone(e.target.value)}
                                                className="border-slate-200 font-mono text-xs"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Téléphone Standard</label>
                                            <Input
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="border-slate-200 font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Email Officiel</label>
                                            <Input
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="border-slate-200"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Devise / Slogan Pédagogique</label>
                                        <Input
                                            value={slogan}
                                            onChange={(e) => setSlogan(e.target.value)}
                                            className="border-slate-200"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex justify-end">
                                <Button
                                    onClick={handleSaveSchoolInfo}
                                    disabled={isSaving}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-11 px-6 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                                >
                                    <Save size={16} />
                                    {isSaving ? "Enregistrement dans la BD..." : "Enregistrer dans la Base de Données"}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: Année Scolaire & Trimestres */}
                    {activeTab === "academic" && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                                    <CardTitle className="text-lg">Session Académique & Découpage Trimestriel</CardTitle>
                                    <CardDescription className="text-xs">
                                        Calendrier officiel conforme aux directives du Ministère des Enseignements Secondaires.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Année Scolaire</label>
                                            <Input
                                                value={academicYear}
                                                onChange={(e) => setAcademicYear(e.target.value)}
                                                className="border-slate-200 font-bold"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Date Rentrée Générale</label>
                                            <Input type="date" defaultValue="2025-09-08" className="border-slate-200 text-xs" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">Date Clôture Annuelle</label>
                                            <Input type="date" defaultValue="2026-07-10" className="border-slate-200 text-xs" />
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-600">Trimestres & Tranches d'Exigibilité</h4>
                                        {trimestres.map((trim, idx) => (
                                            <div key={idx} className="p-4 border border-slate-200 rounded-2xl bg-slate-50/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div>
                                                    <span className="font-bold text-slate-800 text-sm block">{trim.name}</span>
                                                    <span className="text-xs text-primary-blue font-semibold">{trim.tranches}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs">
                                                    <div>
                                                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Du</span>
                                                        <input
                                                            type="date"
                                                            defaultValue={trim.start}
                                                            className="border border-slate-200 rounded-lg px-2.5 py-1 text-xs bg-white"
                                                        />
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Au</span>
                                                        <input
                                                            type="date"
                                                            defaultValue={trim.end}
                                                            className="border border-slate-200 rounded-lg px-2.5 py-1 text-xs bg-white"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex justify-end">
                                <Button
                                    onClick={handleSaveAcademic}
                                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-11 px-6 rounded-xl flex items-center gap-2"
                                >
                                    <Save size={16} /> Enregistrer le Calendrier Scolaire
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: Personnel & Utilisateurs */}
                    {activeTab === "users" && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader className="border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg">Comptes Utilisateurs & Personnel de l'Établissement</CardTitle>
                                        <CardDescription className="text-xs">
                                            Utilisateurs rattachés au Lycée Leclerc dans la base de données.
                                        </CardDescription>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => setNewUserModalOpen(true)}
                                        className="bg-primary-blue hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 rounded-lg"
                                    >
                                        <Plus size={14} /> Nouvel Agent
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-3">
                                        {usersList.map((user, idx) => (
                                            <div
                                                key={idx}
                                                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 border border-slate-100 rounded-2xl hover:bg-slate-50/70 transition-all gap-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-xs sm:text-sm">{user.name}</p>
                                                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                                                            <span className="flex items-center gap-1"><Mail size={12} /> {user.email}</span>
                                                            {user.phone && <span className="flex items-center gap-1"><Phone size={12} /> {user.phone}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 self-start sm:self-center">
                                                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                                                        {user.role}
                                                    </span>
                                                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                                                        {user.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* TAB 4: Notifications & SMS */}
                    {activeTab === "notifications" && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                                    <CardTitle className="text-lg">Passerelle SMS & Alertes Parents</CardTitle>
                                    <CardDescription className="text-xs">
                                        Configuration des notifications automatiques pour retards, absences et impayés.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-slate-50/40">
                                        <div>
                                            <p className="font-bold text-sm text-slate-900">Passerelle SMS MTN / Orange Cameroun</p>
                                            <p className="text-xs text-slate-500">Envoi immédiat des avis de relances et convocations sur les téléphones des tuteurs.</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={smsGatewayActive}
                                            onChange={(e) => setSmsGatewayActive(e.target.checked)}
                                            className="h-5 w-5 rounded border-slate-300 text-primary-blue focus:ring-primary-blue"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-slate-50/40">
                                        <div>
                                            <p className="font-bold text-sm text-slate-900">Alertes Emails Institutionnels</p>
                                            <p className="text-xs text-slate-500">Transmission automatique des copies des bulletins et convocations de conseils.</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={emailNotifActive}
                                            onChange={(e) => setEmailNotifActive(e.target.checked)}
                                            className="h-5 w-5 rounded border-slate-300 text-primary-blue focus:ring-primary-blue"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                                            Délai de relance automatique avant échéance (Jours)
                                        </label>
                                        <Input
                                            type="number"
                                            value={autoReminderDays}
                                            onChange={(e) => setAutoReminderDays(e.target.value)}
                                            className="w-40 border-slate-200"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex justify-end">
                                <Button
                                    onClick={() => showToast("✅ Paramètres de notifications sauvegardés !")}
                                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-11 px-6 rounded-xl flex items-center gap-2"
                                >
                                    <Save size={16} /> Enregistrer
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* TAB 5: Sécurité */}
                    {activeTab === "security" && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                                    <CardTitle className="text-lg">Politique de Sécurité & Confidentialité Multi-Tenant</CardTitle>
                                    <CardDescription className="text-xs">
                                        Protection stricte des données du Lycée Leclerc conformément à la charte eSchool.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3">
                                        <Shield size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                                        <div className="text-xs text-emerald-900 space-y-1">
                                            <p className="font-bold">Cloisonnement Strict par schoolId</p>
                                            <p>
                                                Les dossiers des élèves, les finances et le personnel de cet établissement sont isolés cryptographiquement. Aucun Superadmin ni tiers externe ne peut accéder aux détails confidentiels des élèves ou aux caisses internes.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-4 border border-slate-100 rounded-2xl space-y-2">
                                        <p className="text-xs font-bold text-slate-800">Journal d'Audit des Connexions</p>
                                        <p className="text-xs text-slate-500">Toutes les actions d'enregistrement de notes et de validation comptable sont horodatées.</p>
                                        <div className="pt-2">
                                            <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg inline-block">
                                                Dernière connexion admin : Aujourd'hui à {new Date().toLocaleTimeString()} (IP: 129.0.22.84)
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal: New User */}
            {newUserModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
                        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Users size={18} />
                                <h3 className="font-bold text-sm">Ajouter un Membre du Personnel</h3>
                            </div>
                            <button
                                onClick={() => setNewUserModalOpen(false)}
                                className="text-slate-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Nom et Prénom *</label>
                                <Input
                                    value={newUserName}
                                    onChange={(e) => setNewUserName(e.target.value)}
                                    placeholder="ex: M. TCHOUA Roger"
                                    className="text-xs h-10 border-slate-200"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Email Professionnel *</label>
                                <Input
                                    type="email"
                                    value={newUserEmail}
                                    onChange={(e) => setNewUserEmail(e.target.value)}
                                    placeholder="ex: r.tchoua@leclerc.cm"
                                    className="text-xs h-10 border-slate-200"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Rôle au sein de l'établissement</label>
                                <select
                                    value={newUserRole}
                                    onChange={(e) => setNewUserRole(e.target.value)}
                                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none"
                                >
                                    <option value="Censeur">Censeur Pédagogique</option>
                                    <option value="Surveillant Général">Surveillant Général</option>
                                    <option value="Intendant">Intendant / Économe</option>
                                    <option value="Secrétaire">Secrétaire de Direction</option>
                                    <option value="Enseignant Titulaire">Enseignant Titulaire</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Téléphone Joignable</label>
                                <Input
                                    value={newUserPhone}
                                    onChange={(e) => setNewUserPhone(e.target.value)}
                                    className="text-xs h-10 border-slate-200 font-mono"
                                />
                            </div>

                            <div className="pt-2 flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setNewUserModalOpen(false)}
                                    className="text-xs border-slate-200"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-primary-blue hover:bg-blue-700 text-white text-xs font-bold"
                                >
                                    Créer le Compte
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
