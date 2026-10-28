/**
 * Supabase — client navigateur (composants "use client").
 * Utilise la clé anonyme (publique). Toutes les données sensibles sont
 * protégées par les politiques RLS côté base de données.
 */
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key"
    );
}
