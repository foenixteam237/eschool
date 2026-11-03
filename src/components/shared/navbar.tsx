"use client";

import { Bell, Search, School } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "@/components/shared/mobile-menu";
import { UserMenu } from "@/components/shared/user-menu";

interface NavbarProps {
    title: string;
    userName: string;
    userRole: string;
    role: string;
}

export function Navbar({ title, userName, userRole, role }: NavbarProps) {
    const schoolName = "Lycée Général Leclerc (Yaoundé)";

    return (
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
            <div className="flex items-center gap-4">
                <MobileMenu role={role} />
                <div className="hidden md:flex items-center gap-2">
                    <span className="text-slate-400 font-medium text-xs uppercase tracking-wider">{title}</span>
                    <span className="text-slate-300">|</span>
                    <div className="flex items-center gap-1.5 bg-blue-50/90 text-primary-blue px-3 py-1 rounded-lg border border-blue-100">
                        <School size={15} className="shrink-0 text-primary-blue" />
                        <span className="text-xs font-bold text-primary-blue tracking-tight">
                            {schoolName}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-md mx-4 hidden lg:block">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <Input
                        placeholder="Rechercher..."
                        className="pl-9 bg-slate-50 border-none h-9 text-sm focus:ring-1 focus:ring-primary-blue transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-5">
                <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-primary-blue transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </Button>

                <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-800 leading-tight">{userName}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{userRole}</p>
                    </div>
                    <UserMenu userName={userName} userRole={userRole} />
                </div>
            </div>
        </header>
    );
}
