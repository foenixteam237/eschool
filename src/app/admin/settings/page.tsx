"use client";

import { useState } from "react";
import { Save, Building2, Calendar, Users, Settings as SettingsIcon, Bell, Shield, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("school");

    const tabs = [
        { id: "school", name: "Informations École", icon: Building2 },
        { id: "academic", name: "Année Scolaire", icon: Calendar },
        { id: "users", name: "Utilisateurs & Rôles", icon: Users },
        { id: "notifications", name: "Notifications", icon: Bell },
        { id: "security", name: "Sécurité", icon: Shield },
        { id: "appearance", name: "Apparence", icon: Palette },
    ];

    return (
        <div className="space-y-6 pb-12">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Paramètres</h1>
                <p className="text-slate-500">Gérez les paramètres généraux de l'application</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-6">
                        <CardContent className="p-4">
                            <nav className="space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                                ? "bg-primary-blue text-white shadow-md"
                                                : "text-slate-600 hover:bg-slate-50"
                                            }`}
                                    >
                                        <tab.icon size={18} />
                                        {tab.name}
                                    </button>
                                ))}
                            </nav>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                    {/* School Info Tab */}
                    {activeTab === "school" && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informations de l'École</CardTitle>
                                    <CardDescription>Détails administratifs de l'établissement</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Nom de l'École *</label>
                                            <Input defaultValue="Collège & Lycée Excellence" className="border-slate-200" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Abréviation</label>
                                            <Input defaultValue="CLE" className="border-slate-200" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Adresse Complète</label>
                                        <Input defaultValue="Quartier Nsam, Rue 1.234, Yaoundé" className="border-slate-200" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Ville</label>
                                            <Input defaultValue="Yaoundé" className="border-slate-200" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Région</label>
                                            <Input defaultValue="Centre" className="border-slate-200" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Code Postal</label>
                                            <Input defaultValue="237" className="border-slate-200" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Téléphone</label>
                                            <Input defaultValue="+237 6 XX XX XX XX" className="border-slate-200" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Email</label>
                                            <Input defaultValue="contact@college-excellence.cm" className="border-slate-200" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Devise / Slogan</label>
                                        <Input defaultValue="L'Excellence pour Tous" className="border-slate-200" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Logo & Images</CardTitle>
                                    <CardDescription>Personnalisez l'identité visuelle</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Logo de l'École</label>
                                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:border-primary-blue transition-colors cursor-pointer">
                                            <p className="text-sm text-slate-500">Cliquez pour télécharger ou glissez-déposez</p>
                                            <p className="text-xs text-slate-400 mt-1">PNG, JPG jusqu'à 5MB</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex justify-end">
                                <Button className="bg-success-green hover:bg-emerald-600 flex items-center gap-2">
                                    <Save size={18} />
                                    Enregistrer les modifications
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Academic Year Tab */}
                    {activeTab === "academic" && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Année Scolaire en Cours</CardTitle>
                                    <CardDescription>Configuration de l'année académique</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Année Scolaire</label>
                                            <Input defaultValue="2025-2026" className="border-slate-200" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Date de Début</label>
                                            <Input type="date" defaultValue="2025-09-01" className="border-slate-200" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Date de Fin</label>
                                            <Input type="date" defaultValue="2026-07-15" className="border-slate-200" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Configuration des Trimestres</CardTitle>
                                    <CardDescription>Définissez les périodes de l'année scolaire</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {[
                                        { name: "1er Trimestre", start: "2025-09-01", end: "2025-12-20" },
                                        { name: "2ème Trimestre", start: "2026-01-06", end: "2026-03-28" },
                                        { name: "3ème Trimestre", start: "2026-04-06", end: "2026-07-15" },
                                    ].map((trimester, idx) => (
                                        <div key={idx} className="p-4 border border-slate-200 rounded-lg space-y-3">
                                            <h4 className="font-bold text-slate-900">{trimester.name}</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Date de Début</label>
                                                    <Input type="date" defaultValue={trimester.start} className="border-slate-200" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Date de Fin</label>
                                                    <Input type="date" defaultValue={trimester.end} className="border-slate-200" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Séquences par Trimestre</CardTitle>
                                    <CardDescription>Chaque trimestre contient 2 séquences</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                        <p className="text-sm text-slate-700">
                                            <strong>Note :</strong> Le système génère automatiquement 2 séquences par trimestre.
                                            La durée de chaque séquence est calculée en divisant la durée du trimestre par 2.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex justify-end">
                                <Button className="bg-success-green hover:bg-emerald-600 flex items-center gap-2">
                                    <Save size={18} />
                                    Enregistrer les modifications
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Users & Roles Tab */}
                    {activeTab === "users" && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Gestion des Utilisateurs</CardTitle>
                                        <CardDescription>Créez et gérez les comptes utilisateurs</CardDescription>
                                    </div>
                                    <Button className="flex items-center gap-2">
                                        <Users size={18} />
                                        Nouvel Utilisateur
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {[
                                            { name: "Admin Principal", email: "admin@school.cm", role: "Administrateur", status: "Actif" },
                                            { name: "Secrétaire", email: "secretaire@school.cm", role: "Secrétaire", status: "Actif" },
                                            { name: "Comptable", email: "compta@school.cm", role: "Finance", status: "Actif" },
                                        ].map((user, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-primary-blue/30 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-primary-blue text-white flex items-center justify-center font-bold">
                                                        {user.name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{user.name}</p>
                                                        <p className="text-xs text-slate-500">{user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                                                        {user.role}
                                                    </span>
                                                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                                                        {user.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Rôles & Permissions</CardTitle>
                                    <CardDescription>Définissez les accès par rôle</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                                        <p className="text-sm text-slate-700">
                                            <strong>En développement :</strong> La gestion fine des permissions sera disponible prochainement.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Other tabs placeholders */}
                    {(activeTab === "notifications" || activeTab === "security" || activeTab === "appearance") && (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <SettingsIcon className="mx-auto text-slate-300 mb-4" size={48} />
                                <p className="text-slate-500 font-medium">Section en développement</p>
                                <p className="text-sm text-slate-400 mt-1">Cette fonctionnalité sera disponible prochainement.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
