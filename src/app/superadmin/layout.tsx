"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SuperAdminSidebar } from "@/components/shared/superadmin-sidebar";
import { SuperAdminBadge } from "@/components/shared/superadmin-badge";
import { useAuthStore } from "@/hooks/use-auth-store";

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, checkAuth } = useAuthStore();

  useEffect(() => {
    // Ensure auth state is initialized
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Redirect non-superadmin users
    if (user && user.role !== "SUPERADMIN") {
      router.replace("/");
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SuperAdminSidebar />

      <div className="flex-1 p-6">
        <header className="flex items-center justify-end mb-6">
          <div className="flex items-center gap-4">
            <SuperAdminBadge />
          </div>
        </header>

        <main className="space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
