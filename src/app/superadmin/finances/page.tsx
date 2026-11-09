"use client";

import React, { useState, useEffect } from "react";
import {
  Banknote,
  TrendingUp,
  RefreshCw,
  FileText,
  ShieldCheck,
  Download,
  CreditCard,
  Smartphone,
  Landmark,
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  AlertTriangle
} from "lucide-react";

interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  schoolName: string;
  schoolLocation: string;
  studentsCount: string;
  formula: "Enterprise Max" | "Campus Global" | "Standard Pro";
  amountHT: string;
  amountTTC: string;
  paymentMethod: string;
  issueDate: string;
  status: "paid" | "pending" | "late";
  lateDays?: number;
}

const mockInvoicesFCFA: InvoiceItem[] = [
  {
    id: "1",
    invoiceNumber: "FAC-2024-1082",
    schoolName: "Lycée Général Leclerc",
    schoolLocation: "Yaoundé, Cameroun",
    studentsCount: "1 850 élèves",
    formula: "Enterprise Max",
    amountHT: "2 100 000 FCFA",
    amountTTC: "2 504 250 FCFA",
    paymentMethod: "Virement Trésorerie",
    issueDate: "01 Fév 2025",
    status: "paid",
  },
  {
    id: "2",
    invoiceNumber: "FAC-2024-1081",
    schoolName: "Lycée Polyvalent de Bonabéri",
    schoolLocation: "Douala, Cameroun",
    studentsCount: "1 200 élèves",
    formula: "Campus Global",
    amountHT: "2 950 000 FCFA",
    amountTTC: "2 950 000 FCFA",
    paymentMethod: "Mobile Money (Orange/MTN)",
    issueDate: "01 Fév 2025",
    status: "paid",
  },
  {
    id: "3",
    invoiceNumber: "FAC-2024-1080",
    schoolName: "Collège Bilingue Polyvalent Deido",
    schoolLocation: "Douala, Cameroun",
    studentsCount: "940 élèves",
    formula: "Standard Pro",
    amountHT: "1 180 000 FCFA",
    amountTTC: "1 180 000 FCFA",
    paymentMethod: "Carte bancaire Pro",
    issueDate: "28 Jan 2025",
    status: "pending",
  },
  {
    id: "4",
    invoiceNumber: "FAC-2024-1079",
    schoolName: "Lycée Technique Commercial de Bafoussam",
    schoolLocation: "Bafoussam, Cameroun",
    studentsCount: "1 200 élèves",
    formula: "Enterprise Max",
    amountHT: "1 900 000 FCFA",
    amountTTC: "2 265 750 FCFA",
    paymentMethod: "Virement bancaire",
    issueDate: "20 Jan 2025",
    status: "late",
    lateDays: 5,
  },
  {
    id: "5",
    invoiceNumber: "FAC-2024-1078",
    schoolName: "Institut Secondaire Privé La Grace",
    schoolLocation: "Garoua, Cameroun",
    studentsCount: "820 élèves",
    formula: "Campus Global",
    amountHT: "2 360 000 FCFA",
    amountTTC: "2 360 000 FCFA",
    paymentMethod: "Mobile Money (MTN MoMo)",
    issueDate: "15 Jan 2025",
    status: "paid",
  },
];

const cashflowMonthsFCFA = [
  { month: "Juil", val2024: 51, val2023: 36 },
  { month: "Août", val2024: 60, val2023: 45 },
  { month: "Sept", val2024: 97, val2023: 72, isHighlight: true },
  { month: "Oct", val2024: 84, val2023: 64 },
  { month: "Nov", val2024: 75, val2023: 58 },
  { month: "Déc", val2024: 80, val2023: 62 },
  { month: "Jan", val2024: 88, val2023: 69 },
  { month: "Fév", val2024: 93, val2023: 73 },
];

export default function SuperAdminFinancesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("02/01/2025");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [serverData, setServerData] = useState<any>(null);

  const fetchFinanceData = async () => {
    try {
      const res = await fetch("/api/superadmin/data");
      const data = await res.json();
      if (data.success) {
        setServerData(data);
      }
    } catch (e) {
      console.warn("Failed to fetch finance server data:", e);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  const invoicesList: InvoiceItem[] = serverData?.invoices || mockInvoicesFCFA;

  const filteredInvoices = invoicesList.filter((inv) => {
    if (search) {
      const q = search.toLowerCase();
      const match =
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.schoolName.toLowerCase().includes(q) ||
        inv.schoolLocation.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (statusFilter !== "all" && inv.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const mrrFCFA = serverData?.metrics?.mrrFCFA || 84250000;
  const arrFCFA = serverData?.metrics?.arrFCFA || 1011000000;
  const pendingInvoicesFCFA = serverData?.metrics?.pendingInvoicesFCFA || 6030000;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner Badge & Title matching Screen 2 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE9FE] text-[#5B21B6] text-xs font-bold mb-2">
            <Banknote size={13} />
            <span>MULTI-TENANT GOVERNANCE</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-semibold tracking-wider text-[11px]">Exercice 2024-2025 (Devise: FCFA)</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Facturation &amp; Revenus SaaS (FCFA)
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Suivi des encaissements en Francs CFA, factures émises, prévisions de trésorerie et passerelles Mobile Money / Banques CEMAC.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => showNotification("Exportation comptable FEC / CSV en FCFA initiée...")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold shadow-xs transition-colors"
          >
            <Download size={14} className="text-slate-500" />
            <span>Exporter comptabilité (CSV/FEC)</span>
          </button>

          <button
            onClick={() => showNotification("Facturation groupée du mois en cours générée avec succès")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-bold shadow-sm shadow-purple-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <FileText size={16} />
            <span>Générer facturation groupée</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 4 Metric KPI Cards matching Screen 2 in FCFA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: ARR Global Annuel */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              ARR Global Annuel
            </div>
            <div className="text-2xl font-black text-slate-900">
              1,01 Md FCFA
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#059669]">
                +18.0%
              </span>
              <span className="text-[11px] text-slate-400">vs N-1 (850M FCFA)</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#EDE9FE] text-[#5B21B6] flex items-center justify-center shrink-0">
            <TrendingUp size={20} />
          </div>
        </div>

        {/* Card 2: MRR Récurrent */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              MRR Récurrent
            </div>
            <div className="text-2xl font-black text-slate-900">
              {mrrFCFA.toLocaleString("fr-FR")} FCFA
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#059669]">
                +6.8%
              </span>
              <span className="text-[11px] text-slate-400">Stable &amp; Prévisible</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#EDE9FE] text-[#5B21B6] flex items-center justify-center shrink-0">
            <RefreshCw size={20} />
          </div>
        </div>

        {/* Card 3: Factures en Attente */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Factures en Attente
            </div>
            <div className="text-2xl font-black text-slate-900">
              {pendingInvoicesFCFA.toLocaleString("fr-FR")} FCFA
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <span className="font-bold text-slate-700">5 établissements</span>
              <span>Relances actives</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#EDE9FE] text-[#5B21B6] flex items-center justify-center shrink-0">
            <FileText size={20} />
          </div>
        </div>

        {/* Card 4: Taux de Recouvrement */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Taux de Recouvrement
            </div>
            <div className="text-2xl font-black text-slate-900">97.8%</div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#059669]">
                Objectif &gt;95% atteint
              </span>
              <span className="text-[11px] text-slate-400">DSO 11j</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
            <ShieldCheck size={20} />
          </div>
        </div>
      </div>

      {/* Row: Volume des Encaissements (2/3) + Passerelles de Paiement (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Volume des Encaissements & Projection N-1 */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Volume des Encaissements &amp; Projection N-1 (FCFA)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Comparatif mensuel des flux consolidés (en Millions de FCFA)
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5B21B6]" />
                  <span className="font-semibold text-slate-700">2024 (Réalisé)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="font-medium text-slate-500">2023 (N-1)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 border-t-2 border-dashed border-emerald-500" />
                  <span className="font-medium text-slate-500">Tendance</span>
                </div>
              </div>
            </div>

            {/* Custom Bar Chart matching Screen 2 */}
            <div className="pt-8 pb-4">
              <div className="h-52 flex items-end justify-between gap-3 px-2">
                {cashflowMonthsFCFA.map((m) => {
                  const h2024 = (m.val2024 / 110) * 100;
                  const h2023 = (m.val2023 / 110) * 100;

                  return (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="w-full flex items-end justify-center gap-1.5 h-44">
                        {/* 2023 Bar */}
                        <div
                          className="w-3 sm:w-4 rounded-t-md bg-slate-200 group-hover:bg-slate-300 transition-all"
                          style={{ height: `${h2023}%` }}
                          title={`2023: ${m.val2023}M FCFA`}
                        />
                        {/* 2024 Bar */}
                        <div
                          className={`w-3.5 sm:w-5 rounded-t-md transition-all ${
                            m.isHighlight
                              ? "bg-[#5B21B6] shadow-sm shadow-purple-300 ring-2 ring-purple-300"
                              : "bg-[#7C3AED] hover:bg-[#5B21B6]"
                          }`}
                          style={{ height: `${h2024}%` }}
                          title={`2024: ${m.val2024}M FCFA`}
                        />
                      </div>
                      <span
                        className={`text-xs ${
                          m.isHighlight ? "font-black text-[#5B21B6]" : "font-semibold text-slate-500"
                        }`}
                      >
                        {m.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Moyenne mensuelle constatée : <strong className="text-slate-800">84.25M FCFA</strong></span>
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <CheckCircle2 size={13} />
              100% réconcilié sur passerelles Orange/MTN MoMo &amp; Banques
            </span>
          </div>
        </div>

        {/* Right: Passerelles de Paiement matching Screen 2 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Passerelles de Paiement
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ventilation par processeur de transactions B2B (FCFA)
              </p>
            </div>

            {/* 3 Gateway Cards */}
            <div className="space-y-3 pt-2">
              {/* Mobile Money Hub */}
              <div className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <Smartphone size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Mobile Money Hub</div>
                    <div className="text-[10px] text-slate-400">Orange Money &amp; MTN MoMo Pro</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-slate-900 text-xs">58.4%</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">Actif • 24ms</div>
                </div>
              </div>

              {/* Stripe / Cartes B2B */}
              <div className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#5B21B6] flex items-center justify-center shrink-0">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Cartes Bancaires Visa/GIMAC</div>
                    <div className="text-[10px] text-slate-400">Passerelle sécurisée 3D-Secure</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-slate-900 text-xs">28.2%</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">Actif • 0 rejet</div>
                </div>
              </div>

              {/* Virements Trésorerie */}
              <div className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                    <Landmark size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Virements Trésorerie</div>
                    <div className="text-[10px] text-slate-400">Banques CEMAC (Afriland, SG, UBA)</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-slate-900 text-xs">13.4%</div>
                  <div className="text-[10px] text-slate-500 font-medium">Lettrage manuel</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Temps moyen de déblocage :</span>
            <span className="font-bold text-[#5B21B6]">Instantané / T+1 Ouvré</span>
          </div>
        </div>
      </div>

      {/* Filter Bar for Invoices */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[280px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par n° de facture (ex: FAC-2024-1082) ou établissement..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6]"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
          >
            <option value="all">Tous les statuts</option>
            <option value="paid">Payée</option>
            <option value="pending">En attente</option>
            <option value="late">En retard</option>
          </select>

          <div className="relative">
            <input
              type="text"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 w-32 focus:outline-hidden"
            />
            <Calendar size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Registre des Factures & Règlements Table matching Screen 2 in FCFA */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-extrabold text-slate-900">
              Registre des Factures &amp; Règlements (FCFA)
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
              {filteredInvoices.length} documents
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                fetchFinanceData();
                showNotification("Actualisation des paiements depuis la base de données");
              }}
              className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
              title="Rafraîchir"
            >
              <RefreshCw size={14} />
            </button>
            <button
              onClick={() => showNotification("Personnalisation des colonnes de facturation")}
              className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
              title="Affichage"
            >
              <SlidersHorizontal size={14} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  N° FACTURE
                </th>
                <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  ÉTABLISSEMENT
                </th>
                <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  FORMULE
                </th>
                <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  MONTANT HT
                </th>
                <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  MONTANT TTC
                </th>
                <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  RÈGLEMENT
                </th>
                <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  DATE ÉMISSION
                </th>
                <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  STATUT
                </th>
                <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* N° Facture */}
                  <td className="py-3.5 px-5">
                    <span className="font-extrabold text-[#5B21B6] text-xs">
                      {inv.invoiceNumber}
                    </span>
                  </td>

                  {/* Établissement */}
                  <td className="py-3.5 px-5">
                    <div className="font-bold text-slate-900 text-xs">{inv.schoolName}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {inv.schoolLocation} • {inv.studentsCount}
                    </div>
                  </td>

                  {/* Formule */}
                  <td className="py-3.5 px-5">
                    {inv.formula === "Enterprise Max" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EDE9FE] text-[#5B21B6]">
                        Enterprise Max
                      </span>
                    )}
                    {inv.formula === "Campus Global" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                        Campus Global
                      </span>
                    )}
                    {inv.formula === "Standard Pro" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700">
                        Standard Pro
                      </span>
                    )}
                  </td>

                  {/* Montant HT */}
                  <td className="py-3.5 px-5 font-semibold text-slate-800">
                    {inv.amountHT}
                  </td>

                  {/* Montant TTC */}
                  <td className="py-3.5 px-5 font-extrabold text-slate-900">
                    {inv.amountTTC}
                  </td>

                  {/* Règlement */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      {inv.paymentMethod.includes("Mobile Money") ? (
                        <Smartphone size={13} className="text-slate-400" />
                      ) : inv.paymentMethod.includes("Carte") ? (
                        <CreditCard size={13} className="text-slate-400" />
                      ) : (
                        <Landmark size={13} className="text-slate-400" />
                      )}
                      <span>{inv.paymentMethod}</span>
                    </div>
                  </td>

                  {/* Date Émission */}
                  <td className="py-3.5 px-5 text-slate-600 font-medium">
                    {inv.issueDate}
                  </td>

                  {/* Statut */}
                  <td className="py-3.5 px-5">
                    {inv.status === "paid" && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#059669]">
                        Payée
                      </span>
                    )}
                    {inv.status === "pending" && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                        En attente
                      </span>
                    )}
                    {inv.status === "late" && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF2F2] text-[#DC2626]">
                        Retard {inv.lateDays}j
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-5 text-center">
                    <button
                      onClick={() => showNotification(`Téléchargement du reçu / duplicata PDF ${inv.invoiceNumber} (FCFA)`)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      title="Télécharger la facture PDF"
                    >
                      <Download size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="py-3.5 px-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Affichage de 1 à {filteredInvoices.length} sur 52 factures émises</span>
          <div className="flex items-center gap-1">
            <button disabled className="p-1 text-slate-300 cursor-not-allowed">
              <ChevronLeft size={14} />
            </button>
            <button className="w-6 h-6 rounded-md bg-[#5B21B6] text-white text-xs font-black flex items-center justify-center shadow-xs">
              1
            </button>
            <button className="w-6 h-6 rounded-md text-slate-600 hover:bg-slate-100 text-xs font-semibold flex items-center justify-center">
              2
            </button>
            <button className="w-6 h-6 rounded-md text-slate-600 hover:bg-slate-100 text-xs font-semibold flex items-center justify-center">
              3
            </button>
            <button className="p-1 text-slate-700 hover:text-slate-900">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
