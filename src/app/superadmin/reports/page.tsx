"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Download,
  Calendar,
  Building2,
  Users,
  CheckCircle2,
  ArrowUpRight,
  PieChart,
  BarChart3,
  FileSpreadsheet
} from "lucide-react";

export default function SuperAdminReportsPage() {
  const [feedback, setFeedback] = useState<string | null>(null);

  const downloadReport = (title: string) => {
    setFeedback(`Génération et téléchargement du rapport "${title}"...`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE9FE] text-[#5B21B6] text-xs font-bold mb-2">
            <TrendingUp size={13} />
            <span>BUSINESS INTELLIGENCE</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-semibold tracking-wider text-[11px]">ANALYTICS &amp; KPI</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Rapports &amp; Statistiques Globales
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Indicateurs d'adoption, consommation de quotas, croissance du parc d'établissements et exports comptables.
          </p>
        </div>

        <button
          onClick={() => downloadReport("Synthèse Trimestrielle SaaS")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-bold shadow-sm shadow-purple-200 transition-all"
        >
          <Download size={16} />
          <span>Exporter Synthèse Globale (PDF/XLS)</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Croissance MoM
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">+14.2%</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
              Record
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Nouveaux campus intégrés</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Volume Heures Emploi du Temps
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">142 800 h</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Planifiées sur le réseau</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Taux d'Usage Quotidien
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#5B21B6]">91.4%</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
              Élevé
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Connexions profs &amp; admin</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Stockage Cloud Consommé
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">1.84 To</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Bulletins, cours &amp; pièces jointes</p>
        </div>
      </div>

      {/* Reports Available for Export */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <h3 className="font-extrabold text-base text-slate-900">
          Rapports Disponibles au Téléchargement
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#5B21B6] flex items-center justify-center">
                <FileSpreadsheet size={20} />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs">Rapport Financier &amp; Règlements FEC</div>
                <div className="text-[11px] text-slate-400">Conformité fiscale et écritures comptables</div>
              </div>
            </div>
            <button
              onClick={() => downloadReport("Rapport Financier & Règlements FEC")}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            >
              <Download size={15} />
            </button>
          </div>

          <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Users size={20} />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs">Statistiques d'Effectifs &amp; Saturation Quotas</div>
                <div className="text-[11px] text-slate-400">Établissements nécessitant un surclassement de formule</div>
              </div>
            </div>
            <button
              onClick={() => downloadReport("Statistiques d'Effectifs & Saturation Quotas")}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            >
              <Download size={15} />
            </button>
          </div>

          <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <BarChart3 size={20} />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs">Audit de Disponibilité &amp; Latence API</div>
                <div className="text-[11px] text-slate-400">Temps de réponse p95 et uptime par cluster</div>
              </div>
            </div>
            <button
              onClick={() => downloadReport("Audit de Disponibilité & Latence API")}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            >
              <Download size={15} />
            </button>
          </div>

          <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <PieChart size={20} />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs">Rapport Pédagogique Global</div>
                <div className="text-[11px] text-slate-400">Moyennes agrégées, évaluations saisies et présences</div>
              </div>
            </div>
            <button
              onClick={() => downloadReport("Rapport Pédagogique Global")}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            >
              <Download size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
