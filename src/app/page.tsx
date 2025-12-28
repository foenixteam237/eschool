import Link from "next/link";
import { GraduationCap, ShieldCheck, Users, BookOpen } from "lucide-react";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50">
            <div className="max-w-5xl w-full text-center space-y-8">
                <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-primary-blue rounded-2xl text-white shadow-xl">
                        <GraduationCap size={48} />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
                        eSchool <span className="text-primary-blue">Management</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        La plateforme tout-en-un pour la gestion moderne de votre établissement scolaire.
                        Connectez administrateurs, enseignants, parents et élèves en toute fluidité.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FeatureCard
                        icon={<ShieldCheck className="text-primary-blue" />}
                        title="Administration"
                        desc="Gérez les inscriptions, la finance et les classes en quelques clics."
                    />
                    <FeatureCard
                        icon={<Users className="text-success-green" />}
                        title="Enseignants"
                        desc="Saisie des notes, gestion des absences et cahier de texte numérique."
                    />
                    <FeatureCard
                        icon={<BookOpen className="text-alert-orange" />}
                        title="Élèves"
                        desc="Accès aux cours, devoirs et résultats scolaires en temps réel."
                    />
                    <FeatureCard
                        icon={<Users className="text-primary-blue" />}
                        title="Parents"
                        desc="Suivez le parcours de vos enfants et payez les frais via mobile money."
                    />
                </div>

                <div className="pt-8">
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-primary-blue rounded-xl hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
                    >
                        Se Connecter à l'Espace
                    </Link>
                </div>
            </div>
        </main>
    );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-3 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-50">
                {icon}
            </div>
            <h3 className="font-bold text-slate-800">{title}</h3>
            <p className="text-sm text-slate-500">{desc}</p>
        </div>
    );
}
