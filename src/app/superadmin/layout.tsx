"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SuperAdminSidebar } from "@/components/shared/superadmin-sidebar";
import { useAuthStore } from "@/hooks/use-auth-store";
import { Search, Bell, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";

import { MobileMenu } from "@/components/shared/mobile-menu";

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user && user.role !== "SUPERADMIN") {
      router.replace("/");
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased">
      {/* Sidebar (Desktop) */}
      <SuperAdminSidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-3.5 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2.5 sm:gap-4 flex-1 max-w-md">
            <div className="lg:hidden shrink-0">
              <MobileMenu role="superadmin" />
            </div>
            {/* Search bar */}
            <div className="relative flex-1 max-w-xs sm:max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <Input
                placeholder="Rechercher un établissement..."
                className="pl-9 h-9 text-xs bg-slate-50 border-slate-200/80 rounded-full focus:bg-white focus:ring-1 focus:ring-indigo-600 w-full"
              />
            </div>
          </div>

          {/* Right badges & profile */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* SaaS Status Pill */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-bold text-emerald-800 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>SaaS v2.5 En ligne</span>
            </div>

            {/* Notification Bell */}
            <button
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center">
                8
              </span>
            </button>

            {/* Profile Avatar Thumbnail */}
            <div className="flex items-center gap-2 cursor-pointer pl-1">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center ring-2 ring-indigo-100 shadow-xs">
                SA
              </div>
              <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 p-3.5 sm:p-6 md:p-8 space-y-6 max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
