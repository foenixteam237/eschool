"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  GraduationCap,
  Calendar,
  ShieldCheck,
  Download,
  Plus,
  Sliders,
  Sparkles,
  Check,
  Minus,
  Pencil,
  FileText,
  Send,
  Building2,
  RefreshCw,
  HelpCircle,
  Shield,
  Layers,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2
} from "lucide-react";

interface RenewalContract {
  id: string;
  initials: string;
  avatarBg: string;
  schoolName: string;
  tenantCode: string;
  planName: string;
  planNote?: string;
  daysLeft: number;
  dueDate: string;
  studentsInfo: string;
  isWarning?: boolean;
  amount: string;
  amountDetail?: string;
  autoRenew: boolean;
  actionType: "facture" | "devis" | "sla" | "details";
}

const mockRenewalsFCFA: RenewalContract[] = [
  {
    id: "1",
    initials: "GL",
    avatarBg: "bg-purple-100 text-[#5B21B6]",
    schoolName: "Lycée Général Leclerc",
    tenantCode: "tenant_lgl_yde • CM-2371",
    planName: "Pro Campus",
    planNote: "Annuel (2 000 max)",
    daysLeft: 6,
    dueDate: "18 Oct.",
    studentsInfo: "1 840 élèves inscrits",
    amount: "7 020 000 FCFA",
    amountDetail: "TTC / an",
    autoRenew: true,
    actionType: "facture",
  },
  {
    id: "2",
    initials: "PB",
    avatarBg: "bg-indigo-100 text-indigo-700",
    schoolName: "Lycée Polyvalent de Bonabéri",
    tenantCode: "tenant_lpb_dla • CM-2372",
    planName: "Starter School",
    planNote: "Quota dépassé (562 / 500)",
    daysLeft: 11,
    dueDate: "23 Oct.",
    studentsInfo: "Renégociation requise",
    isWarning: true,
    amount: "3 540 000 FCFA",
    amountDetail: "+ Surcoût 62 élèves",
    autoRenew: false,
    actionType: "devis",
  },
  {
    id: "3",
    initials: "ED",
    avatarBg: "bg-emerald-100 text-emerald-800",
    schoolName: "Groupe Éducatif Deido",
    tenantCode: "tenant_ged_group • CM-2373",
    planName: "Enterprise Group",
    planNote: "5 campus interconnectés",
    daysLeft: 19,
    dueDate: "31 Oct.",
    studentsInfo: "5 480 élèves cumulés",
    amount: "14 580 000 FCFA",
    amountDetail: "Contrat Cadre Annuel",
    autoRenew: true,
    actionType: "sla",
  },
  {
    id: "4",
    initials: "TB",
    avatarBg: "bg-slate-100 text-slate-800",
    schoolName: "Lycée Technique de Bafoussam",
    tenantCode: "tenant_ltb_baf • CM-2374",
    planName: "Starter School",
    planNote: "Mensuel reconductible",
    daysLeft: 24,
    dueDate: "05 Nov.",
    studentsInfo: "340 élèves",
    amount: "295 000 FCFA",
    amountDetail: "Prélèvement / Virement",
    autoRenew: true,
    actionType: "details",
  },
  {
    id: "5",
    initials: "LG",
    avatarBg: "bg-purple-100 text-purple-900",
    schoolName: "Institut Secondaire La Grace",
    tenantCode: "tenant_ispg_gar • CM-2375",
    planName: "Pro Campus",
    planNote: "Annuel (Option bus incluse)",
    daysLeft: 28,
    dueDate: "09 Nov.",
    studentsInfo: "Carte / Relance requise",
    isWarning: true,
    amount: "7 350 000 FCFA",
    amountDetail: "1 120 élèves",
    autoRenew: false,
    actionType: "devis",
  },
];

export default function SuperAdminSubscriptionsPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [activeTab, setActiveTab] = useState<"plans" | "active" | "history">("plans");
  const [renewals, setRenewals] = useState<RenewalContract[]>(mockRenewalsFCFA);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [serverData, setServerData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/superadmin/data")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setServerData(data);
        }
      })
      .catch((err) => console.warn("Failed to load server data:", err));
  }, []);

  const toggleAutoRenew = (id: string) => {
    setRenewals((prev) =>
      prev.map((r) => (r.id === id ? { ...r, autoRenew: !r.autoRenew } : r))
    );
  };

  const showNotification = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const totalSchools = serverData?.metrics?.totalSchools || 142;
  const mrrFCFA = serverData?.metrics?.mrrFCFA || 84250000;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner Badge & Title matching Screen 1 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE9FE] text-[#5B21B6] text-xs font-bold mb-2">
            <CreditCard size={13} />
            <span>MODÈLE ÉCONOMIQUE &amp; SAAS</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-semibold tracking-wider text-[11px]">DEVISE OFFICIELLE : FCFA (XAF)</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Gestion des Abonnements &amp; Grilles Tarifaires
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Gestion des packages SaaS en Francs CFA (FCFA), tarification par élève, fonctionnalités incluses et licences actives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => showNotification("Exportation de la grille tarifaire en FCFA en cours...")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold shadow-xs transition-colors"
          >
            <Download size={14} className="text-slate-500" />
            <span>Exporter les grilles</span>
          </button>

          <button
            onClick={() => showNotification("Ouverture de l'assistant de configuration d'un nouveau forfait...")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-bold shadow-sm shadow-purple-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={16} />
            <span>Nouveau Forfait</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* 4 Metric KPI Cards matching Screen 1 (All in FCFA) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenu Récurrent (MRR in FCFA) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              REVENU RÉCURRENT (MRR)
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                {mrrFCFA.toLocaleString("fr-FR")} FCFA
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#059669]">
                +8.4%
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500">
              Sur {totalSchools} établissements actifs
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#EDE9FE] text-[#5B21B6] flex items-center justify-center shrink-0">
            <CreditCard size={20} />
          </div>
        </div>

        {/* Card 2: Élèves Couverts */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              ÉLÈVES COUVERTS
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">118 420</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#059669]">
                +12%
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500">
              Moyenne 834 élèves / institution
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#EDE9FE] text-[#5B21B6] flex items-center justify-center shrink-0">
            <GraduationCap size={20} />
          </div>
        </div>

        {/* Card 3: Renouvellements J-30 (Volume in FCFA) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              RENOUVELLEMENTS J-30
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">14 Contrats</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF2F2] text-[#DC2626]">
                5 à relancer
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500">
              Volume cumulé : 21 250 000 FCFA
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#EDE9FE] text-[#5B21B6] flex items-center justify-center shrink-0">
            <Calendar size={20} />
          </div>
        </div>

        {/* Card 4: Taux de Rétention */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              TAUX DE RÉTENTION
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">98.2%</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#059669]">
                +0.6%
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500">
              Churn mensuel sous les 0.4%
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
            <ShieldCheck size={20} />
          </div>
        </div>
      </div>

      {/* Sub-tabs & Billing Switch */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("plans")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "plans"
                ? "bg-[#5B21B6] text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <CreditCard size={14} />
            <span>Grille des Plans (FCFA)</span>
          </button>

          <button
            onClick={() => setActiveTab("active")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "active"
                ? "bg-[#5B21B6] text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Building2 size={14} />
            <span>Abonnements Actifs</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold">
              {totalSchools}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "history"
                ? "bg-[#5B21B6] text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <RefreshCw size={14} />
            <span>Historique des Renouvellements</span>
          </button>
        </div>

        {/* Facturation toggle */}
        <div className="flex items-center gap-3 pt-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
            FACTURATION :
          </span>
          <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-3 py-1 rounded-lg transition-all ${
                billingCycle === "monthly"
                  ? "bg-white text-[#5B21B6] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Mensuelle
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-3 py-1 rounded-lg transition-all ${
                billingCycle === "annual"
                  ? "bg-white text-[#5B21B6] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Annuelle (-15%)
            </button>
          </div>
        </div>
      </div>

      {/* Packages Plateforme eSchool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Packages Plateforme eSchool (Tarifs FCFA)
          </h2>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
            3 offres actives
          </span>
        </div>
        <p className="text-xs text-slate-400 font-medium">
          Facturation en FCFA avec passerelle Mobile Money / Virements CEMAC
        </p>
      </div>

      {/* 3 Pricing Cards in FCFA matching Screen 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Card 1: Starter School */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                ENTRÉE DE GAMME
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                42 écoles actives
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">Starter School</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">295 000 FCFA</span>
                <span className="text-xs font-semibold text-slate-400">/ mois</span>
              </div>
              <p className="text-[11px] text-[#5B21B6] font-semibold mt-1">
                ou 800 FCFA / élève mensuel
              </p>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Idéal pour les petites écoles primaires et collèges privés (&lt; 500 élèves).
            </p>

            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                FONCTIONNALITÉS INCLUSES :
              </p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>Portail Administration &amp; Registre des élèves</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>Relevés de notes, bulletins MINESEC &amp; appréciations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>Pointage des présences &amp; retards quotidiens</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>Application mobile Parents (version Standard)</span>
                </li>
                <li className="flex items-start gap-2 text-slate-400">
                  <Minus size={14} className="text-slate-300 shrink-0 mt-0.5" />
                  <span className="line-through">Module comptable &amp; facturation des frais</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={() => showNotification("Configuration des quotas du forfait Starter School (FCFA)")}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Sliders size={14} />
              <span>Configurer les quotas</span>
            </button>
          </div>
        </div>

        {/* Card 2: Pro Campus (FEATURED) */}
        <div className="bg-white rounded-3xl p-6 border-2 border-[#5B21B6] shadow-xl shadow-purple-100/50 flex flex-col justify-between relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5B21B6] text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
              <Sparkles size={11} />
              <span>LE PLUS POPULAIRE</span>
            </div>
          </div>

          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#5B21B6]">
                STANDARD INSTITUTIONNEL
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#EDE9FE] text-[#5B21B6]">
                76 écoles actives
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">Pro Campus</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">585 000 FCFA</span>
                <span className="text-xs font-semibold text-slate-400">/ mois</span>
              </div>
              <div className="mt-1.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700">
                Couverture complète jusqu'à 2 000 élèves
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Idéal pour les lycées, complexes scolaires et collèges bilingues de référence.
            </p>

            <div className="pt-4 border-t border-purple-100 space-y-2.5">
              <p className="text-[10px] font-black uppercase tracking-wider text-[#5B21B6]">
                TOUTES LES OPTIONS STARTER, ET EN PLUS :
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#5B21B6] shrink-0 mt-0.5" />
                  <span><strong>Module Finance complet</strong> : écolages, relances, Mobile Money</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#5B21B6] shrink-0 mt-0.5" />
                  <span>Messagerie directe sécurisée enseignants / familles</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#5B21B6] shrink-0 mt-0.5" />
                  <span>Génération d'emploi du temps assistée par algorithme</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#5B21B6] shrink-0 mt-0.5" />
                  <span>Modules logistiques : Bibliothèque (CDI) &amp; Transport Scolaire</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-[#5B21B6] shrink-0 mt-0.5" />
                  <span>Portail de télépaiement Orange Money / MTN MoMo intégré</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 space-y-2">
            <button
              onClick={() => showNotification("Modification des tarifs Pro Campus pour les prochains renouvellements")}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-bold shadow-md shadow-purple-200 transition-all hover:scale-[1.01]"
            >
              <Pencil size={14} />
              <span>Modifier le plan</span>
            </button>
            <p className="text-[10px] text-center text-slate-400">
              Modifie les barèmes pour tous les prochains renouvellements
            </p>
          </div>
        </div>

        {/* Card 3: Enterprise Group */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                RÉSEAUX &amp; ENSEIGNEMENT PRIVÉ
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                24 groupes actifs
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">Enterprise Group</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">1 215 000 FCFA</span>
                <span className="text-xs font-semibold text-slate-400">/ mois</span>
              </div>
              <div className="mt-1.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700">
                Élèves Illimités &amp; Multi-sites consolidé
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Groupes scolaires internationaux, secrétariats à l'éducation et grands réseaux d'écoles.
            </p>

            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                EXCLUSIVITÉS GRANDS COMPTES :
              </p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>Architecture Multi-instances &amp; Cloisonnement strict</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>Accès complet API REST, Webhooks &amp; synchronisation ERP</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>Marque blanche intégrale (Domaine propre, charte sur-mesure)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>Engagement SLA 99,99% &amp; Sauvegardes répliquées H24</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>Account Manager dédié &amp; Support prioritaire 24/7</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={() => showNotification("Accès aux accords cadres grands comptes")}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Building2 size={14} />
              <span>Gérer les accords cadres</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prochains Renouvellements de Contrats (30 Jours) Section in FCFA */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-base font-extrabold text-slate-900">
                Prochains Renouvellements de Contrats (30 Jours)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF2F2] text-[#DC2626]">
                5 urgents
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Contrats arrivant à expiration nécessitant validation d'auto-renouvellement ou émission d'avenant d'effectifs en FCFA.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => showNotification("Filtrage des statuts de contrats")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Filter size={13} className="text-slate-400" />
              <span>Filtrer les statuts</span>
            </button>
            <button
              onClick={() => showNotification("Relance groupée envoyée aux 5 établissements en attente de reconduction")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-[#5B21B6] hover:bg-purple-100 text-xs font-bold transition-colors"
            >
              <Send size={13} />
              <span>Relance groupée</span>
            </button>
          </div>
        </div>

        {/* Renewals Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  ÉTABLISSEMENT &amp; TENANT
                </th>
                <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  FORMULE SAAS
                </th>
                <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  ÉCHÉANCE &amp; JAUGE
                </th>
                <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  MONTANT CONTRAT (FCFA)
                </th>
                <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  AUTO-RENOUVELLEMENT
                </th>
                <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400 text-right">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {renewals.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${r.avatarBg}`}
                      >
                        {r.initials}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{r.schoolName}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{r.tenantCode}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-5">
                    <div className="font-semibold text-slate-800 text-xs">{r.planName}</div>
                    <div className="text-[11px] text-slate-400">{r.planNote}</div>
                  </td>

                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-red-600">
                      <Calendar size={12} />
                      <span>Dans {r.daysLeft} jours ({r.dueDate})</span>
                    </div>
                    <div
                      className={`text-[11px] font-medium mt-0.5 ${
                        r.isWarning ? "text-amber-600" : "text-slate-500"
                      }`}
                    >
                      {r.studentsInfo}
                    </div>
                  </td>

                  <td className="py-3.5 px-5">
                    <div className="font-extrabold text-slate-900 text-xs">{r.amount}</div>
                    <div className="text-[10px] text-slate-400">{r.amountDetail}</div>
                  </td>

                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleAutoRenew(r.id)}
                        className={`w-10 h-5 rounded-full transition-colors relative focus:outline-hidden ${
                          r.autoRenew ? "bg-[#5B21B6]" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                            r.autoRenew ? "left-5" : "left-1"
                          }`}
                        />
                      </button>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.autoRenew
                            ? "bg-[#ECFDF5] text-[#059669]"
                            : "bg-[#FEF2F2] text-[#DC2626]"
                        }`}
                      >
                        {r.autoRenew ? "Actif" : "Action Requise"}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-5 text-right">
                    <div className="inline-flex items-center gap-2">
                      {r.actionType === "facture" && (
                        <>
                          <button
                            onClick={() => showNotification(`Facture FCFA émise pour ${r.schoolName}`)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-[11px] font-bold"
                          >
                            <FileText size={12} />
                            <span>Facture</span>
                          </button>
                          <button
                            onClick={() => showNotification(`Notification de reconduction envoyée à ${r.schoolName}`)}
                            className="p-1 rounded-lg bg-[#5B21B6] text-white hover:bg-[#4C1D95]"
                            title="Relancer"
                          >
                            <Send size={12} />
                          </button>
                        </>
                      )}

                      {r.actionType === "devis" && (
                        <button
                          onClick={() => showNotification(`Devis d'ajustement Campus émis pour ${r.schoolName}`)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#5B21B6] text-white hover:bg-[#4C1D95] text-[11px] font-bold shadow-xs"
                        >
                          <CreditCard size={12} />
                          <span>Émettre Devis Campus</span>
                        </button>
                      )}

                      {r.actionType === "sla" && (
                        <>
                          <button
                            onClick={() => showNotification(`Rapport SLA et audits pour ${r.schoolName}`)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-[11px] font-bold"
                          >
                            <ShieldCheck size={12} />
                            <span>Revue SLA</span>
                          </button>
                          <button
                            onClick={() => showNotification(`Relance contractuelle envoyée à ${r.schoolName}`)}
                            className="p-1 rounded-lg bg-[#5B21B6] text-white hover:bg-[#4C1D95]"
                            title="Relancer"
                          >
                            <Send size={12} />
                          </button>
                        </>
                      )}

                      {r.actionType === "details" && (
                        <>
                          <button
                            onClick={() => showNotification(`Détails du contrat pour ${r.schoolName}`)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-[11px] font-bold"
                          >
                            <span>Détails</span>
                          </button>
                          <button
                            onClick={() => showNotification(`Rappel de prélèvement envoyé à ${r.schoolName}`)}
                            className="p-1 rounded-lg bg-[#5B21B6] text-white hover:bg-[#4C1D95]"
                            title="Relancer"
                          >
                            <Send size={12} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="py-3 px-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Affichage de 5 contrats sur 14 renouvellements prévus dans les 30 prochains jours</span>
          <div className="flex items-center gap-1">
            <button disabled className="p-1 text-slate-300 cursor-not-allowed">
              <ChevronLeft size={14} />
            </button>
            <button className="w-6 h-6 rounded-md bg-[#5B21B6] text-white text-xs font-black flex items-center justify-center">
              1
            </button>
            <button className="w-6 h-6 rounded-md text-slate-600 hover:bg-slate-100 text-xs font-semibold flex items-center justify-center">
              2
            </button>
            <button className="p-1 text-slate-700 hover:text-slate-900">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Répartition MRR + Politique de Re-facturation in FCFA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Répartition de la Valeur Facturée par Plan (2/3 width) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Répartition de la Valeur Facturée par Plan (FCFA)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Pondération du MRR global selon les paliers souscrits.
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
              <Layers size={15} />
            </div>
          </div>

          {/* Segmented Bar */}
          <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100">
            <div style={{ width: "15%" }} className="h-full bg-slate-300" title="Starter School: 15%" />
            <div style={{ width: "52%" }} className="h-full bg-[#5B21B6]" title="Pro Campus: 52%" />
            <div style={{ width: "33%" }} className="h-full bg-[#7C3AED]" title="Enterprise Group: 33%" />
          </div>

          {/* 3 Metric Summary Blocks in FCFA */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span>Starter School</span>
              </div>
              <div className="mt-1 text-base sm:text-lg font-black text-slate-900">12 390 000 FCFA /m</div>
              <div className="text-[11px] text-slate-400">15% du MRR</div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5B21B6]" />
                <span>Pro Campus</span>
              </div>
              <div className="mt-1 text-base sm:text-lg font-black text-[#5B21B6]">44 460 000 FCFA /m</div>
              <div className="text-[11px] text-slate-400 font-semibold">52% du MRR</div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" />
                <span>Enterprise Group</span>
              </div>
              <div className="mt-1 text-base sm:text-lg font-black text-slate-900">27 400 000 FCFA /m</div>
              <div className="text-[11px] text-slate-400">33% du MRR</div>
            </div>
          </div>
        </div>

        {/* Right: Politique de Re-facturation */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#5B21B6] flex items-center justify-center">
              <Shield size={20} />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              Politique de Re-facturation
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              En cas de dépassement d'effectif supérieur à 10% sur deux mois consécutifs, le système propose un avenant automatisé en FCFA au responsable d'établissement.
            </p>
          </div>

          <div className="pt-5">
            <button
              onClick={() => showNotification("Gestion des clauses et seuils de dépassement de quota")}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Gérer les clauses de dépassement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
