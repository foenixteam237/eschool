"use client";

import React, { useEffect, useState } from "react";
import {
  School,
  DollarSign,
  AlertTriangle,
  LifeBuoy,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  Building,
  Phone,
  Mail,
  RefreshCw,
} from "lucide-react";
import {
  superAdminService,
  EtablissementAbonne,
  SupportTicket,
  CreateSchoolPayload,
} from "@/services/superadmin.service";

export default function SuperAdminDashboardPage() {
  const [schools, setSchools] = useState<EtablissementAbonne[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketResponse, setTicketResponse] = useState("");

  // New School Form
  const [newSchool, setNewSchool] = useState<CreateSchoolPayload>({
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

  const loadData = async () => {
    setLoading(true);
    try {
      const [schoolsData, ticketsData] = await Promise.all([
        superAdminService.getSubscribedSchools(),
        superAdminService.getSupportTickets(),
      ]);
      setSchools(schoolsData);
      setTickets(ticketsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchool.nom || !newSchool.adminEmail) return;

    await superAdminService.createSchoolWithAdmin(newSchool);
    setIsModalOpen(false);
    // Reset form
    setNewSchool({
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
    await loadData();
  };

  const handleUpdateTicket = async (ticketId: string, statut: SupportTicket["statut"]) => {
    await superAdminService.updateTicket(ticketId, statut, ticketResponse || undefined);
    setSelectedTicket(null);
    setTicketResponse("");
    await loadData();
  };

  const handleToggleSchoolStatus = async (school: EtablissementAbonne) => {
    const nextStatus = school.statutAbonnement === "ACTIF" ? "SUSPENDU" : "ACTIF";
    await superAdminService.updateSchoolStatus(school.id, { statutAbonnement: nextStatus });
    await loadData();
  };

  // KPIs
  const totalEcoles = schools.length;
  const ecolesActives = schools.filter((s) => s.statutAbonnement === "ACTIF").length;
  const caTotal = schools.reduce((acc, s) => acc + (s.montantAnnuelFCFA || 0), 0);
  const ticketsOuverts = tickets.filter((t) => t.statut === "OUVERT").length;

  const filteredSchools = schools.filter((s) => {
    const matchesSearch =
      s.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.adminReferent.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIF" && s.statutAbonnement === "ACTIF") ||
      (statusFilter === "SUSPENDU" && s.statutAbonnement === "SUSPENDU") ||
      (statusFilter === "IMPAYE" && s.statutPaiement === "IMPAYE") ||
      (statusFilter === "RETARD" && s.statutPaiement === "RETARD");

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Console de Supervision SaaS eSchool
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pilotage des établissements abonnés, suivi des souscriptions et assistance technique
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Actualiser
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus size={16} />
            Inscrire un Établissement
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Établissements Abonnés
            </span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-lg">
              <School size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {totalEcoles}
            </span>
            <span className="text-xs text-emerald-600 font-medium">
              {ecolesActives} actifs
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {totalEcoles - ecolesActives} en attente ou suspendus
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Chiffre d'Affaires Souscrit
            </span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-lg">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {caTotal.toLocaleString("fr-FR")}
            </span>
            <span className="text-xs font-semibold text-slate-500">FCFA</span>
          </div>
          <div className="mt-2 text-xs text-emerald-600 font-medium">
            Facturation récurrente annuelle
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Santé des Paiements
            </span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-lg">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {schools.filter((s) => s.statutPaiement !== "A_JOUR").length}
            </span>
            <span className="text-xs text-amber-600 font-medium">alertes</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Retards ou échéances dépassées
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Tickets & Incidents
            </span>
            <div className="p-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 rounded-lg">
              <LifeBuoy size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {ticketsOuverts}
            </span>
            <span className="text-xs text-rose-600 font-medium">à traiter</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Requêtes d'assistance des directeurs
          </div>
        </div>
      </div>

      {/* Main Section: Subscribed Schools Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Établissements Scolaires Abonnés
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Gestion des contrats d'adhésion, dates d'échéances et administrateurs d'écoles
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter by status */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-medium">
              <button
                onClick={() => setStatusFilter("ALL")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  statusFilter === "ALL"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setStatusFilter("ACTIF")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  statusFilter === "ACTIF"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Actifs
              </button>
              <button
                onClick={() => setStatusFilter("RETARD")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  statusFilter === "RETARD"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                En Retard
              </button>
              <button
                onClick={() => setStatusFilter("SUSPENDU")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  statusFilter === "SUSPENDU"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Suspendus
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Rechercher une école, ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 w-56"
              />
            </div>
          </div>
        </div>

        {/* Schools Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/75 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-medium">
                <th className="py-3 px-4">Établissement</th>
                <th className="py-3 px-4">Ville / Région</th>
                <th className="py-3 px-4">Formule SaaS</th>
                <th className="py-3 px-4">Admin Référent</th>
                <th className="py-3 px-4">Échéance</th>
                <th className="py-3 px-4 text-right">Montant Annuel</th>
                <th className="py-3 px-4 text-center">Paiement</th>
                <th className="py-3 px-4 text-center">Accès</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredSchools.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    Aucun établissement ne correspond aux filtres.
                  </td>
                </tr>
              ) : (
                filteredSchools.map((school) => (
                  <tr
                    key={school.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      <div className="flex items-center gap-2">
                        <Building size={15} className="text-indigo-600 shrink-0" />
                        <div>
                          <div>{school.nom}</div>
                          <div className="text-[11px] font-normal text-slate-400">
                            Code: {school.code} · {school.typeEtablissement}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {school.ville}, {school.region}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {school.planAbonnement}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {school.adminReferent.prenom} {school.adminReferent.nom}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {school.adminReferent.email}
                      </div>
                    </td>

                    <td className="py-3 px-4 tabular-nums text-slate-600 dark:text-slate-400">
                      {school.dateEcheance}
                    </td>

                    <td className="py-3 px-4 text-right tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                      {school.montantAnnuelFCFA.toLocaleString("fr-FR")} FCFA
                    </td>

                    <td className="py-3 px-4 text-center">
                      {school.statutPaiement === "A_JOUR" ? (
                        <span className="text-emerald-700 font-medium">À jour</span>
                      ) : school.statutPaiement === "RETARD" ? (
                        <span className="text-amber-700 font-medium">Retard</span>
                      ) : (
                        <span className="text-rose-700 font-medium">Impayé</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {school.statutAbonnement === "ACTIF" ? (
                        <span className="text-emerald-700 font-medium">Actif</span>
                      ) : (
                        <span className="text-rose-700 font-medium">Suspendu</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleSchoolStatus(school)}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                          school.statutAbonnement === "ACTIF"
                            ? "bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40"
                        }`}
                      >
                        {school.statutAbonnement === "ACTIF" ? "Suspendre" : "Activer"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Support & Tickets Submitted by School Admins */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs p-5">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Tickets & Incidents Soumis par les Établissements
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Demandes d'assistance technique, signalements d'anomalies et requêtes de formation
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {tickets.length} tickets enregistrés
          </span>
        </div>

        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      ticket.priorite === "URGENTE"
                        ? "bg-rose-100 text-rose-700"
                        : ticket.priorite === "MOYENNE"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {ticket.priorite}
                  </span>
                  <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                    {ticket.objet}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-500 font-medium">{ticket.etablissementNom}</span>
                  <span aria-hidden="true">·</span>
                  <span
                    className={`font-semibold ${
                      ticket.statut === "OUVERT"
                        ? "text-rose-600"
                        : ticket.statut === "EN_COURS"
                        ? "text-amber-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {ticket.statut === "OUVERT"
                      ? "Ouvert"
                      : ticket.statut === "EN_COURS"
                      ? "En cours"
                      : "Résolu"}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                {ticket.description}
              </p>

              {ticket.reponseAdmin && (
                <div className="mt-2.5 p-2.5 bg-slate-50 dark:bg-slate-800/70 border-l-2 border-indigo-500 rounded text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-semibold text-indigo-600">Réponse SaaS :</span>{" "}
                  {ticket.reponseAdmin}
                </div>
              )}

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-400">
                <span>Émetteur: {ticket.emetteurNom} ({ticket.emetteurEmail})</span>

                <div className="flex items-center gap-2">
                  {ticket.statut !== "RESOLU" && (
                    <button
                      onClick={() => setSelectedTicket(ticket)}
                      className="px-3 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded font-medium transition-colors"
                    >
                      Traiter / Répondre
                    </button>
                  )}
                  {ticket.statut === "OUVERT" && (
                    <button
                      onClick={() => handleUpdateTicket(ticket.id, "EN_COURS")}
                      className="px-3 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded font-medium transition-colors"
                    >
                      Prendre en charge
                    </button>
                  )}
                  {ticket.statut !== "RESOLU" && (
                    <button
                      onClick={() => handleUpdateTicket(ticket.id, "RESOLU")}
                      className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded font-medium transition-colors"
                    >
                      Clôturer (Résolu)
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Inscrire un Nouvel Établissement + Créer Admin Référent */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Souscription d'un Nouvel Établissement
                </h3>
                <p className="text-xs text-slate-500">
                  Création de l'entité scolaire et attribution du compte administrateur principal
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateSchool} className="space-y-4 text-xs">
              {/* Infos Établissement */}
              <div className="space-y-3">
                <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                  Informations de l'Établissement
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Nom officiel de l'école
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Collège Polyvalent Bilingue"
                      value={newSchool.nom}
                      onChange={(e) => setNewSchool({ ...newSchool, nom: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Ville & Région
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Ville (ex: Douala)"
                        value={newSchool.ville}
                        onChange={(e) => setNewSchool({ ...newSchool, ville: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Région (ex: Littoral)"
                        value={newSchool.region}
                        onChange={(e) => setNewSchool({ ...newSchool, region: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Type d'Enseignement
                    </label>
                    <select
                      value={newSchool.typeEtablissement}
                      onChange={(e) =>
                        setNewSchool({
                          ...newSchool,
                          typeEtablissement: e.target.value as CreateSchoolPayload["typeEtablissement"],
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
                    >
                      <option value="GENERAL">Secondaire Général</option>
                      <option value="TECHNIQUE">Secondaire Technique</option>
                      <option value="BILINGUE">Bilingue / Polyvalent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Formule d'Abonnement
                    </label>
                    <select
                      value={newSchool.planAbonnement}
                      onChange={(e) =>
                        setNewSchool({
                          ...newSchool,
                          planAbonnement: e.target.value as CreateSchoolPayload["planAbonnement"],
                          montantAnnuelFCFA:
                            e.target.value === "STANDARD"
                              ? 800000
                              : e.target.value === "PRO"
                              ? 1200000
                              : 1500000,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
                    >
                      <option value="STANDARD">Standard (&lt; 500 élèves)</option>
                      <option value="PRO">Professionnel (500-1200 élèves)</option>
                      <option value="EXCELLENCE">Excellence (&gt; 1200 élèves)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Tarif Souscrit (FCFA/an)
                    </label>
                    <input
                      type="number"
                      required
                      value={newSchool.montantAnnuelFCFA}
                      onChange={(e) =>
                        setNewSchool({
                          ...newSchool,
                          montantAnnuelFCFA: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700 font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Compte Administrateur École */}
              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                  Compte Administrateur Principal (Désigné par SuperAdmin)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Nom de l'Admin
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nom (ex: Nkono)"
                      value={newSchool.adminNom}
                      onChange={(e) => setNewSchool({ ...newSchool, adminNom: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Prénom de l'Admin
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Prénom (ex: Eric)"
                      value={newSchool.adminPrenom}
                      onChange={(e) =>
                        setNewSchool({ ...newSchool, adminPrenom: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Email de Connexion
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="admin@ecole.cm"
                      value={newSchool.adminEmail}
                      onChange={(e) =>
                        setNewSchool({ ...newSchool, adminEmail: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+237 6..."
                      value={newSchool.adminTelephone}
                      onChange={(e) =>
                        setNewSchool({ ...newSchool, adminTelephone: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Mot de Passe Initial
                    </label>
                    <input
                      type="text"
                      required
                      value={newSchool.adminMotDePasse}
                      onChange={(e) =>
                        setNewSchool({ ...newSchool, adminMotDePasse: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700 font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors"
                >
                  Créer l'Établissement & Activer les Accès
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Traiter / Répondre à un Ticket */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 text-xs">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Répondre au Ticket {selectedTicket.id}
              </h3>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ×
              </button>
            </div>

            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                {selectedTicket.objet}
              </div>
              <div className="text-slate-500 mt-1">
                École : {selectedTicket.etablissementNom}
              </div>
              <p className="mt-2 p-2.5 bg-slate-50 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300">
                {selectedTicket.description}
              </p>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Votre Réponse d'Assistance SaaS
              </label>
              <textarea
                rows={3}
                placeholder="Indiquez la solution ou l'action menée..."
                value={ticketResponse}
                onChange={(e) => setTicketResponse(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded hover:bg-slate-50"
              >
                Fermer
              </button>
              <button
                type="button"
                onClick={() => handleUpdateTicket(selectedTicket.id, "EN_COURS")}
                className="px-3 py-1.5 bg-amber-600 text-white rounded font-medium hover:bg-amber-700"
              >
                Enregistrer (En cours)
              </button>
              <button
                type="button"
                onClick={() => handleUpdateTicket(selectedTicket.id, "RESOLU")}
                className="px-4 py-1.5 bg-emerald-600 text-white rounded font-semibold hover:bg-emerald-700"
              >
                Résoudre & Clôturer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
