import Link from "next/link";
import { GraduationCap, ArrowLeft, Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="space-y-6 max-w-md">
                <div className="relative">
                    <GraduationCap size={120} className="text-slate-200 mx-auto" />
                    <Ghost size={48} className="text-primary-blue absolute bottom-0 right-1/4 animate-bounce" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-6xl font-black text-slate-900 tracking-tighter">404</h1>
                    <h2 className="text-2xl font-bold text-slate-800">Page introuvable</h2>
                    <p className="text-slate-500">
                        Désolé, la page que vous recherchez semble s'être égarée dans les couloirs de l'école.
                    </p>
                </div>

                <div className="pt-6">
                    <Link href="/">
                        <Button className="h-12 px-8 font-bold gap-2 shadow-lg shadow-blue-100">
                            <ArrowLeft size={18} /> Retour à l'accueil
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
