"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/shared/sidebar";
import { Navbar } from "@/components/shared/navbar";
import { useAuthStore } from "@/hooks/use-auth-store";

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useAuthStore();
    const [displayName, setDisplayName] = useState("Élève");

    useEffect(() => {
        if (user && (user.firstName || user.lastName)) {
            setDisplayName(`${user.firstName} ${user.lastName}`.trim());
        } else {
            fetch("/api/auth/profile")
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (data?.data) {
                        const u = data.data;
                        const name = `${u.firstName || ""} ${u.lastName || ""}`.trim();
                        if (name) setDisplayName(name);
                    }
                })
                .catch(() => {});
        }
    }, [user]);

    return (
        <div className="flex bg-slate-50 min-h-screen">
            <div className="hidden md:block">
                <Sidebar role="eleve" />
            </div>
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar
                    title="Espace Élève"
                    userName={displayName}
                    userRole="Élève"
                    role="eleve"
                />
                <main className="p-3.5 sm:p-5 md:p-8 max-w-full overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
