import { Sidebar } from "@/components/shared/sidebar";
import { Navbar } from "@/components/shared/navbar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex bg-slate-50 min-h-screen">
            <div className="hidden md:block">
                <Sidebar role="admin" />
            </div>
            <div className="flex-1 flex flex-col">
                <Navbar
                    title="Portail Administrateur"
                    userName="Admin Principal"
                    userRole="Proviseur"
                    role="admin"
                />
                <main className="p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
