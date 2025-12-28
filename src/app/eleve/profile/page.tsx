"use client";

import { User, Mail, Phone, MapPin, Camera, Lock, Save, Globe, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Profil & Paramètres</h1>
                <p className="text-slate-500">Gérez vos informations personnelles et vos préférences de sécurité.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="md:col-span-1 shadow-sm border-none bg-slate-900 text-white h-fit">
                    <CardContent className="p-8 text-center space-y-6">
                        <div className="relative w-32 h-32 mx-auto group cursor-pointer">
                            <div className="w-full h-full rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center overflow-hidden">
                                <User size={64} className="text-slate-600" />
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera size={24} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Marie KAMGA</h3>
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Élève • 6ème A</p>
                        </div>
                        <div className="pt-4 space-y-2">
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Matricule</p>
                            <p className="font-mono text-sm bg-slate-800 py-1 rounded">2025-ECO-0001</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations Personnelles</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Nom</label>
                                    <Input defaultValue="KAMGA" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Prénom</label>
                                    <Input defaultValue="Marie" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
                                    <Input defaultValue="marie.kamga@ecole.com" className="pl-10" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Téléphone</label>
                                <div className="relative">
                                    <Smartphone className="absolute left-3 top-3 text-slate-400" size={16} />
                                    <Input defaultValue="+237 677 00 11 22" className="pl-10" />
                                </div>
                            </div>
                            <Button className="w-fit bg-primary-blue flex items-center gap-2">
                                <Save size={18} /> Sauvegarder
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Sécurité</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Ancien Mot de Passe</label>
                                <Input type="password" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Nouveau</label>
                                    <Input type="password" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Confirmer</label>
                                    <Input type="password" />
                                </div>
                            </div>
                            <Button variant="outline" className="w-fit text-primary-blue border-primary-blue/30 h-11 px-6 font-bold">
                                Mettre à jour le mot de passe
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
