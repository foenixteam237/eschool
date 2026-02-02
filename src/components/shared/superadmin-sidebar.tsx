"use client";

import React from "react";
import Link from "next/link";
import { Home, School2, Users, Settings, Banknote, BarChart2, ShieldAlert, Bell, LifeBuoy, User } from "lucide-react";

const items = [
  { href: "/superadmin/dashboard", label: "Dashboard Global", icon: Home },
  { href: "/superadmin/schools", label: "Gestion des Écoles", icon: School2 },
  { href: "/superadmin/users", label: "Utilisateurs Globaux", icon: Users },
  { href: "/superadmin/config", label: "Configuration Système", icon: Settings },
  { href: "/superadmin/finances", label: "Finances Globales", icon: Banknote },
  { href: "/superadmin/reports", label: "Rapports & Analytics", icon: BarChart2 },
  { href: "/superadmin/security", label: "Sécurité & Logs", icon: ShieldAlert },
  { href: "/superadmin/notifications", label: "Notifications Broadcast", icon: Bell },
  { href: "/superadmin/support", label: "Support & Tickets", icon: LifeBuoy },
  { href: "/superadmin/profile", label: "Profil SuperAdmin", icon: User },
];

export function SuperAdminSidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-[var(--color-superadmin-primary)] to-[var(--color-superadmin-accent)] text-white min-h-screen p-4 gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-md flex items-center justify-center text-white font-bold">EA</div>
          <div>
            <div className="text-sm font-semibold">eSchool Admin</div>
            <div className="text-xs opacity-80">SuperAdmin</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-auto">
        <ul className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link href={item.href} className="flex items-center gap-3 p-2 rounded-md hover:bg-white/10 transition-colors">
                  <Icon size={16} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="text-xs opacity-90">Version SuperAdmin</div>
    </aside>
  );
}

export default SuperAdminSidebar;
