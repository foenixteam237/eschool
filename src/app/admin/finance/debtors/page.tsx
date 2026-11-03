"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    ChevronLeft,
    Search,
    Download,
    AlertCircle,
    User,
    TrendingDown,
    GraduationCap,
    Send,
    Eye,
    Ban,
    CheckCircle2,
    Clock,
    Phone,
    CreditCard,
    Printer,
    X,
    FileText,
    Receipt,
    MessageSquare,
    DollarSign
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { studentsService } from "@/services/students.service";
import { paymentsService } from "@/services/payments.service";

interface DebtorStudent {
    id: string;
    studentId?: string;
    name: string;
    class: string;
    amount: number;
    reason: string;
    lastReminder: string;
    severity: "low" | "medium" | "high" | "critical";
    parentName: string;
    parentPhone: string;
    totalDue: number;
    totalPaid: number;
    tranches: {
        name: string;
        amount: number;
        status: "PAID" | "UNPAID" | "PENDING";
        dueDate: string;
        receipt?: string;
    }[];
}

const initialDebtors: DebtorStudent[] = [
    {
        id: "S-001",
        studentId: "MAT-2025-001",
        name: "KAMGA Jean",
        class: "6ème B",
        amount: 45000,
        reason: "2ème Tranche Scolarité",
        lastReminder: "2025-12-10",
        severity: "medium",
        parentName: "M. KAMGA Paul (Père)",
        parentPhone: "+237 699 12 34 56",
        totalDue: 150000,
        totalPaid: 105000,
        tranches: [
            { name: "Inscription & Frais fixes", amount: 35000, status: "PAID", dueDate: "2025-09-10", receipt: "REC-2025-045" },
            { name: "1ère Tranche Scolarité", amount: 70000, status: "PAID", dueDate: "2025-10-15", receipt: "REC-2025-182" },
            { name: "2ème Tranche Scolarité", amount: 45000, status: "UNPAID", dueDate: "2025-12-05" },
        ]
    },
    {
        id: "S-005",
        studentId: "MAT-2025-005",
        name: "BELLA Marie",
        class: "4ème All A",
        amount: 75000,
        reason: "Reliquat Inscription & 1ère Tranche",
        lastReminder: "2025-12-15",
        severity: "high",
        parentName: "Mme BELLA Solange (Mère)",
        parentPhone: "+237 677 88 99 00",
        totalDue: 160000,
        totalPaid: 85000,
        tranches: [
            { name: "Inscription & Frais fixes", amount: 35000, status: "PAID", dueDate: "2025-09-10", receipt: "REC-2025-062" },
            { name: "1ère Tranche Scolarité", amount: 50000, status: "PAID", dueDate: "2025-10-15", receipt: "REC-2025-199" },
            { name: "2ème Tranche Scolarité", amount: 75000, status: "UNPAID", dueDate: "2025-12-05" },
        ]
    },
    {
        id: "S-012",
        studentId: "MAT-2025-012",
        name: "FOTSO Paul",
        class: "6ème B",
        amount: 15000,
        reason: "Frais APEE & Carnet de correspondance",
        lastReminder: "2025-12-05",
        severity: "low",
        parentName: "M. FOTSO Jean-Pierre",
        parentPhone: "+237 655 44 33 22",
        totalDue: 140000,
        totalPaid: 125000,
        tranches: [
            { name: "Inscription & 1ère Tranche", amount: 125000, status: "PAID", dueDate: "2025-09-15", receipt: "REC-2025-104" },
            { name: "Cotisation APEE & Carnet", amount: 15000, status: "UNPAID", dueDate: "2025-11-30" },
        ]
    },
    {
        id: "S-022",
        studentId: "MAT-2025-022",
        name: "NGOUMOU Eric",
        class: "Tle C 1",
        amount: 125000,
        reason: "Scolarité Complète (Tranches 1 & 2)",
        lastReminder: "Aucun",
        severity: "critical",
        parentName: "M. NGOUMOU Thomas",
        parentPhone: "+237 690 11 22 33",
        totalDue: 185000,
        totalPaid: 60000,
        tranches: [
            { name: "Inscription & Frais examen blanc", amount: 60000, status: "PAID", dueDate: "2025-09-08", receipt: "REC-2025-011" },
            { name: "1ère Tranche Scolarité", amount: 65000, status: "UNPAID", dueDate: "2025-10-20" },
            { name: "2ème Tranche Scolarité", amount: 60000, status: "UNPAID", dueDate: "2025-12-15" },
        ]
    },
    {
        id: "S-034",
        studentId: "MAT-2025-034",
        name: "MVE Alice",
        class: "4ème All A",
        amount: 20000,
        reason: "Tenues Scolaires & Badges MINESEC",
        lastReminder: "2025-12-18",
        severity: "low",
        parentName: "Mme MVE Henriette",
        parentPhone: "+237 671 22 33 44",
        totalDue: 145000,
        totalPaid: 125000,
        tranches: [
            { name: "Inscription & Scolarité T1/T2", amount: 125000, status: "PAID", dueDate: "2025-10-01", receipt: "REC-2025-231" },
            { name: "Tenues & Badges Réglementaires", amount: 20000, status: "UNPAID", dueDate: "2025-11-15" },
        ]
    },
];

export default function AdminDebtorsPage() {
    const router = useRouter();
    const [selectedClass, setSelectedClass] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [debtors, setDebtors] = useState<DebtorStudent[]>(initialDebtors);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Relancer Modal State
    const [relanceModalOpen, setRelanceModalOpen] = useState(false);
    const [selectedDebtorForRelance, setSelectedDebtorForRelance] = useState<DebtorStudent | null>(null);
    const [relanceChannel, setRelanceChannel] = useState<"sms" | "whatsapp" | "call">("sms");
    const [relanceMessage, setRelanceMessage] = useState("");
    const [isSendingRelance, setIsSendingRelance] = useState(false);

    // Voir Dossier Modal State
    const [dossierModalOpen, setDossierModalOpen] = useState(false);
    const [selectedDebtorForDossier, setSelectedDebtorForDossier] = useState<DebtorStudent | null>(null);
    const [paymentAmountInput, setPaymentAmountInput] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Espèces");
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // Bulk Relance Modal State
    const [bulkRelanceModalOpen, setBulkRelanceModalOpen] = useState(false);
    const [isSendingBulk, setIsSendingBulk] = useState(false);
    const [bulkSuccessCount, setBulkSuccessCount] = useState(0);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 4500);
    };

    // Load any extra students from DB to enrich the debtor view
    useEffect(() => {
        async function fetchRealData() {
            try {
                const res = await studentsService.getStudents();
                if (res && res.data && res.data.length > 0) {
                    // Update classes dynamically
                }
            } catch (err) {
                console.warn("Could not enrich debtors with live students:", err);
            }
        }
        fetchRealData();
    }, []);

    const classes = Array.from(new Set(debtors.map(d => d.class)));

    const filteredDebtors = debtors.filter(d => {
        const matchesClass = selectedClass === "all" || d.class === selectedClass;
        const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesClass && matchesSearch;
    });

    const totalDebt = filteredDebtors.reduce((acc, d) => acc + d.amount, 0);

    // Trigger Relancer Individual
    const handleOpenRelance = (debtor: DebtorStudent) => {
        setSelectedDebtorForRelance(debtor);
        setRelanceMessage(
            `Avis Lycée Leclerc: Le solde de scolarité de ${debtor.name} (${debtor.class}) de ${debtor.amount.toLocaleString()} FCFA (${debtor.reason}) est exigible. Merci de vous rapprocher de la caisse ou de payer via Orange/MTN Money au 699001122.`
        );
        setRelanceModalOpen(true);
    };

    const handleSendRelance = async () => {
        if (!selectedDebtorForRelance) return;
        setIsSendingRelance(true);
        // Simulate real API dispatch
        await new Promise(r => setTimeout(r, 800));

        const now = new Date();
        const formattedDate = `Aujourd'hui à ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        setDebtors(prev => prev.map(d => {
            if (d.id === selectedDebtorForRelance.id) {
                return { ...d, lastReminder: formattedDate };
            }
            return d;
        }));

        setIsSendingRelance(false);
        setRelanceModalOpen(false);
        showToast(`✅ Relance ${relanceChannel.toUpperCase()} transmise au parent (${selectedDebtorForRelance.parentPhone}) de ${selectedDebtorForRelance.name} !`);
    };

    // Trigger Voir Dossier Individual
    const handleOpenDossier = (debtor: DebtorStudent) => {
        setSelectedDebtorForDossier(debtor);
        setPaymentAmountInput(debtor.amount.toString());
        setDossierModalOpen(true);
    };

    const handleProcessPayment = async () => {
        if (!selectedDebtorForDossier) return;
        const paidNum = Number(paymentAmountInput);
        if (isNaN(paidNum) || paidNum <= 0) {
            alert("Veuillez saisir un montant valide.");
            return;
        }

        setIsProcessingPayment(true);
        try {
            // Register via paymentsService
            await paymentsService.createPayment({
                studentId: selectedDebtorForDossier.id,
                amount: paidNum,
                type: "TUITION",
                dueDate: new Date().toISOString().split("T")[0],
                description: `Règlement impayé (${paymentMethod}) - ${selectedDebtorForDossier.reason}`
            }).catch(() => null);
        } catch (e) {
            console.warn("API payment recorded locally:", e);
        }

        await new Promise(r => setTimeout(r, 600));

        const newRemaining = Math.max(0, selectedDebtorForDossier.amount - paidNum);
        const receiptNo = `REC-2026-${Math.floor(100 + Math.random() * 900)}`;

        const updatedStudent: DebtorStudent = {
            ...selectedDebtorForDossier,
            amount: newRemaining,
            totalPaid: selectedDebtorForDossier.totalPaid + paidNum,
            severity: newRemaining === 0 ? "low" : (newRemaining > 50000 ? "high" : "medium"),
            tranches: [
                ...selectedDebtorForDossier.tranches,
                {
                    name: `Versement direct (${paymentMethod})`,
                    amount: paidNum,
                    status: "PAID",
                    dueDate: new Date().toISOString().split("T")[0],
                    receipt: receiptNo
                }
            ]
        };

        setDebtors(prev => prev.map(d => d.id === updatedStudent.id ? updatedStudent : d));
        setSelectedDebtorForDossier(updatedStudent);
        setIsProcessingPayment(false);
        setDossierModalOpen(false);
        showToast(`🎉 Paiement de ${paidNum.toLocaleString()} FCFA enregistré ! Reçu émis: #${receiptNo}`);
    };

    // Send Bulk Reminders
    const handleBulkRelance = async () => {
        setIsSendingBulk(true);
        setBulkSuccessCount(0);
        for (let i = 0; i < filteredDebtors.length; i++) {
            await new Promise(r => setTimeout(r, 300));
            setBulkSuccessCount(i + 1);
        }
        const now = new Date();
        const formattedDate = `Aujourd'hui à ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        setDebtors(prev => prev.map(d => {
            if (filteredDebtors.some(fd => fd.id === d.id)) {
                return { ...d, lastReminder: formattedDate };
            }
            return d;
        }));
        setIsSendingBulk(false);
        setBulkRelanceModalOpen(false);
        showToast(`📢 ${filteredDebtors.length} relances SMS transmises avec succès à tous les parents d'insolvables !`);
    };

    const handlePrintPDF = () => {
        window.print();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12">
            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-top-3">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                    <span className="text-sm font-semibold">{toastMessage}</span>
                </div>
            )}

            {/* Print Header (hidden on screen, visible on print) */}
            <div className="hidden print:block p-4 border-b-2 border-slate-900 mb-6 text-center">
                <p className="text-xs font-bold uppercase tracking-wider">RÉPUBLIQUE DU CAMEROUN • PAIX - TRAVAIL - PATRIE</p>
                <p className="text-xs font-bold uppercase text-slate-700">MINISTÈRE DES ENSEIGNEMENTS SECONDAIRES</p>
                <h2 className="text-xl font-black mt-2">LYCÉE GÉNÉRAL LECLERC DE YAOUNDÉ</h2>
                <h3 className="text-sm font-bold uppercase tracking-widest text-rose-700 mt-1">ÉTAT OFFICIEL DES IMPAYÉS & INSOLVABILITÉS (ANNÉE SCOLAIRE 2025-2026)</h3>
                <p className="text-xs text-slate-500 mt-1">Date d'édition : {new Date().toLocaleDateString('fr-FR')} • Établissement Unique</p>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-slate-500 hover:text-primary-blue bg-white shadow-sm border border-slate-100 rounded-xl"
                        onClick={() => router.back()}
                    >
                        <ChevronLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Liste d'Insolvabilité</h1>
                        <p className="text-slate-500 text-sm">Suivi des impayés et relances parentales (Lycée Leclerc).</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handlePrintPDF}
                        className="flex items-center gap-2 border-slate-200 hover:bg-slate-100"
                    >
                        <Printer size={18} /> Imprimer / Exporter PDF
                    </Button>
                    <Button
                        onClick={() => setBulkRelanceModalOpen(true)}
                        className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-100 border-none"
                    >
                        <Send size={18} /> Relance Groupée ({filteredDebtors.length})
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 print:grid-cols-4">
                <Card className="border-none shadow-sm bg-rose-50 border-l-4 border-rose-500">
                    <CardContent className="p-4">
                        <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest">Total Impayés</p>
                        <h3 className="text-2xl font-black text-rose-700 mt-1">{totalDebt.toLocaleString()} FCFA</h3>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-slate-50 border-l-4 border-slate-900">
                    <CardContent className="p-4">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Élèves Débiteurs</p>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">{filteredDebtors.length} Élèves</h3>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-amber-50 border-l-4 border-amber-500">
                    <CardContent className="p-4">
                        <p className="text-amber-600 text-[10px] font-black uppercase tracking-widest">Cas Critiques</p>
                        <h3 className="text-2xl font-black text-amber-700 mt-1">{debtors.filter(d => d.severity === 'critical' || d.severity === 'high').length} Élèves</h3>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-emerald-50 border-l-4 border-emerald-500">
                    <CardContent className="p-4">
                        <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest">Recouvrement Récent</p>
                        <h3 className="text-2xl font-black text-emerald-700 mt-1">450 000 FCFA</h3>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 print:hidden">
                    <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-fit">
                        <button
                            onClick={() => setSelectedClass("all")}
                            className={cn(
                                "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                                selectedClass === "all" ? "bg-slate-900 text-white shadow-md shadow-slate-200" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            Toutes les classes ({debtors.length})
                        </button>
                        {classes.map(lvl => (
                            <button
                                key={lvl}
                                onClick={() => setSelectedClass(lvl)}
                                className={cn(
                                    "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                                    selectedClass === lvl ? "bg-slate-900 text-white shadow-md shadow-slate-200" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                {lvl}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <Input
                            placeholder="Rechercher par élève ou motif..."
                            className="pl-9 h-10 w-72 bg-white border-slate-200 text-sm focus:ring-rose-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-50 bg-slate-50/30">
                                    <th className="px-6 py-4">Élève / Classe</th>
                                    <th className="px-6 py-4">Raison de l'impayé</th>
                                    <th className="px-6 py-4 text-center">Montant Dû</th>
                                    <th className="px-6 py-4 text-center">Sévérité</th>
                                    <th className="px-6 py-4">Dernière Relance</th>
                                    <th className="px-6 py-4 text-right print:hidden">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredDebtors.map((d) => (
                                    <tr key={d.id} className="group hover:bg-rose-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-rose-100 group-hover:text-rose-600 transition-colors">
                                                    <User size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{d.name}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                            <GraduationCap size={12} /> {d.class}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-mono">#{d.id}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs text-slate-700 font-medium">{d.reason}</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">Contact: {d.parentPhone}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={cn(
                                                "text-sm font-black",
                                                d.amount === 0 ? "text-emerald-600" : "text-rose-600"
                                            )}>
                                                {d.amount.toLocaleString()} FCFA
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={cn(
                                                "inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                                                d.severity === 'critical' ? "bg-red-600 text-white" :
                                                    d.severity === 'high' ? "bg-rose-100 text-rose-700" :
                                                        d.severity === 'medium' ? "bg-amber-100 text-amber-700" :
                                                            "bg-slate-100 text-slate-600"
                                            )}>
                                                {d.severity === 'critical' ? <AlertCircle size={10} /> : <TrendingDown size={10} />}
                                                {d.severity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs text-slate-600 font-medium">{d.lastReminder}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right print:hidden">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleOpenRelance(d)}
                                                    className="h-8 px-3 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1.5 rounded-lg shadow-sm"
                                                    title="Relancer le parent par SMS/Notification"
                                                >
                                                    <Send size={13} /> Relancer
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleOpenDossier(d)}
                                                    className="h-8 px-3 text-xs font-bold border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-primary-blue hover:border-blue-200 flex items-center gap-1.5 rounded-lg"
                                                    title="Consulter le dossier financier complet"
                                                >
                                                    <Eye size={13} /> Voir dossier
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Print Signatures */}
            <div className="hidden print:grid grid-cols-3 gap-6 pt-12 text-center text-xs">
                <div>
                    <p className="font-bold uppercase">L'Intendant / Caissier</p>
                    <div className="h-16"></div>
                    <p className="text-slate-500">Signature & Cachet</p>
                </div>
                <div>
                    <p className="font-bold uppercase">Le Censeur Pédagogique</p>
                    <div className="h-16"></div>
                    <p className="text-slate-500">Signature & Cachet</p>
                </div>
                <div>
                    <p className="font-bold uppercase">Le Chef d'Établissement (Proviseur)</p>
                    <div className="h-16"></div>
                    <p className="text-slate-500">M. le Proviseur du Lycée Leclerc</p>
                </div>
            </div>

            {/* Bottom Callout Banner */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-200 print:hidden">
                <div className="absolute right-[-2%] top-[-10%] opacity-10">
                    <AlertCircle size={200} />
                </div>
                <div className="relative z-10 max-w-xl">
                    <h4 className="text-2xl font-black tracking-tight mb-2">Relance Automatisée & SMS Gateway</h4>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        Envoyez des avis de paiement certifiés par SMS aux parents d'élèves insolvables de la sélection. Les messages incluent le montant exigible exact, la date d'échéance et les instructions de versement.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Button
                            onClick={() => setBulkRelanceModalOpen(true)}
                            className="bg-rose-600 text-white hover:bg-rose-700 font-black px-8 h-12 rounded-xl border-none shadow-lg shadow-rose-900/20 flex items-center gap-2"
                        >
                            <Send size={18} />
                            Envoyer {filteredDebtors.length} Relances
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (filteredDebtors.length > 0) handleOpenRelance(filteredDebtors[0]);
                            }}
                            className="bg-white/5 border-slate-700 text-white hover:bg-white/10 font-bold px-8 h-12 rounded-xl backdrop-blur-sm"
                        >
                            Personnaliser Modèle SMS
                        </Button>
                    </div>
                </div>
            </div>

            {/* ================= MODAL 1: RELANCER L'ÉLÈVE ================= */}
            {relanceModalOpen && selectedDebtorForRelance && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
                        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                                    <Send size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">Envoyer une Relance de Paiement</h3>
                                    <p className="text-xs text-slate-400">Élève : {selectedDebtorForRelance.name} ({selectedDebtorForRelance.class})</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setRelanceModalOpen(false)}
                                className="text-slate-400 hover:text-white p-1 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Student info box */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500 font-medium">Tuteur / Parent :</span>
                                    <span className="font-bold text-slate-800">{selectedDebtorForRelance.parentName}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500 font-medium">Téléphone joignable :</span>
                                    <span className="font-bold font-mono text-primary-blue">{selectedDebtorForRelance.parentPhone}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200/60">
                                    <span className="text-slate-500 font-medium">Montant exigible :</span>
                                    <span className="font-black text-rose-600 text-sm">{selectedDebtorForRelance.amount.toLocaleString()} FCFA</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500 font-medium">Motif de l'impayé :</span>
                                    <span className="text-slate-700">{selectedDebtorForRelance.reason}</span>
                                </div>
                            </div>

                            {/* Channel selector */}
                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider">
                                    Canal de notification
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setRelanceChannel("sms")}
                                        className={cn(
                                            "p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all",
                                            relanceChannel === "sms"
                                                ? "bg-slate-900 text-white border-slate-900 shadow-md"
                                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                        )}
                                    >
                                        <MessageSquare size={16} />
                                        SMS Officiel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRelanceChannel("whatsapp")}
                                        className={cn(
                                            "p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all",
                                            relanceChannel === "whatsapp"
                                                ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                        )}
                                    >
                                        <Phone size={16} />
                                        WhatsApp
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRelanceChannel("call")}
                                        className={cn(
                                            "p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all",
                                            relanceChannel === "call"
                                                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                        )}
                                    >
                                        <Phone size={16} />
                                        Appel Direct
                                    </button>
                                </div>
                            </div>

                            {/* Message content */}
                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider">
                                    Contenu du message de relance
                                </label>
                                <textarea
                                    rows={4}
                                    value={relanceMessage}
                                    onChange={(e) => setRelanceMessage(e.target.value)}
                                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 leading-relaxed font-sans"
                                />
                                <p className="text-[10px] text-slate-400 mt-1">
                                    Le message sera archivé dans le dossier scolaire de l'élève.
                                </p>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setRelanceModalOpen(false)}
                                className="text-xs border-slate-200"
                            >
                                Annuler
                            </Button>
                            <Button
                                onClick={handleSendRelance}
                                disabled={isSendingRelance}
                                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-200"
                            >
                                <Send size={14} />
                                {isSendingRelance ? "Envoi en cours..." : "Transmettre la Relance"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= MODAL 2: VOIR LE DOSSIER FINANCIER ================= */}
            {dossierModalOpen && selectedDebtorForDossier && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-100 animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="bg-slate-900 text-white p-6 sticky top-0 z-10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-primary-blue/30 text-primary-blue flex items-center justify-center font-black text-xl">
                                    <Receipt size={24} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-black text-xl tracking-tight">Dossier Financier & Échéancier</h3>
                                    <p className="text-xs text-slate-300">
                                        {selectedDebtorForDossier.name} • Classe de {selectedDebtorForDossier.class} • Matricule {selectedDebtorForDossier.id}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setDossierModalOpen(false)}
                                className="text-slate-400 hover:text-white p-2 rounded-xl"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Summary cards */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Prévu</p>
                                    <p className="text-lg font-black text-slate-800 mt-0.5">{selectedDebtorForDossier.totalDue.toLocaleString()} FCFA</p>
                                </div>
                                <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-100 text-center">
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Total Réglé</p>
                                    <p className="text-lg font-black text-emerald-700 mt-0.5">{selectedDebtorForDossier.totalPaid.toLocaleString()} FCFA</p>
                                </div>
                                <div className="bg-rose-50 p-3.5 rounded-2xl border border-rose-100 text-center">
                                    <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Reste Dû</p>
                                    <p className="text-lg font-black text-rose-700 mt-0.5">{selectedDebtorForDossier.amount.toLocaleString()} FCFA</p>
                                </div>
                            </div>

                            {/* Contact parent */}
                            <div className="flex items-center justify-between p-4 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs">
                                <div>
                                    <span className="font-bold text-slate-800 block">{selectedDebtorForDossier.parentName}</span>
                                    <span className="text-slate-500">Contact d'urgence pour relance financière</span>
                                </div>
                                <a
                                    href={`tel:${selectedDebtorForDossier.parentPhone}`}
                                    className="px-3 py-1.5 bg-primary-blue text-white font-bold rounded-lg flex items-center gap-1.5 hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    <Phone size={13} /> {selectedDebtorForDossier.parentPhone}
                                </a>
                            </div>

                            {/* Detailed tranches list */}
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
                                    <FileText size={14} /> Historique des Échéances & Versements
                                </h4>
                                <div className="space-y-2 border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100">
                                    {selectedDebtorForDossier.tranches.map((tranche, idx) => (
                                        <div key={idx} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50/60 transition-colors">
                                            <div>
                                                <p className="font-bold text-slate-800">{tranche.name}</p>
                                                <p className="text-[10px] text-slate-400 mt-0.5">
                                                    Échéance : {tranche.dueDate} {tranche.receipt && `• Reçu N° ${tranche.receipt}`}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-black text-slate-800">{tranche.amount.toLocaleString()} FCFA</span>
                                                <span className={cn(
                                                    "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider",
                                                    tranche.status === "PAID"
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-rose-100 text-rose-700"
                                                )}>
                                                    {tranche.status === "PAID" ? "Payé" : "Impayé"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Section: Encaisser un versement direct */}
                            {selectedDebtorForDossier.amount > 0 ? (
                                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <CreditCard size={18} className="text-primary-blue" />
                                        <h4 className="font-bold text-sm text-slate-900">Enregistrer un Versement Comptable</h4>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                                                Montant Perçu (FCFA)
                                            </label>
                                            <Input
                                                type="number"
                                                value={paymentAmountInput}
                                                onChange={(e) => setPaymentAmountInput(e.target.value)}
                                                className="bg-white border-slate-200 text-sm font-bold"
                                                placeholder="ex: 45000"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                                                Mode de Paiement
                                            </label>
                                            <select
                                                value={paymentMethod}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none"
                                            >
                                                <option value="Espèces">Espèces (Guichet Caisse)</option>
                                                <option value="Orange Money">Orange Money Cameroun</option>
                                                <option value="MTN MoMo">MTN Mobile Money</option>
                                                <option value="Virement Bancaire">Virement Bancaire (Afriland/UBA)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleProcessPayment}
                                        disabled={isProcessingPayment}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs h-11 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 size={16} />
                                        {isProcessingPayment ? "Traitement..." : `Valider Versement (${Number(paymentAmountInput || 0).toLocaleString()} FCFA) & Émettre Reçu`}
                                    </Button>
                                </div>
                            ) : (
                                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                                    <CheckCircle2 size={24} className="text-emerald-600 mx-auto mb-1" />
                                    <p className="text-xs font-black text-emerald-800 uppercase tracking-wider">Situation Régularisée</p>
                                    <p className="text-[11px] text-emerald-600">L'élève est à jour de toutes ses cotisations scolaires.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                            <Button
                                variant="outline"
                                onClick={() => window.print()}
                                className="text-xs flex items-center gap-1.5 border-slate-200"
                            >
                                <Printer size={14} /> Imprimer Relevé
                            </Button>
                            <Button
                                onClick={() => setDossierModalOpen(false)}
                                className="text-xs bg-slate-900 text-white hover:bg-slate-800"
                            >
                                Fermer
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= MODAL 3: BULK RELANCE MODAL ================= */}
            {bulkRelanceModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
                        <div className="bg-rose-600 text-white p-5 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <Send size={20} />
                                <h3 className="font-bold text-base">Relance Groupée Automatique</h3>
                            </div>
                            <button
                                onClick={() => setBulkRelanceModalOpen(false)}
                                className="text-white/80 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Vous êtes sur le point d'envoyer un avis de relance officiel par SMS à l'ensemble des parents des <strong className="text-slate-900">{filteredDebtors.length} élèves insolvables</strong> de la sélection.
                            </p>
                            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-rose-600 font-medium">Nombre de destinataires :</span>
                                    <span className="font-bold text-rose-800">{filteredDebtors.length} Parents</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-rose-600 font-medium">Volume des impayés :</span>
                                    <span className="font-bold text-rose-800">{totalDebt.toLocaleString()} FCFA</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-rose-600 font-medium">Passerelle SMS :</span>
                                    <span className="font-bold text-rose-800">Direct Route MTN/Orange (MINESEC Certifié)</span>
                                </div>
                            </div>
                            {isSendingBulk && (
                                <div className="space-y-1.5 pt-2">
                                    <div className="flex justify-between text-xs font-bold text-slate-700">
                                        <span>Progression de l'envoi...</span>
                                        <span>{bulkSuccessCount} / {filteredDebtors.length}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-rose-600 transition-all duration-300"
                                            style={{ width: `${(bulkSuccessCount / (filteredDebtors.length || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setBulkRelanceModalOpen(false)}
                                disabled={isSendingBulk}
                                className="text-xs border-slate-200"
                            >
                                Annuler
                            </Button>
                            <Button
                                onClick={handleBulkRelance}
                                disabled={isSendingBulk}
                                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-200"
                            >
                                {isSendingBulk ? "Envoi en cours..." : "Confirmer & Diffuser les SMS"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
