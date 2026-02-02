"use client";

import { LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/use-auth-store";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface UserMenuProps {
    userName: string;
    userRole: string;
}

export function UserMenu({ userName, userRole }: UserMenuProps) {
    const router = useRouter();
    const { logout } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 p-0 overflow-hidden border border-slate-100 transition-all hover:scale-105"
                onClick={() => setIsOpen(!isOpen)}
            >
                <User size={20} className="text-slate-400" />
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-slate-100">
                        <p className="font-medium text-slate-800">{userName}</p>
                        <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">{userRole}</p>
                    </div>
                    <div className="py-2">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                router.push("/profile");
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            <User size={16} />
                            Mon profil
                        </button>
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                router.push("/settings");
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            <Settings size={16} />
                            Paramètres
                        </button>
                    </div>
                    <div className="border-t border-slate-100 p-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors rounded"
                        >
                            <LogOut size={16} />
                            Se déconnecter
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
