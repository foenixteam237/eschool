"use client";

import { useState } from "react";
import { CreditCard, Smartphone, CheckCircle, Clock, ArrowRight, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logTransaction } from "@/lib/finance";

export default function ParentPaymentsPage() {
    const [history, setHistory] = useState([
        { id: "TX-9021", date: "15 Nov 2025", child: "Kamga Jean", type: "Mensualité Nov", amount: "35,000 FCFA", status: "Réussi" },
        { id: "TX-8842", date: "02 Oct 2025", child: "Kamga Marie", type: "Inscription", amount: "120,000 FCFA", status: "Réussi" },
    ]);

    const handlePayment = async () => {
        const paymentDetails = {
            id: `TX-${Math.floor(Math.random() * 10000)}`,
            date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
            child: "Kamga Jean",
            type: "Frais APEE",
            amount: "25,000 FCFA",
            status: "Réussi"
        };
        await logTransaction(paymentDetails);
        setHistory([paymentDetails, ...history]);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Finances & Paiements</h1>
                <p className="text-slate-500">Gérez les frais de scolarité et consultez l'historique.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-primary-blue/20 bg-blue-50/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Smartphone className="text-primary-blue" /> Nouveau Paiement Mobile
                        </CardTitle>
                        <CardDescription>Paiement sécurisé via Orange Money, Mobile Money ou Carte.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Choisir l'Enfant</label>
                                    <select className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm outline-none focus:ring-1 focus:ring-primary-blue">
                                        <option>Kamga Marie (6ème A)</option>
                                        <option>Kamga Jean (3ème B)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Type de Frais</label>
                                    <select className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm outline-none focus:ring-1 focus:ring-primary-blue">
                                        <option>Mensualité (Décembre)</option>
                                        <option>Frais APEE</option>
                                        <option>Cantine</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Montant à payer (FCFA)</label>
                                <div className="relative">
                                    <Wallet className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <Input type="number" placeholder="25000" className="pl-10 h-11 bg-white font-bold text-lg" />
                                </div>
                            </div>

                            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4">
                                <p className="text-sm font-bold text-slate-800">Méthode de Paiement</p>
                                <div className="grid grid-cols-3 gap-3">
                                    <button className="flex flex-col items-center justify-center p-3 border-2 border-primary-blue rounded-lg bg-blue-50">
                                        <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white text-[10px] font-bold">OM</div>
                                        <span className="text-[10px] mt-1 font-bold">Orange</span>
                                    </button>
                                    <button className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                                        <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center text-white text-[10px] font-bold text-slate-800">MoMo</div>
                                        <span className="text-[10px] mt-1 font-bold">MTN</span>
                                    </button>
                                    <button className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                                        <CreditCard className="text-slate-500" size={24} />
                                        <span className="text-[10px] mt-1 font-bold">Carte</span>
                                    </button>
                                </div>
                            </div>

                            <Button onClick={handlePayment} className="w-full h-12 text-lg font-bold shadow-lg shadow-blue-200 transition-all active:scale-95">
                                Procéder au Paiement <ArrowRight className="ml-2" size={20} />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>État Financier Global</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                            <p className="text-slate-500">Total payé cette année</p>
                            <p className="text-xl font-bold text-success-green">240,000 FCFA</p>
                        </div>
                        <div className="flex justify-between items-center text-red-500 font-bold">
                            <p>Reste à payer</p>
                            <p className="text-xl">45,000 FCFA</p>
                        </div>
                        <div className="pt-4 space-y-2">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Échéances à venir</p>
                            <div className="flex items-center gap-3 p-2 rounded bg-slate-50">
                                <Clock size={16} className="text-slate-400" />
                                <div className="flex-1">
                                    <p className="text-xs font-bold">Mensualité Janvier</p>
                                    <p className="text-[10px] text-slate-500">Due le 05 Jan 2026</p>
                                </div>
                                <span className="text-xs font-bold">25k</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Historique des Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-500 text-sm border-b border-slate-100">
                                    <th className="pb-3 pr-4 font-semibold">ID Transaction</th>
                                    <th className="pb-3 pr-4 font-semibold">Date</th>
                                    <th className="pb-3 pr-4 font-semibold">Élève</th>
                                    <th className="pb-3 pr-4 font-semibold">Description</th>
                                    <th className="pb-3 pr-4 font-semibold text-right">Montant</th>
                                    <th className="pb-3 font-semibold text-center">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {history.map((tx) => (
                                    <tr key={tx.id} className="text-sm">
                                        <td className="py-4 pr-4 font-mono text-slate-500">{tx.id}</td>
                                        <td className="py-4 pr-4 text-slate-600">{tx.date}</td>
                                        <td className="py-4 pr-4 font-bold text-slate-800">{tx.child}</td>
                                        <td className="py-4 pr-4 text-slate-600">{tx.type}</td>
                                        <td className="py-4 pr-4 text-right font-bold text-slate-800">{tx.amount}</td>
                                        <td className="py-4 text-center">
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full font-bold text-[10px]">
                                                <CheckCircle size={10} /> {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
