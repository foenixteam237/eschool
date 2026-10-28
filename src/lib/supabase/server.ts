/**
 * Supabase — client serveur (Server Components, Route Handlers, Server Actions).
 * La session est lue/écrite via des cookies HttpOnly gérés par @supabase/ssr.
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key",
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // Appelé depuis un Server Component : l'écriture de cookies
                        // est ignorée (le rafraîchissement est géré par le middleware).
                    }
                },
            },
        }
    );
}
