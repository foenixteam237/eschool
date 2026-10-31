"use client";

import React, { useEffect, useState } from "react";
import { superAdminService, SupportTicket } from "@/services/superadmin.service";

export default function SuperAdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filter, setFilter] = useState<string>("ALL");
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState("");

  const loadTickets = async () => {
    try {
      const data = await superAdminService.getSupportTickets();
      setTickets(data);
    } catch (e) {
      console.warn("Failed to load tickets:", e);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleResolve = async (ticketId: string) => {
    await superAdminService.updateTicket(ticketId, "RESOLU", replyText || undefined);
    setActiveTicket(null);
    setReplyText("");
    await loadTickets();
  };

  const handleProgress = async (ticketId: string) => {
    await superAdminService.updateTicket(ticketId, "EN_COURS", replyText || undefined);
    setActiveTicket(null);
    setReplyText("");
    await loadTickets();
  };

  const filteredTickets = tickets.filter((t) => {
    if (filter === "ALL") return true;
    return t.statut === filter;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Tickets de Support & Incidents Signalés
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Assistance technique et demandes soumises par les directeurs et administrateurs d&apos;établissements
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-medium">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1 rounded transition-colors ${
              filter === "ALL" ? "bg-white dark:bg-slate-900 text-slate-900 shadow-xs" : "text-slate-600"
            }`}
          >
            Tous ({tickets.length})
          </button>
          <button
            onClick={() => setFilter("OUVERT")}
            className={`px-3 py-1 rounded transition-colors ${
              filter === "OUVERT" ? "bg-white dark:bg-slate-900 text-slate-900 shadow-xs" : "text-slate-600"
            }`}
          >
            Ouverts ({tickets.filter((t) => t.statut === "OUVERT").length})
          </button>
          <button
            onClick={() => setFilter("EN_COURS")}
            className={`px-3 py-1 rounded transition-colors ${
              filter === "EN_COURS" ? "bg-white dark:bg-slate-900 text-slate-900 shadow-xs" : "text-slate-600"
            }`}
          >
            En cours ({tickets.filter((t) => t.statut === "EN_COURS").length})
          </button>
          <button
            onClick={() => setFilter("RESOLU")}
            className={`px-3 py-1 rounded transition-colors ${
              filter === "RESOLU" ? "bg-white dark:bg-slate-900 text-slate-900 shadow-xs" : "text-slate-600"
            }`}
          >
            Résolus ({tickets.filter((t) => t.statut === "RESOLU").length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                  Priorité {ticket.priorite}
                </span>
                <span className="text-xs text-slate-400 font-mono">#{ticket.id}</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{ticket.objet}</h3>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {ticket.etablissementNom}
                </span>
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
                  {ticket.statut}
                </span>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg">
              {ticket.description}
            </p>

            {ticket.reponseAdmin && (
              <div className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-950/30 border-l-3 border-indigo-600 rounded-r-lg text-xs text-slate-700 dark:text-slate-300">
                <div className="font-semibold text-indigo-700 dark:text-indigo-400">
                  Réponse SuperAdmin :
                </div>
                <div className="mt-1">{ticket.reponseAdmin}</div>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Émetteur : {ticket.emetteurNom} ({ticket.emetteurEmail})
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveTicket(ticket);
                    setReplyText(ticket.reponseAdmin || "");
                  }}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded text-xs font-semibold transition-colors"
                >
                  Répondre au ticket
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeTicket && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Traiter le ticket #{activeTicket.id}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">{activeTicket.objet}</p>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Message de réponse à l&apos;établissement :
              </label>
              <textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Rédigez la réponse ou la démarche de résolution..."
                className="w-full p-2.5 border border-slate-200 rounded-md dark:bg-slate-800 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setActiveTicket(null)}
                className="px-3 py-1.5 border border-slate-200 rounded hover:bg-slate-50 text-slate-600"
              >
                Annuler
              </button>
              <button
                onClick={() => handleProgress(activeTicket.id)}
                className="px-3 py-1.5 bg-amber-600 text-white rounded font-medium hover:bg-amber-700"
              >
                Passer En Cours
              </button>
              <button
                onClick={() => handleResolve(activeTicket.id)}
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
