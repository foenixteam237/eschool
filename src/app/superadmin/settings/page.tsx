"use client";

import React, { useState } from "react";
import {
  Settings,
  Server,
  Globe,
  Bell,
  Save,
  CheckCircle2,
  Mail,
  ShieldCheck,
  CreditCard
} from "lucide-react";

export default function SuperAdminSettingsPage() {
  const [feedback, setFeedback] = useState<string | null>(null);

  const [settings, setSettings] = useState({
    platformName: "eSchool Multi-Tenant",
    systemVersion: "v2.5.4-production",
    defaultCurrency: "FCFA",
    vatRate: 20,
    trialDays: 30,
    maintenanceMode: false,
    enforceMFA: true,
    autoBackupDaily: true,
    alertEmail: "ops@eschool.edu",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback("Paramètres système globaux mis à jour avec succès.");
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE9FE] text-[#5B21B6] text-xs font-bold mb-2">
            <Settings size={13} />
            <span>CONFIGURATION SYSTÈME</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-semibold tracking-wider text-[11px]">GLOBAL SAAS ENGINE</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Paramètres Système &amp; Plateforme
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Gestion des variables d'environnement centralisées, devise par défaut, passerelles et politiques d'onboarding.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-bold shadow-sm shadow-purple-200 transition-all hover:scale-[1.02]"
        >
          <Save size={16} />
          <span>Enregistrer les Modifications</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Généralités de la plateforme */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5B21B6] flex items-center justify-center">
              <Globe size={16} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Identité &amp; Versioning Plateforme</h3>
              <p className="text-[11px] text-slate-400">Paramètres visuels et marque blanche</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nom officiel de l'infrastructure SaaS
              </label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Version courante du cluster
              </label>
              <input
                type="text"
                disabled
                value={settings.systemVersion}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Tarification & Devise */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CreditCard size={16} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Facturation &amp; Périodes d'Essai</h3>
              <p className="text-[11px] text-slate-400">Règles financières automatiques lors de l'onboarding</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Devise de référence par défaut
              </label>
              <select
                value={settings.defaultCurrency}
                onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] outline-hidden"
              >
                <option value="EUR">Euros (€ - EUR)</option>
                <option value="XOF">Francs CFA (FCFA - XOF / XAF)</option>
                <option value="USD">Dollars US ($ - USD)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Durée d'essai gratuit pour nouvelles écoles (jours)
              </label>
              <input
                type="number"
                value={settings.trialDays}
                onChange={(e) => setSettings({ ...settings, trialDays: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Taux de TVA par défaut (%)
              </label>
              <input
                type="number"
                value={settings.vatRate}
                onChange={(e) => setSettings({ ...settings, vatRate: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Politiques de Sécurité Globale */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Politiques de Sécurité &amp; Alertes Ops</h3>
              <p className="text-[11px] text-slate-400">Exigences d'authentification et surveillance</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={settings.enforceMFA}
                onChange={(e) => setSettings({ ...settings, enforceMFA: e.target.checked })}
                className="w-4 h-4 rounded text-[#5B21B6] focus:ring-[#5B21B6]"
              />
              <div>
                <span className="font-bold text-xs text-slate-800 block">Exiger le 2FA (MFA) pour tous les administrateurs d'écoles</span>
                <span className="text-[11px] text-slate-400">Sécurise les comptes habilités à consulter les notes et paiements</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={settings.autoBackupDaily}
                onChange={(e) => setSettings({ ...settings, autoBackupDaily: e.target.checked })}
                className="w-4 h-4 rounded text-[#5B21B6] focus:ring-[#5B21B6]"
              />
              <div>
                <span className="font-bold text-xs text-slate-800 block">Sauvegarde automatique nocturne H24</span>
                <span className="text-[11px] text-slate-400">Snapshot chiffré répliqué sur 2 régions cloud distinctes</span>
              </div>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
