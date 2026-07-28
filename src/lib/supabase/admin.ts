/**
 * Supabase — client d'administration (service role).
 *
 * ⚠️ SÉCURITÉ : à utiliser UNIQUEMENT côté serveur (Route Handlers, Server
 * Actions, tâches planifiées). La clé service_role contourne les politiques
 * RLS : elle ne doit JAMAIS être importée dans un composant navigateur ni
 * exposée au client. Réservé aux opérations privilégiées (création de compte
 * par un administrateur, webhooks de paiement, etc.).
 */
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}
