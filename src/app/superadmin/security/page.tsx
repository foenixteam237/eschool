"use client";

import React, { useState } from "react";
import {
  Shield,
  Lock,
  Key,
  Database,
  CheckCircle2,
  AlertTriangle,
  Server,
  RefreshCw,
  HardDrive
} from "lucide-react";

export default function SuperAdminSecurityPage() {
  const [feedback, setFeedback] = useState<string | null>(null);

  const runSnapshot = () => {
    setFeedback("Sauvegarde manuelle chiffrée déclenchée sur les 142 bases tenants...");
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE9FE] text-[#5B21B6] text-xs font-bold mb-2">
            <Shield size={13} />
            <span>INFRASTRUCTURE &amp; COMPLIANCE</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-semibold tracking-wider text-[11px]">ISO 27001 / RGPD</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Audit, Sécurité &amp; Sauvegardes
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Supervision de l'isolation logique des bases de données par école, chiffrement AES-256 et registre d'intégrité.
          </p>
        </div>

        <button
          onClick={runSnapshot}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-bold shadow-sm shadow-purple-200 transition-all"
        >
          <Database size={16} />
          <span>Déclencher Snapshot Chiffré H24</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Security Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Isolation Multi-Tenant
            </span>
            <div className="text-2xl font-black text-emerald-600">100% Hermétique</div>
            <p className="text-[11px] text-slate-500">Row-Level Security &amp; schémas dédiés</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Lock size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Chiffrement Data-at-Rest
            </span>
            <div className="text-2xl font-black text-slate-900">AES-256 GCM</div>
            <p className="text-[11px] text-slate-500">Clés rotatives gérées par KMS</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-[#5B21B6] flex items-center justify-center">
            <Key size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Dernière Sauvegarde
            </span>
            <div className="text-2xl font-black text-slate-900">Aujourd'hui 04:00</div>
            <p className="text-[11px] text-emerald-600 font-semibold">142 instances répliquées</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <HardDrive size={20} />
          </div>
        </div>
      </div>

      {/* Security Audit Feed */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <h3 className="font-extrabold text-base text-slate-900">
          Journal d'Audit Système &amp; Événements de Sécurité
        </h3>

        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <div>
                <span className="font-bold text-slate-900">Sauvegarde automatique nocturne</span>
                <span className="text-slate-400 ml-2">Snapshot chiffré des 142 bases d'établissements complété sans erreur</span>
              </div>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">04:00:12 UTC</span>
          </div>

          <div className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <div>
                <span className="font-bold text-slate-900">Renouvellement automatique de certificat SSL</span>
                <span className="text-slate-400 ml-2">Domaines d'établissements wildcards *.eschool.edu</span>
              </div>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">Hier à 22:30</span>
          </div>

          <div className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <div>
                <span className="font-bold text-slate-900">Connexion SuperAdmin authentifiée</span>
                <span className="text-slate-400 ml-2">Session ouverte depuis IP autorisée avec validation 2FA réussie</span>
              </div>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">Il y a 25 min</span>
          </div>
        </div>
      </div>
    </div>
  );
}
