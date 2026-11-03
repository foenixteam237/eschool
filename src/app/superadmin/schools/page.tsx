"use client";

import React, { useEffect, useState } from "react";
import {
  Building2,
  Search,
  Plus,
  X,
  ShieldCheck,
  Rocket,
  AlertTriangle,
  Globe,
  RotateCw,
  Upload,
  CheckCircle2,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  GraduationCap
} from "lucide-react";

interface SchoolTenantItem {
  id: string;
  name: string;
  city: string;
  country: string;
  tenantId: string;
  avatarBg: string;
  adminName: string;
  adminEmail: string;
  plan: "Enterprise Ultra" | "Pro Campus" | "Starter Academy";
  studentsCount: number;
  studentsQuota: number;
  isSaturated?: boolean;
  renewalDate: string;
  renewalType: "auto" | "annual" | "trial" | "overdue";
  renewalDaysLeft?: number;
  status: "active" | "trial" | "suspended" | "onboarding";
}

export default function SuperAdminSchoolsPage() {
  const [schools, setSchools] = useState<SchoolTenantItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "trial" | "suspended">("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [territoryFilter, setTerritoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nom: "",
    ville: "Yaoundé",
    region: "Centre",
    planAbonnement: "Pro Campus",
    adminNom: "",
    adminPrenom: "",
    adminEmail: "",
    adminTelephone: "+237 ",
  });

  const loadSchoolsFromServer = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/superadmin/data");
      const json = await res.json();
      if (json.success && Array.isArray(json.schools)) {
        setSchools(json.schools);
      }
    } catch (e) {
      console.warn("Failed to load schools from server:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSchoolsFromServer();
  }, []);

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.nom || !formData.adminEmail) {
      setFormError("Veuillez renseigner le nom de l'établissement et l'email administrateur.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/superadmin/schools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.nom,
          ville: formData.ville,
          region: formData.region,
          email: formData.adminEmail,
          phone: formData.adminTelephone,
        }),
      });

      const result = await res.json();
      if (!result.success) {
        throw new Error(result.message || "Erreur de création");
      }

      await loadSchoolsFromServer();
      setSuccessMsg(`L'établissement ${formData.nom} a été déployé avec succès sur la base de données.`);
      setIsModalOpen(false);
      setFormData({
        nom: "",
        ville: "Yaoundé",
        region: "Centre",
        planAbonnement: "Pro Campus",
        adminNom: "",
        adminPrenom: "",
        adminEmail: "",
        adminTelephone: "+237 ",
      });
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de la création de l'établissement.";
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSchools = schools.filter((school) => {
    if (search) {
      const q = search.toLowerCase();
      const match =
        school.name.toLowerCase().includes(q) ||
        school.city.toLowerCase().includes(q) ||
        school.country.toLowerCase().includes(q) ||
        school.tenantId.toLowerCase().includes(q) ||
        school.adminName.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (statusFilter !== "all" && school.status !== statusFilter) {
      return false;
    }

    if (planFilter !== "all" && school.plan !== planFilter) {
      return false;
    }

    if (territoryFilter !== "all" && !school.country.toLowerCase().includes(territoryFilter.toLowerCase())) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner Badge & Title matching Screen 3 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE9FE] text-[#5B21B6] text-xs font-bold mb-2">
            <Building2 size={13} />
            <span>Multi-Tenant Fleet (Base de Données)</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-semibold tracking-wider text-[11px]">REGION: AFRIQUE / CEMAC (FCFA)</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Gestion des Établissements Scolaires
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Supervision des instances scolaires enregistrées sur le serveur distant, accès direct et quotas en temps réel.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert("Génération du modèle d'import CSV des établissements...")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold shadow-xs transition-colors"
          >
            <Upload size={14} className="text-slate-500" />
            <span>Import massif CSV</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-bold shadow-sm shadow-purple-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={16} />
            <span>Nouvel Établissement</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 3 Metric KPI Cards (matching Screen 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Actifs & Connectés */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-2">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              ACTIFS &amp; CONNECTÉS
            </div>
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl font-black text-slate-900">142</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF5] text-[#059669]">
                +12 ce mois
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500">
              97.8% taux de disponibilité réseau
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
            <ShieldCheck size={24} />
          </div>
        </div>

        {/* Card 2: En Déploiement */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-2">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              EN DÉPLOIEMENT
            </div>
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl font-black text-slate-900">6</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#EEF2FF] text-[#4F46E5]">
                Onboarding
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500">
              4 en configuration DNS, 2 import SIS
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0">
            <Rocket size={24} />
          </div>
        </div>

        {/* Card 3: Instances Suspendues */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-2">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              INSTANCES SUSPENDUES
            </div>
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl font-black text-slate-900">2</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF2F2] text-[#DC2626]">
                Alerte Facturation
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500">
              1 impayé récurrent, 1 fin d'exercice échu
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center shrink-0">
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar matching Screen 3 */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrer par nom d'école ou tenant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6]"
            />
          </div>

          {/* Status Tabs */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === "all"
                  ? "bg-white text-slate-900 font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Tous ({schools.length})
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === "active"
                  ? "bg-white text-slate-900 font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Actifs
            </button>
            <button
              onClick={() => setStatusFilter("trial")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === "trial"
                  ? "bg-white text-slate-900 font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Essai
            </button>
            <button
              onClick={() => setStatusFilter("suspended")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === "suspended"
                  ? "bg-white text-slate-900 font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Suspendus
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Plans Filter */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
          >
            <option value="all">Tous les Plans</option>
            <option value="Enterprise Ultra">Enterprise Ultra</option>
            <option value="Pro Campus">Pro Campus</option>
            <option value="Starter Academy">Starter Academy</option>
          </select>

          {/* Territories Filter */}
          <div className="relative">
            <select
              value={territoryFilter}
              onChange={(e) => setTerritoryFilter(e.target.value)}
              className="pl-8 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer appearance-none"
            >
              <option value="all">Toutes les Régions</option>
              <option value="Centre">Centre (Yaoundé)</option>
              <option value="Littoral">Littoral (Douala)</option>
              <option value="Ouest">Ouest (Bafoussam)</option>
              <option value="Nord">Nord (Garoua)</option>
              <option value="Sud">Sud (Ebolowa)</option>
            </select>
            <Globe size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Refresh Button */}
          <button
            onClick={loadSchoolsFromServer}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Rafraîchir depuis le serveur"
          >
            <RotateCw size={15} />
          </button>
        </div>
      </div>

      {/* Main Schools Fleet Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  ÉTABLISSEMENT
                </th>
                <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  ADMINISTRATEUR RÉFÉRENT
                </th>
                <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  FORMULE &amp; LICENCE
                </th>
                <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  QUOTA ÉLÈVES
                </th>
                <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  ÉCHÉANCE
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredSchools.map((school) => {
                const percent = Math.round((school.studentsCount / school.studentsQuota) * 100);
                const isOverdue = school.renewalType === "overdue";
                const isTrial = school.renewalType === "trial";

                return (
                  <tr key={school.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Établissement column */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shadow-xs shrink-0 ${school.avatarBg || "bg-[#5B21B6] text-white"}`}
                        >
                          {school.name
                            .split(" ")
                            .map((w) => w[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            {school.name}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <MapPin size={10} />
                              {school.city}, {school.country}
                            </span>
                            <span>•</span>
                            <span className="font-mono text-[10px] text-slate-500">ID: {school.tenantId}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Administrateur Référent */}
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-slate-800 text-xs">{school.adminName}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{school.adminEmail}</div>
                    </td>

                    {/* Formule & Licence */}
                    <td className="py-3.5 px-5">
                      {school.plan === "Enterprise Ultra" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#EDE9FE] text-[#5B21B6]">
                          <Sparkles size={11} />
                          Enterprise Ultra
                        </span>
                      )}
                      {school.plan === "Pro Campus" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                          <GraduationCap size={11} />
                          Pro Campus
                        </span>
                      )}
                      {school.plan === "Starter Academy" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                          <GraduationCap size={11} />
                          Starter Academy
                        </span>
                      )}
                    </td>

                    {/* Quota Élèves with Progress Bar */}
                    <td className="py-3.5 px-5 min-w-[180px]">
                      <div className="flex items-center justify-between text-[11px] mb-1 font-semibold">
                        <span className="text-slate-800">
                          {school.studentsCount.toLocaleString("fr-FR")} / {school.studentsQuota.toLocaleString("fr-FR")}
                        </span>
                        <span
                          className={`text-[10px] font-bold ${
                            school.isSaturated ? "text-red-600" : percent > 85 ? "text-indigo-900" : "text-slate-500"
                          }`}
                        >
                          {percent}% {school.isSaturated && "(Saturé)"}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            school.isSaturated
                              ? "bg-red-500"
                              : percent > 80
                              ? "bg-[#5B21B6]"
                              : percent > 60
                              ? "bg-slate-400"
                              : "bg-indigo-300"
                          }`}
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        />
                      </div>
                    </td>

                    {/* Échéance */}
                    <td className="py-3.5 px-5">
                      <div
                        className={`font-semibold text-xs ${
                          isOverdue || isTrial ? "text-red-600" : "text-slate-800"
                        }`}
                      >
                        {school.renewalDate}
                      </div>
                      <div
                        className={`text-[10px] ${
                          isOverdue
                            ? "text-red-600 font-bold"
                            : isTrial
                            ? "text-red-500 font-medium"
                            : "text-slate-400 font-normal"
                        }`}
                      >
                        {school.renewalType === "auto" && "Renouvellement auto"}
                        {school.renewalType === "annual" && "Annuel récurrent"}
                        {school.renewalType === "trial" && `Fin d'essai (J-${school.renewalDaysLeft})`}
                        {school.renewalType === "overdue" && `Échu (+${school.renewalDaysLeft}j)`}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="py-3.5 px-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-3">
            <span>
              Affichage de 1 à {filteredSchools.length} sur {schools.length} établissements
            </span>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="text-slate-300">•</span>
              <select className="bg-transparent border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700">
                <option>8 par page</option>
                <option>16 par page</option>
                <option>32 par page</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled
              className="flex items-center gap-1 px-2.5 py-1 text-slate-300 text-xs font-semibold cursor-not-allowed"
            >
              <ChevronLeft size={13} />
              <span>Précédent</span>
            </button>
            <button className="w-7 h-7 rounded-lg bg-[#5B21B6] text-white text-xs font-black flex items-center justify-center shadow-xs">
              1
            </button>
            <button className="w-7 h-7 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold flex items-center justify-center">
              2
            </button>
            <button className="flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:text-slate-900 text-xs font-semibold">
              <span>Suivant</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Real Creation Modal connected to PostgreSQL Backend */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EDE9FE] text-[#5B21B6] flex items-center justify-center">
                  <Building2 size={18} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Déployer un nouvel établissement
                  </h3>
                  <p className="text-xs text-slate-400">Provisioning multi-tenant sur la base distante</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateSchool} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Nom officiel de l'établissement *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Lycée d'Excellence de Yaoundé"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Ville *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ville}
                    onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Région / Territoire *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Formule SaaS (FCFA)
                  </label>
                  <select
                    value={formData.planAbonnement}
                    onChange={(e) => setFormData({ ...formData, planAbonnement: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] outline-hidden font-medium"
                  >
                    <option value="Starter Academy">Starter Academy (295 000 FCFA/m)</option>
                    <option value="Pro Campus">Pro Campus (585 000 FCFA/m)</option>
                    <option value="Enterprise Ultra">Enterprise Ultra (1 215 000 FCFA/m)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    value={formData.adminTelephone}
                    onChange={(e) => setFormData({ ...formData, adminTelephone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                  ADMINISTRATEUR RÉFÉRENT
                </p>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Email professionnel *</label>
                  <input
                    type="email"
                    required
                    placeholder="direction@etablissement.cm"
                    value={formData.adminEmail}
                    onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-bold shadow-md shadow-purple-200 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Déploiement en cours..." : "Créer l'instance école"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
