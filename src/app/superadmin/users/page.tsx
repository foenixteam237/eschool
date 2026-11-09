"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Search,
  ShieldCheck,
  Mail,
  Phone,
  Building2,
  Lock,
  Plus,
  CheckCircle2,
  Clock,
  Filter
} from "lucide-react";
import { superAdminService, EtablissementAbonne } from "@/services/superadmin.service";

interface SuperAdminUser {
  id: string;
  name: string;
  email: string;
  role: "SUPERADMIN" | "ADMIN_ETABLISSEMENT" | "SUPPORT_L2";
  school: string;
  tenantId: string;
  status: "ACTIF" | "INVITE" | "SUSPENDU";
  lastLogin: string;
  mfaEnabled: boolean;
}

const mockUsers: SuperAdminUser[] = [
  {
    id: "usr-1",
    name: "Alexandre De La Tour",
    email: "superadmin@eschool.edu",
    role: "SUPERADMIN",
    school: "Plateforme eSchool Global",
    tenantId: "CORE-SYSTEM",
    status: "ACTIF",
    lastLogin: "Il y a 5 min",
    mfaEnabled: true,
  },
  {
    id: "usr-2",
    name: "Dr. Philippe Moreau",
    email: "p.moreau@condorcet-paris.fr",
    role: "ADMIN_ETABLISSEMENT",
    school: "Lycée Condorcet Paris",
    tenantId: "TEN-7509-PAR",
    status: "ACTIF",
    lastLogin: "Aujourd'hui à 09:42",
    mfaEnabled: true,
  },
  {
    id: "usr-3",
    name: "Mme Claire Vandemeer",
    email: "direction@stegenevieve-bxl.be",
    role: "ADMIN_ETABLISSEMENT",
    school: "Institut Sainte-Geneviève",
    tenantId: "TEN-1050-BXL",
    status: "ACTIF",
    lastLogin: "Hier à 16:15",
    mfaEnabled: true,
  },
  {
    id: "usr-4",
    name: "Aminata Sow",
    email: "admin@cssaintlouis.sn",
    role: "ADMIN_ETABLISSEMENT",
    school: "CS Saint-Louis Dakar",
    tenantId: "TEN-0221-DKR",
    status: "ACTIF",
    lastLogin: "Il y a 3 jours",
    mfaEnabled: false,
  },
  {
    id: "usr-5",
    name: "Nathalie Belkacem",
    email: "n.belkacem@victorhugo-lyon.fr",
    role: "ADMIN_ETABLISSEMENT",
    school: "Académie Victor Hugo",
    tenantId: "TEN-6902-LYN",
    status: "ACTIF",
    lastLogin: "Aujourd'hui à 11:05",
    mfaEnabled: true,
  },
  {
    id: "usr-6",
    name: "Koffi Yao Guillaume",
    email: "direction@horizon-abidjan.edu.ci",
    role: "ADMIN_ETABLISSEMENT",
    school: "Collège Int. Horizon",
    tenantId: "TEN-2250-ABJ",
    status: "ACTIF",
    lastLogin: "Il y a 2 jours",
    mfaEnabled: false,
  },
];

export default function SuperAdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = mockUsers.filter((u) => {
    if (search) {
      const q = search.toLowerCase();
      const match =
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.school.toLowerCase().includes(q) ||
        u.tenantId.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE9FE] text-[#5B21B6] text-xs font-bold mb-2">
            <Users size={13} />
            <span>ACCÈS & GOUVERNANCE</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-semibold tracking-wider text-[11px]">MULTI-TENANT RBAC</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Utilisateurs &amp; Rôles
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Supervision des administrateurs d'établissements, accès superadmin et politique d'authentification double facteur.
          </p>
        </div>

        <button
          onClick={() => alert("Ouverture du formulaire d'invitation d'un administrateur...")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-bold shadow-sm shadow-purple-200 transition-all"
        >
          <Plus size={16} />
          <span>Inviter un Administrateur</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Total Administrateurs
            </span>
            <div className="text-2xl font-black text-slate-900">148 Actifs</div>
            <p className="text-[11px] text-slate-500">1 à 2 par établissement partenaire</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#EDE9FE] text-[#5B21B6] flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Sécurité MFA / 2FA
            </span>
            <div className="text-2xl font-black text-emerald-600">88.5% Activé</div>
            <p className="text-[11px] text-slate-500">Obligatoire pour les rôles financiers</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Sessions Actives
            </span>
            <div className="text-2xl font-black text-slate-900">42 En Ligne</div>
            <p className="text-[11px] text-slate-500">Authentification via JWT chiffré</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Lock size={20} />
          </div>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, email, école ou identifiant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6]"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="all">Tous les Rôles</option>
            <option value="SUPERADMIN">SuperAdmin Platform</option>
            <option value="ADMIN_ETABLISSEMENT">Admin Établissement</option>
            <option value="SUPPORT_L2">Support Technique L2</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  UTILISATEUR
                </th>
                <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  RÔLE SYSTÈME
                </th>
                <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  ÉTABLISSEMENT RATTACHÉ
                </th>
                <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  SÉCURITÉ 2FA
                </th>
                <th className="py-3 px-5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  DERNIÈRE CONNEXION
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {user.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{user.name}</div>
                        <div className="text-[11px] text-slate-400">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-5">
                    {user.role === "SUPERADMIN" ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#EDE9FE] text-[#5B21B6]">
                        SUPERADMIN GLOBAL
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                        ADMIN ÉTABLISSEMENT
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-5">
                    <div className="font-semibold text-slate-800 text-xs">{user.school}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{user.tenantId}</div>
                  </td>

                  <td className="py-3.5 px-5">
                    {user.mfaEnabled ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                        <CheckCircle2 size={12} />
                        Activé (TOTP)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600">
                        <Clock size={12} />
                        Non configuré
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-5 text-slate-500 font-medium text-xs">
                    {user.lastLogin}
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
