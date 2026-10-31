"use client";

import React, { useEffect, useState } from "react";
import { Building2, Search, Plus, X, ShieldCheck } from "lucide-react";
import { superAdminService, EtablissementAbonne, CreateSchoolPayload } from "@/services/superadmin.service";

export default function SuperAdminSchoolsPage() {
  const [schools, setSchools] = useState<EtablissementAbonne[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateSchoolPayload>({
    nom: "",
    ville: "Yaoundé",
    region: "Centre",
    typeEtablissement: "GENERAL",
    planAbonnement: "PRO",
    montantAnnuelFCFA: 1200000,
    adminNom: "",
    adminPrenom: "",
    adminEmail: "",
    adminTelephone: "+237 ",
    adminMotDePasse: "Admin@" + Math.floor(1000 + Math.random() * 9000),
  });

  const loadSchools = async () => {
    try {
      const data = await superAdminService.getSubscribedSchools();
      setSchools(data);
    } catch (e) {
      console.warn("Failed to load schools:", e);
    }
  };

  useEffect(() => {
    loadSchools();
  }, []);

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.nom || !formData.adminNom || !formData.adminEmail) {
      setFormError("Veuillez renseigner le nom de l'établissement et les coordonnées de l'administrateur.");
      return;
    }

    try {
      setIsSubmitting(true);
      await superAdminService.createSchoolWithAdmin(formData);
      await loadSchools();
      setIsModalOpen(false);
      setFormData({
        nom: "",
        ville: "Yaoundé",
        region: "Centre",
        typeEtablissement: "GENERAL",
        planAbonnement: "PRO",
        montantAnnuelFCFA: 1200000,
        adminNom: "",
        adminPrenom: "",
        adminEmail: "",
        adminTelephone: "+237 ",
        adminMotDePasse: "Admin@" + Math.floor(1000 + Math.random() * 9000),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de la création de l'établissement.";
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = schools.filter(
    (s) =>
      s.nom.toLowerCase().includes(search.toLowerCase()) ||
      s.ville.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Établissements Scolaires Abonnés
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Répertoire central des collèges et lycées utilisant la plateforme eSchool
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un établissement..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 w-64"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus size={14} />
            Inscrire un Établissement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((school) => (
          <div
            key={school.id}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-lg">
                  <Building2 size={20} />
                </div>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    school.statutAbonnement === "ACTIF"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {school.statutAbonnement}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-3">
                {school.nom}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {school.ville}, {school.region} · Code: {school.code}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Formule SaaS</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {school.planAbonnement}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tarif Annuel</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                    {school.montantAnnuelFCFA.toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date d&apos;échéance</span>
                  <span className="text-slate-700 dark:text-slate-300 tabular-nums">
                    {school.dateEcheance}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Admin Référent</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {school.adminReferent.prenom} {school.adminReferent.nom}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact Admin</span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {school.adminReferent.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span
                className={`font-semibold ${
                  school.statutPaiement === "A_JOUR"
                    ? "text-emerald-600"
                    : school.statutPaiement === "RETARD"
                    ? "text-amber-600"
                    : "text-rose-600"
                }`}
              >
                Paiement: {school.statutPaiement}
              </span>

              <a
                href={`mailto:${school.adminReferent.email}`}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Contacter l&apos;Admin
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Création d'Établissement & Compte Admin */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Créer un Établissement et son Compte Administrateur
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSchool} className="p-6 overflow-y-auto space-y-5 text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
                  {formError}
                </div>
              )}

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-3 text-indigo-600">
                  1. Informations de l&apos;Établissement Scolaire
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Nom de l&apos;Établissement *</label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: Lycée Bilingue de Bafoussam"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Ville *</label>
                    <input
                      required
                      type="text"
                      value={formData.ville}
                      onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Région *</label>
                    <select
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 outline-none"
                    >
                      <option value="Centre">Centre (Yaoundé)</option>
                      <option value="Littoral">Littoral (Douala)</option>
                      <option value="Ouest">Ouest (Bafoussam)</option>
                      <option value="Nord-Ouest">Nord-Ouest (Bamenda)</option>
                      <option value="Sud-Ouest">Sud-Ouest (Buea)</option>
                      <option value="Adamaoua">Adamaoua (Ngaoundéré)</option>
                      <option value="Nord">Nord (Garoua)</option>
                      <option value="Extrême-Nord">Extrême-Nord (Maroua)</option>
                      <option value="Sud">Sud (Ebolowa)</option>
                      <option value="Est">Est (Bertoua)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Type d&apos;Établissement</label>
                    <select
                      value={formData.typeEtablissement}
                      onChange={(e) => setFormData({ ...formData, typeEtablissement: e.target.value as "GENERAL" | "TECHNIQUE" | "BILINGUE" })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 outline-none"
                    >
                      <option value="GENERAL">Enseignement Général</option>
                      <option value="TECHNIQUE">Enseignement Technique</option>
                      <option value="BILINGUE">Bilingue (Francophone / Anglophone)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Formule SaaS</label>
                    <select
                      value={formData.planAbonnement}
                      onChange={(e) => setFormData({ ...formData, planAbonnement: e.target.value as "STANDARD" | "PRO" | "EXCELLENCE" })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 outline-none"
                    >
                      <option value="STANDARD">Standard (Jusqu&apos;à 500 élèves)</option>
                      <option value="PRO">Pro (Jusqu&apos;à 1500 élèves)</option>
                      <option value="EXCELLENCE">Excellence (Illimité + Support Dédié)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-3 text-indigo-600">
                  2. Administrateur Référent de l&apos;Établissement (Accès initial)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Nom de l&apos;Admin *</label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: Kouam"
                      value={formData.adminNom}
                      onChange={(e) => setFormData({ ...formData, adminNom: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Prénom de l&apos;Admin *</label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: Christian"
                      value={formData.adminPrenom}
                      onChange={(e) => setFormData({ ...formData, adminPrenom: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Email Professionnel *</label>
                    <input
                      required
                      type="email"
                      placeholder="admin@etablissement.cm"
                      value={formData.adminEmail}
                      onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Téléphone *</label>
                    <input
                      required
                      type="text"
                      value={formData.adminTelephone}
                      onChange={(e) => setFormData({ ...formData, adminTelephone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Mot de passe provisoire généré</label>
                    <input
                      required
                      type="text"
                      value={formData.adminMotDePasse}
                      onChange={(e) => setFormData({ ...formData, adminMotDePasse: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/80 font-mono text-xs outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg disabled:opacity-50"
                >
                  {isSubmitting ? "Création en cours..." : "Créer l'Établissement & Activer l'Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
