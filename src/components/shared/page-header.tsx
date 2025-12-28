"use client";

import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: {
        label: string;
        icon?: LucideIcon;
        onClick?: () => void;
    };
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
                {description && <p className="text-slate-500 mt-1">{description}</p>}
            </div>
            {action && (
                <Button
                    onClick={action.onClick}
                    className="flex items-center gap-2 bg-primary-blue text-white shadow-lg shadow-blue-100 hover:scale-105 transition-transform"
                >
                    {action.icon && <action.icon size={18} />}
                    {action.label}
                </Button>
            )}
        </div>
    );
}
