"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  Banknote,
  Cloud,
  ArrowUpRight,
  Plus,
  Download,
  MoreHorizontal,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  LifeBuoy,
  Database,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function SuperAdminDashboardPage() {
  const [period, setPeriod] = useState<"month" | "quarter" | "year">("quarter");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [serverData, setServerData] = useState<any>(null);

  // Form for New School
  const [newSchoolName, setNewSchoolName] = useState("");
  const [newSchoolCity, setNewSchoolCity] = useState("Yaoundé");
  const [newSchoolRegion, setNewSchoolRegion] = useState("Centre");
  const [newSchoolAdminEmail, setNewSchoolAdminEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/superadmin/data");
      const json = await res.json();
      if (json.success) {
        setServerData(json);
      }
    } catch (e) {
      console.warn("Failed to load superadmin server data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolName) return;

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/superadmin/schools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSchoolName,
          ville: newSchoolCity,
          region: newSchoolRegion,
          email: newSchoolAdminEmail,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Établissement "${newSchoolName}" déployé avec succès sur le serveur distant !`);
        setIsAddModalOpen(false);
        setNewSchoolName("");
        setNewSchoolAdminEmail("");
        fetchDashboardData();
      } else {
        alert(`Erreur: ${data.message}`);
      }
    } catch (err: any) {
      alert(`Erreur: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const metrics = serverData?.metrics || {
    totalSchools: 142,
    activeSchools: 134,
    totalStudents: 84350,
    mrrFCFA: 84250000,
    arrFCFA: 1011000000,
    sla: "99.98%",
  };

  const recentSchools = serverData?.schools?.slice(0, 4) || [
    {
      id: "1",
      name: "Lycée Général Leclerc",
      city: "Yaoundé",
      country: "Centre, Cameroun",
      tenantId: "TEN-LGL-YDE",
      plan: "Enterprise Ultra",
      studentsCount: 1850,
      status: "active",
    },
    {
      id: "2",
      name: "Lycée Polyvalent de Bonabéri",
      city: "Douala",
      country: "Littoral, Cameroun",
      tenantId: "TEN-LPB-DLA",
      plan: "Pro Campus",
      studentsCount: 1200,
      status: "active",
    },
    {
      id: "3",
      name: "Collège Bilingue Polyvalent Deido",
      city: "Douala",
      country: "Littoral, Cameroun",
      tenantId: "TEN-CBPD-DLA",
      plan: "Pro Campus",
      studentsCount: 940,
      status: "active",
    },
    {
      id: "4",
      name: "Lycée Technique Commercial de Bafoussam",
      city: "Bafoussam",
      country: "Ouest, Cameroun",
      tenantId: "TEN-LTC-BAF",
      plan: "Starter Academy",
      studentsCount: 640,
      status: "active",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          {/* Badge */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-purple-50 text-[#5B21B6] border border-purple-200/80">
              SUPERADMIN COCKPIT
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Instances opérationnelles (Base de Données Connectée)
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Vue d'ensemble de la plateforme
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5 max-w-2xl">
            Suivi multi-établissements, croissance globale, revenus récurrents en <strong>FCFA</strong> et statut des instances SaaS en temps réel.
          </p>
        </div>

        {/* Actions Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Timeframe pill selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            <button
              onClick={() => setPeriod("month")}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-all",
                period === "month" ? "bg-white text-slate-900 shadow-xs" : "hover:text-slate-900"
              )}
            >
              Ce mois
            </button>
            <button
              onClick={() => setPeriod("quarter")}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-all",
                period === "quarter" ? "bg-white text-[#5B21B6] shadow-xs font-black" : "hover:text-slate-900"
              )}
            >
              Trimestre
            </button>
            <button
              onClick={() => setPeriod("year")}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-all",
                period === "year" ? "bg-white text-slate-900 shadow-xs" : "hover:text-slate-900"
              )}
            >
              Année
            </button>
          </div>

          {/* Export Report */}
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="h-10 text-xs font-bold border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-xl flex items-center gap-1.5"
          >
            <Download size={15} />
            <span>Exporter rapport</span>
          </Button>

          {/* Add School Primary Button */}
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="h-10 text-xs font-black bg-[#5B21B6] hover:bg-[#4C1D95] text-white rounded-xl shadow-md shadow-purple-900/10 flex items-center gap-1.5"
          >
            <Plus size={16} />
            <span>Ajouter un établissement</span>
          </Button>
        </div>
      </div>

      {/* 2. Top Metric Cards (4 Columns) with FCFA currency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Établissements Actifs */}
        <Card className="border border-slate-200/80 shadow-xs bg-white rounded-2xl">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Établissements Actifs</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#5B21B6] flex items-center justify-center">
                <Building2 size={18} />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                {metrics.totalSchools}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  ↑ +8 ce mois
                </span>
                <span className="text-[11px] text-slate-400 font-medium">vs mois précédent</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Élèves & Enseignants Cumulés */}
        <Card className="border border-slate-200/80 shadow-xs bg-white rounded-2xl">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Élèves &amp; Enseignants Cumulés</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#5B21B6] flex items-center justify-center">
                <Users size={18} />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                {metrics.totalStudents.toLocaleString("fr-FR")}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  ↑ +12.4%
                </span>
                <span className="text-[11px] text-slate-400 font-medium">vs N-1 (exerc. préc.)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Revenus Récurrents (MRR in FCFA) */}
        <Card className="border border-slate-200/80 shadow-xs bg-white rounded-2xl">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Revenus Récurrents (MRR)</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#5B21B6] flex items-center justify-center">
                <Banknote size={18} />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {(metrics.mrrFCFA || 84250000).toLocaleString("fr-FR")} FCFA
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  ↑ +6.8% croissance
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">ARR: 1,01 Md FCFA</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Disponibilité Plateforme (SLA) */}
        <Card className="border border-slate-200/80 shadow-xs bg-white rounded-2xl">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Disponibilité Plateforme (SLA)</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#5B21B6] flex items-center justify-center">
                <Cloud size={18} />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                {metrics.sla || "99.98%"}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Statut stable
                </span>
                <span className="text-[11px] text-slate-400 font-medium">0 incident critique</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Middle Section: MRR Growth Chart (2/3) & Subscription Plans Donut (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 Cols): Line Chart */}
        <Card className="lg:col-span-2 border border-slate-200/80 shadow-xs bg-white rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">Croissance du MRR &amp; Licences (FCFA)</h3>
              <p className="text-xs text-slate-400 mt-0.5">Progression financière consolidée en Francs CFA sur les 12 derniers mois</p>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5B21B6]" />
                <span className="text-slate-600">MRR Réel (FCFA)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="text-slate-400">Objectif</span>
              </div>
            </div>
          </div>

          {/* Interactive Chart Canvas Simulation */}
          <div className="relative pt-6 pb-2">
            {/* Tooltip Pill */}
            <div className="absolute right-12 top-0 bg-slate-900 text-white rounded-xl p-2.5 shadow-xl border border-slate-700 text-center z-10 animate-in zoom-in-95">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">OCTOBRE (MOIS ACTUEL)</p>
              <p className="text-sm font-black text-white">84 250 000 FCFA</p>
              <p className="text-[9px] font-bold text-emerald-400">+9.3M FCFA licences ajoutées</p>
            </div>

            {/* SVG Wave */}
            <div className="h-56 w-full flex items-end">
              <svg viewBox="0 0 800 200" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#5B21B6" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#5B21B6" stopOpacity="0.00" />
                  </linearGradient>
                </defs>
                {/* Grid Lines */}
                <line x1="0" y1="40" x2="800" y2="40" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="90" x2="800" y2="90" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="140" x2="800" y2="140" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />

                {/* Area Fill */}
                <path
                  d="M 30,170 Q 150,165 240,150 T 450,110 T 650,60 T 770,35 L 770,200 L 30,200 Z"
                  fill="url(#purpleGrad)"
                />

                {/* Main Purple Line */}
                <path
                  d="M 30,170 Q 150,165 240,150 T 450,110 T 650,60 T 770,35"
                  fill="none"
                  stroke="#5B21B6"
                  strokeWidth="3.5"
                />

                {/* Points */}
                {[
                  { cx: 30, cy: 170 },
                  { cx: 100, cy: 167 },
                  { cx: 170, cy: 160 },
                  { cx: 240, cy: 150 },
                  { cx: 310, cy: 140 },
                  { cx: 380, cy: 125 },
                  { cx: 450, cy: 110 },
                  { cx: 520, cy: 95 },
                  { cx: 590, cy: 75 },
                  { cx: 660, cy: 55 },
                  { cx: 730, cy: 42 },
                  { cx: 770, cy: 35, active: true },
                ].map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt.cx}
                    cy={pt.cy}
                    r={pt.active ? 6 : 4}
                    fill={pt.active ? "#10B981" : "white"}
                    stroke="#5B21B6"
                    strokeWidth="2.5"
                  />
                ))}
              </svg>
            </div>

            {/* Months Axis */}
            <div className="flex justify-between text-[11px] font-bold text-slate-400 pt-3 border-t border-slate-100">
              {["Nov", "Déc", "Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct"].map((m, idx) => (
                <span key={idx} className={idx === 11 ? "text-[#5B21B6] font-black" : ""}>
                  {m}
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* Right (1 Col): Subscription Plans Donut */}
        <Card className="border border-slate-200/80 shadow-xs bg-white rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-black text-slate-900">Plans d'Abonnement</h3>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreHorizontal size={18} />
              </button>
            </div>
            <p className="text-xs text-slate-400">Répartition des licences actives</p>
          </div>

          {/* Donut Chart Visual */}
          <div className="flex flex-col items-center justify-center my-4 relative">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" stroke="#F1F5F9" strokeWidth="12" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#4338CA"
                  strokeWidth="12"
                  strokeDasharray="128.9 238.7"
                  strokeDashoffset="0"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#7C3AED"
                  strokeWidth="12"
                  strokeDasharray="76.4 238.7"
                  strokeDashoffset="-128.9"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#C4B5FD"
                  strokeWidth="12"
                  strokeDasharray="33.4 238.7"
                  strokeDashoffset="-205.3"
                  fill="none"
                />
              </svg>
              <div className="absolute text-center flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                  {metrics.totalSchools}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">ÉCOLES</span>
              </div>
            </div>
          </div>

          {/* Breakdown List */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4338CA]" />
                <span className="font-bold text-slate-700">eSchool Pro</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-500 font-medium">77 écoles</span>
                <span className="font-black text-slate-900 w-8 text-right">54%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" />
                <span className="font-bold text-slate-700">Enterprise Campus</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-500 font-medium">45 écoles</span>
                <span className="font-black text-slate-900 w-8 text-right">32%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C4B5FD]" />
                <span className="font-bold text-slate-700">Starter Academy</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-500 font-medium">20 écoles</span>
                <span className="font-black text-slate-900 w-8 text-right">14%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 4. Bottom Section: Recent Schools Table (2/3) & System Journal (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 Cols): Recent Schools Table from Remote Server */}
        <Card className="lg:col-span-2 border border-slate-200/80 shadow-xs bg-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">Derniers établissements enregistrés (Serveur)</h3>
              <p className="text-xs text-slate-400 mt-0.5">Données réelles synchronisées depuis la base distante</p>
            </div>
            <Link
              href="/superadmin/schools"
              className="text-xs font-bold text-[#5B21B6] hover:underline flex items-center gap-1"
            >
              <span>Voir tous les établissements ({metrics.totalSchools})</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  <th className="py-2.5">ÉTABLISSEMENT</th>
                  <th className="py-2.5">PAYS / VILLE</th>
                  <th className="py-2.5">PLAN</th>
                  <th className="py-2.5">DATE D'ADHÉSION</th>
                  <th className="py-2.5 text-right">STATUT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentSchools.map((s: any) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#5B21B6] font-black text-xs flex items-center justify-center shrink-0">
                          {s.name
                            .split(" ")
                            .map((w: string) => w[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{s.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">tenant: {s.tenantId}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <span>🇨🇲</span>
                        <span>{s.city}, Cameroun</span>
                      </div>
                    </td>

                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EDE9FE] text-[#5B21B6]">
                        {s.plan}
                      </span>
                    </td>

                    <td className="py-3 text-slate-500 font-medium">
                      24 Oct. 2025
                    </td>

                    <td className="py-3 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Actif
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right (1 Col): System Journal Feed */}
        <Card className="border border-slate-200/80 shadow-xs bg-white rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">Journal Système</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
                  1 alerte
                </span>
              </div>
              <button
                onClick={fetchDashboardData}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                title="Rafraîchir"
              >
                <RefreshCw size={15} />
              </button>
            </div>
            <p className="text-xs text-slate-400">Événements en direct &amp; infrastructure</p>

            {/* Event List */}
            <div className="space-y-3 mt-4">
              {/* Event 1 */}
              <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={15} />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-900">Renouvellement automatique validé</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Lycée Général Leclerc • 1 200 000 FCFA prélevés
                  </p>
                  <span className="text-[10px] text-slate-400">Il y a 14 minutes</span>
                </div>
              </div>

              {/* Event 2 */}
              <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle size={15} />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-amber-900">Quota stockage cloud (94%)</p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Lycée Bonabéri • Seuil 500 Go bientôt atteint
                  </p>
                  <span className="text-[10px] text-amber-600">Il y a 1 heure • Notification envoyée</span>
                </div>
              </div>

              {/* Event 3 */}
              <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                  <LifeBuoy size={15} />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-900">Nouveau ticket support prioritaire</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Export relevé de notes trimestriel MINESEC
                  </p>
                  <span className="text-[10px] text-slate-400">Il y a 3 heures • Pris en charge par N2</span>
                </div>
              </div>

              {/* Event 4 */}
              <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-[#5B21B6] flex items-center justify-center shrink-0 mt-0.5">
                  <Database size={15} />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-900">Sauvegarde quotidienne achevée</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Snapshot {metrics.totalSchools} bases tenants chiffré
                  </p>
                  <span className="text-[10px] text-slate-400">Aujourd'hui à 04:00 (100% Intègre)</span>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/superadmin/security"
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs font-bold text-[#5B21B6] hover:underline"
          >
            <span>Consulter le journal d'audit complet</span>
            <ArrowRight size={14} />
          </Link>
        </Card>
      </div>

      {/* Add School Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#5B21B6] flex items-center justify-center">
                  <Building2 size={16} />
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">Déployer un nouvel établissement</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSchool} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nom de l'établissement *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Lycée Bilingue de Bafoussam"
                  value={newSchoolName}
                  onChange={(e) => setNewSchoolName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] outline-hidden font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ville *</label>
                  <input
                    type="text"
                    required
                    value={newSchoolCity}
                    onChange={(e) => setNewSchoolCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] outline-hidden font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Région *</label>
                  <input
                    type="text"
                    required
                    value={newSchoolRegion}
                    onChange={(e) => setNewSchoolRegion(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] outline-hidden font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email administrateur référent *</label>
                <input
                  type="email"
                  required
                  placeholder="proviseur@etablissement.cm"
                  value={newSchoolAdminEmail}
                  onChange={(e) => setNewSchoolAdminEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] outline-hidden font-medium"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  className="h-9 text-xs"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-9 text-xs font-bold bg-[#5B21B6] hover:bg-[#4C1D95] text-white"
                >
                  {isSubmitting ? "Déploiement..." : "Créer sur le serveur"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
