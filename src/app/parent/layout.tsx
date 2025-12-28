import { Sidebar } from "@/components/shared/sidebar";
import { Navbar } from "@/components/shared/navbar";

export default function ParentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex bg-slate-50 min-h-screen">
            <div className="hidden md:block">
                <Sidebar role="parent" />
            </div>
            <div className="flex-1 flex flex-col">
                <Navbar
                    title="Portail Parent"
                    userName="M. KAMGA"
                    userRole="Parent"
                    role="parent"
                />
                <main className="p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
