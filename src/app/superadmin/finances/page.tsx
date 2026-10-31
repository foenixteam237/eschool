"use client";

import React, { useEffect, useState } from "react";
import { DollarSign, CheckCircle2, Clock, AlertTriangle, Download, ArrowUpRight } from "lucide-react";
import { superAdminService, EtablissementAbonne } from "@/services/superadmin.service";

export default function SuperAdminFinancesPage() {
  const [schools, setSchools] = useState<EtablissementAbonne[]>([]);

  useEffect(() => {
    superAdminService.getSubscribedSchools().then(setSchools);
  }, []);

  const totalRevenu = schools.reduce((acc, s) => acc + (s.montantAnnuelFCFA || 0), 0);
  const totalPaye = schools
    .filter((s) => s.statutPaiement === "A_JOUR")
    .reduce((acc, s) => acc + (s.montantAnnuelFCFA || 0), 0);
  const totalImpaye = totalRevenu - totalPaye;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Finances SaaS & Abonnements Plateforme
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Suivi des souscriptions annuelles payées par les établissements scolaires
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Revenu Annuel Total
          </span>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            {totalRevenu.toLocaleString("fr-FR")} FCFA
          </div>
          <span className="text-xs text-slate-400">Total des contrats signés</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Montant Recouvré (À jour)
          </span>
          <div className="mt-2 text-2xl font-bold text-emerald-600 tabular-nums">
            {totalPaye.toLocaleString("fr-FR")} FCFA
          </div>
          <span className="text-xs text-emerald-700 font-medium">
            {totalRevenu > 0 ? Math.round((totalPaye / totalRevenu) * 100) : 0}% de recouvrement
          </span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Montants en Attente ou Impayés
          </span>
          <div className="mt-2 text-2xl font-bold text-rose-600 tabular-nums">
            {totalImpaye.toLocaleString("fr-FR")} FCFA
          </div>
          <span className="text-xs text-rose-700 font-medium">À relancer sous 15 jours</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs p-5">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">
          Échéancier de Facturation des Établissements
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <th className="py-2.5 px-3">Établissement</th>
                <th className="py-2.5 px-3">Formule</th>
                <th className="py-2.5 px-3 tabular-nums">Échéance</th>
                <th className="py-2.5 px-3 text-right tabular-nums">Montant FCFA</th>
                <th className="py-2.5 px-3 text-center">Statut Facture</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {schools.map((school) => (
                <tr key={school.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100">
                    {school.nom}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                    {school.planAbonnement}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400 tabular-nums">
                    {school.dateEcheance}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                    {school.montantAnnuelFCFA.toLocaleString("fr-FR")}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`font-semibold ${
                        school.statutPaiement === "A_JOUR"
                          ? "text-emerald-600"
                          : school.statutPaiement === "RETARD"
                          ? "text-amber-600"
                          : "text-rose-600"
                      }`}
                    >
                      {school.statutPaiement === "A_JOUR"
                        ? "Soldé"
                        : school.statutPaiement === "RETARD"
                        ? "Retard"
                        : "Impayé"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
