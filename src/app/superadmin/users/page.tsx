"use client";

import React, { useEffect, useState } from "react";
import { Mail, Phone } from "lucide-react";
import { superAdminService, EtablissementAbonne } from "@/services/superadmin.service";

export default function SuperAdminUsersPage() {
  const [schools, setSchools] = useState<EtablissementAbonne[]>([]);

  useEffect(() => {
    superAdminService.getSubscribedSchools().then(setSchools);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Comptes Administrateurs d&apos;Établissements
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Gestion des accès des proviseurs, directeurs et administrateurs habilités par école
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schools.map((s) => (
          <div
            key={s.id}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded">
                Admin École
              </span>
              <span className="text-xs text-slate-400">Établissement: {s.code}</span>
            </div>

            <div className="mt-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {s.adminReferent.prenom} {s.adminReferent.nom}
              </h3>
              <p className="text-xs text-slate-500">{s.nom}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-slate-400" />
                <span>{s.adminReferent.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-slate-400" />
                <span>{s.adminReferent.telephone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
