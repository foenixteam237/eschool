"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Banknote,
  Users,
  TrendingUp,
  Shield,
  Settings,
  LogOut,
  CheckCircle2,
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth.service";

const menuItems = [
  { href: "/superadmin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/superadmin/schools", label: "Établissements", icon: Building2 },
  { href: "/superadmin/subscriptions", label: "Abonnements & Plans", icon: CreditCard },
  { href: "/superadmin/finances", label: "Facturation & Revenus", icon: Banknote },
  { href: "/superadmin/users", label: "Utilisateurs & Rôles", icon: Users },
  { href: "/superadmin/reports", label: "Rapports & Statistiques", icon: TrendingUp },
  { href: "/superadmin/security", label: "Audit & Sécurité", icon: Shield },
  { href: "/superadmin/settings", label: "Paramètres Système", icon: Settings },
];

export function SuperAdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    }
    router.replace("/login");
  };

  return (
    <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200/80 flex-col justify-between shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto">
      <div>
        {/* Brand Logo Header */}
        <div className="p-6 pb-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4338CA] to-[#6366F1] flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <GraduationCap size={22} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black text-[#1E1B4B] tracking-tight">eSchool</span>
            </div>
            <div className="text-[10px] font-black text-[#4338CA] tracking-widest uppercase">
              SUPERADMIN
            </div>
          </div>
        </div>

        {/* Section Label */}
        <div className="px-6 pt-3 pb-2">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            PLATEFORME CORE
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/superadmin/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all",
                  isActive
                    ? "bg-[#EDE9FE] text-[#5B21B6] shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <Icon size={18} className={cn(isActive ? "text-[#5B21B6]" : "text-slate-400")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Card at Bottom */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center ring-2 ring-slate-200">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">SuperAdmin</p>
            <p className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold">
              <span>Admin Global</span>
              <CheckCircle2 size={11} className="text-emerald-500 shrink-0" />
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
        >
          <LogOut size={14} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}

export default SuperAdminSidebar;
