"use client";

import React, { useState, useEffect } from "react";
import { Server, CheckCircle2, AlertCircle, RefreshCw, ExternalLink, Settings, X } from "lucide-react";
import { getApiBaseUrl, setCustomBackendUrl } from "@/lib/api-config";

export function BackendStatusBadge() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [status, setStatus] = useState<"checking" | "online" | "offline">("checking");
  const [latency, setLatency] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const checkConnection = async (urlToCheck?: string) => {
    setStatus("checking");
    setFeedback(null);
    const target = urlToCheck || (typeof window !== "undefined" ? getApiBaseUrl() : "/api/v1");
    const startTime = performance.now();

    try {
      // Test healthcheck endpoint
      const pingUrl = target.startsWith("http") ? `${target}/health` : `${target}/schools`;
      const res = await fetch(pingUrl, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      const elapsed = Math.round(performance.now() - startTime);
      setLatency(elapsed);

      if (res.ok || res.status === 401) {
        setStatus("online");
        setFeedback("Connecté avec succès au backend (HTTP " + res.status + ")");
      } else {
        setStatus("online");
        setFeedback(`Backend joignable (Code ${res.status})`);
      }
    } catch {
      setStatus("offline");
      setFeedback("Impossible d'atteindre l'URL spécifiée. Vérifiez le domaine Vercel et les en-têtes CORS.");
    }
  };

  useEffect(() => {
    const active = getApiBaseUrl();
    setCurrentUrl(active);
    setInputUrl(typeof window !== "undefined" ? localStorage.getItem("eschool_backend_url") || "" : "");
    checkConnection();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = inputUrl.trim();
    setCustomBackendUrl(cleanUrl || null);
    const newActive = getApiBaseUrl();
    setCurrentUrl(newActive);
    await checkConnection(newActive);
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  const handleReset = () => {
    setCustomBackendUrl(null);
    setInputUrl("");
    const newActive = getApiBaseUrl();
    setCurrentUrl(newActive);
    checkConnection(newActive);
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-2xs hover:bg-slate-50 transition-colors"
        title="Configuration de la connexion backend Vercel"
      >
        <span
          className={`w-2 h-2 rounded-full ${
            status === "online"
              ? "bg-emerald-500 animate-pulse"
              : status === "checking"
              ? "bg-amber-400 animate-ping"
              : "bg-rose-500"
          }`}
        />
        <Server size={13} className="text-slate-500" />
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {status === "online"
            ? `Backend Vercel: En Ligne ${latency ? `(${latency}ms)` : ""}`
            : status === "checking"
            ? "Test Backend..."
            : "Backend Déconnecté"}
        </span>
        <Settings size={12} className="text-slate-400 ml-0.5" />
      </button>

      {/* Modal de configuration du Backend Vercel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Server size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Rattachement Backend Vercel & eSchool
                  </h3>
                  <p className="text-xs text-slate-500">
                    Connectez l&apos;application front-end à votre API déployée
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Point d&apos;accès actif :</span>
                  <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                    {currentUrl}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500 font-medium">État de la liaison :</span>
                  <div className="flex items-center gap-1.5 font-bold">
                    {status === "online" ? (
                      <>
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        <span className="text-emerald-700">Connecté {latency ? `(${latency}ms)` : ""}</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={14} className="text-rose-600" />
                        <span className="text-rose-700">Injoignable</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {feedback && (
                <div
                  className={`p-3 rounded-lg text-xs font-medium border ${
                    status === "online"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-rose-50 text-rose-800 border-rose-200"
                  }`}
                >
                  {feedback}
                </div>
              )}

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  URL de votre Backend Vercel
                </label>
                <div className="space-y-1">
                  <input
                    type="url"
                    placeholder="https://votre-backend-eschool.vercel.app/api/v1"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 font-mono outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <p className="text-[11px] text-slate-500">
                    Exemple: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">https://eschool-api-prod.vercel.app/api/v1</code>
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-slate-500 hover:text-slate-700 underline"
                >
                  Réinitialiser (Proxy local)
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => checkConnection(inputUrl || currentUrl)}
                    className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 font-medium inline-flex items-center gap-1.5"
                  >
                    <RefreshCw size={12} className={status === "checking" ? "animate-spin" : ""} />
                    Tester le Ping
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-2xs"
                  >
                    Rattacher & Synchroniser
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
