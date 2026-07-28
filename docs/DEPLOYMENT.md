# Déploiement — eSchool (Vercel + Supabase)

Architecture cible : **Next.js 15 (App Router)** hébergé sur **Vercel**, base de
données et authentification sur **Supabase** (PostgreSQL + Auth + Storage).
Isolation multi-établissements assurée par **Row Level Security (RLS)**.

> État : fondation en cours de mise en place. Ce guide sera complété au fil des
> phases (auth, académique, finance, paiements…).

## 1. Prérequis

- Un compte [Supabase](https://supabase.com) et un projet créé.
- Un compte [Vercel](https://vercel.com) connecté au dépôt GitHub.
- Node.js 20+ en local.

## 2. Configuration Supabase

1. Récupérer les clés dans **Project Settings → API** :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ secret serveur)
2. Appliquer les migrations SQL du dossier [`supabase/migrations`](../supabase/migrations) :
   - via le **SQL Editor** du dashboard (copier/coller le contenu), ou
   - via la CLI Supabase : `supabase db push`.
3. Les politiques **RLS** sont activées par les migrations : chaque
   établissement ne voit que ses propres données.

## 3. Variables d'environnement

Copier `.env.example` → `.env.local` et remplir (voir le fichier pour la liste
complète : Supabase, Orange Money, MTN MoMo, carte, SMTP).

⚠️ **Ne jamais committer** `.env.local` ni aucune clé réelle. En production,
définir les variables dans **Vercel → Project → Settings → Environment
Variables**. La clé `SUPABASE_SERVICE_ROLE_KEY` et les secrets de paiement sont
**côté serveur uniquement** (pas de préfixe `NEXT_PUBLIC_`).

## 4. Lancement local

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # vérifie le build de production
npm run lint     # qualité de code
```

## 5. Déploiement Vercel

1. Importer le dépôt dans Vercel (framework détecté : Next.js).
2. Renseigner les variables d'environnement (étape 3).
3. Déployer. Vercel exécute `next build` et publie automatiquement.

## 6. Conformité & confidentialité (résumé)

- **Isolation des données** : RLS Postgres par `etablissement_id`.
- **Sessions** : cookies `HttpOnly` gérés par `@supabase/ssr` (pas de token en
  `localStorage`).
- **Paiements par carte** : tokenisation côté PSP, **aucune donnée de carte
  (PAN/CVV) stockée** dans notre base (principe PCI-DSS).
- **Webhooks de paiement** : signature vérifiée via les secrets `*_WEBHOOK_SECRET`.
- **Secrets** : jamais commités, gérés via variables d'environnement.
