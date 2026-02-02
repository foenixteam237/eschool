import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/providers/auth-provider";

const inter = Inter({ 
    subsets: ["latin"],
    fallback: ["system-ui", "arial"], 
    preload: true,
});

export const metadata: Metadata = {
    title: "eSchool - Système de Gestion Scolaire",
    description: "Solution moderne de gestion pour établissements scolaires",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <body className={cn(inter.className, "min-h-screen bg-gray-50 text-slate-900 antialiased")}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
