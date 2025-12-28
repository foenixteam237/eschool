"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    CreditCard,
    MessageSquare,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    GraduationCap,
    ClipboardCheck,
    FileText
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/hooks/use-auth-store";

interface SidebarProps {
    role: string;
}

export function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const menuItems = {
        admin: [
            { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
            { icon: Users, label: "Élèves", href: "/admin/students" },
            { icon: GraduationCap, label: "Enseignants", href: "/admin/teachers" },
            { icon: BookOpen, label: "Classes & Matières", href: "/admin/academics" },
            { icon: ClipboardCheck, label: "Assiduité", href: "/admin/attendance" },
            { icon: FileText, label: "Notes", href: "/admin/grades" },
            { icon: CreditCard, label: "Finance", href: "/admin/finance" },
            { icon: MessageSquare, label: "Messagerie", href: "/admin/messages" },
            { icon: Settings, label: "Paramètres", href: "/admin/settings" },
        ],
        teacher: [
            { icon: LayoutDashboard, label: "Dashboard", href: "/teacher/dashboard" },
            { icon: Users, label: "Appel / Présences", href: "/teacher/attendance" },
            { icon: GraduationCap, label: "Notes", href: "/teacher/grades" },
            { icon: BookOpen, label: "Cahier de Texte", href: "/teacher/lesson-log" },
            { icon: MessageSquare, label: "Messagerie", href: "/teacher/messages" },
            { icon: Settings, label: "Mon Profil", href: "/teacher/profile" },
        ],
        parent: [
            { icon: LayoutDashboard, label: "Dashboard", href: "/parent/dashboard" },
            { icon: Users, label: "Mes Enfants", href: "/parent/children" },
            { icon: CreditCard, label: "Paiements", href: "/parent/payments" },
            { icon: MessageSquare, label: "Messagerie", href: "/parent/messages" },
            { icon: Settings, label: "Mon Profil", href: "/parent/profile" },
        ],
        eleve: [
            { icon: LayoutDashboard, label: "Dashboard", href: "/eleve/dashboard" },
            { icon: BookOpen, label: "Mes Cours", href: "/eleve/courses" },
            { icon: GraduationCap, label: "Mes Résultats", href: "/eleve/results" },
            { icon: MessageSquare, label: "Messagerie", href: "/eleve/messages" },
            { icon: Settings, label: "Mon Profil", href: "/eleve/profile" },
        ],
    };

    const items = menuItems[role as keyof typeof menuItems] || [];

    return (
        <aside
            className={cn(
                "flex flex-col bg-white border-r border-slate-200 transition-all duration-300 h-screen sticky top-0",
                collapsed ? "w-20" : "w-64"
            )}
        >
            <div className="p-4 flex items-center justify-between border-b border-slate-100 h-16">
                {!collapsed && (
                    <div className="flex items-center gap-2 font-bold text-primary-blue">
                        <GraduationCap size={24} />
                        <span className="text-lg">eSchool</span>
                    </div>
                )}
                {collapsed && <GraduationCap size={28} className="text-primary-blue mx-auto" />}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden md:flex"
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </Button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {items.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 p-2 rounded-lg transition-colors",
                            pathname.startsWith(item.href)
                                ? "bg-blue-50 text-primary-blue font-semibold"
                                : "text-slate-600 hover:bg-slate-50"
                        )}
                    >
                        <item.icon size={20} className={pathname.startsWith(item.href) ? "text-primary-blue" : "text-slate-400"} />
                        {!collapsed && <span>{item.label}</span>}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className={cn(
                        "w-full flex items-center gap-3 text-red-500 hover:bg-red-50 hover:text-red-600",
                        collapsed ? "justify-center" : "justify-start"
                    )}
                >
                    <LogOut size={20} />
                    {!collapsed && <span>Déconnexion</span>}
                </Button>
            </div>
        </aside>
    );
}
