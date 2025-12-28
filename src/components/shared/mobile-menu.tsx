"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Menu,
    X,
    GraduationCap,
    LayoutDashboard,
    Users,
    BookOpen,
    CreditCard,
    MessageSquare,
    Settings,
    LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/hooks/use-auth-store";

interface MobileMenuProps {
    role: string;
}

export function MobileMenu({ role }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const logout = useAuthStore((state) => state.logout);

    const menuItems = {
        admin: [
            { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
            { icon: Users, label: "Élèves", href: "/admin/students" },
            { icon: BookOpen, label: "Classes & Matières", href: "/admin/academics" },
            { icon: CreditCard, label: "Finance", href: "/admin/finance" },
            { icon: MessageSquare, label: "Messagerie", href: "/admin/messages" },
            { icon: Settings, label: "Configuration", href: "/admin/settings" },
        ],
        teacher: [
            { icon: LayoutDashboard, label: "Dashboard", href: "/teacher/dashboard" },
            { icon: BookOpen, label: "Mes Classes", href: "/teacher/classes" },
            { icon: GraduationCap, label: "Notes", href: "/teacher/grades" },
            { icon: MessageSquare, label: "Messagerie", href: "/teacher/messages" },
        ],
        parent: [
            { icon: LayoutDashboard, label: "Dashboard", href: "/parent/dashboard" },
            { icon: Users, label: "Mes Enfants", href: "/parent/children" },
            { icon: CreditCard, label: "Paiements", href: "/parent/payments" },
            { icon: MessageSquare, label: "Messagerie", href: "/parent/messages" },
        ],
        eleve: [
            { icon: LayoutDashboard, label: "Dashboard", href: "/eleve/dashboard" },
            { icon: BookOpen, label: "Mes Cours", href: "/eleve/courses" },
            { icon: GraduationCap, label: "Mes Résultats", href: "/eleve/results" },
            { icon: MessageSquare, label: "Messagerie", href: "/eleve/messages" },
        ],
    };

    const items = menuItems[role as keyof typeof menuItems] || [];

    return (
        <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
                <Menu size={24} className="text-slate-600" />
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)} />

                    <div className="relative w-full max-w-xs bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
                        <div className="p-4 flex items-center justify-between border-b border-slate-100">
                            <div className="flex items-center gap-2 font-bold text-primary-blue">
                                <GraduationCap size={24} />
                                <span className="text-lg">eSchool</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                                <X size={24} className="text-slate-400" />
                            </Button>
                        </div>

                        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                            {items.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-4 p-3 rounded-xl transition-all",
                                        pathname.startsWith(item.href)
                                            ? "bg-primary-blue text-white shadow-lg shadow-blue-100"
                                            : "text-slate-600 hover:bg-slate-50"
                                    )}
                                >
                                    <item.icon size={20} />
                                    <span className="font-bold">{item.label}</span>
                                </Link>
                            ))}
                        </nav>

                        <div className="p-4 border-t border-slate-100">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setIsOpen(false);
                                    logout();
                                }}
                                className="w-full flex items-center gap-4 p-3 h-auto text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors justify-start"
                            >
                                <LogOut size={20} />
                                <span className="font-bold">Déconnexion</span>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
