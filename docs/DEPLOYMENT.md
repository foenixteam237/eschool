# Déploiement — eSchool

## Architecture (3 tiers)

```
┌──────────────────────────────┐   HTTP/JSON + JWT Bearer
│  Frontend Next.js (Vercel)   │ ───────────────────────────┐
│  dépôt: eschool              │                            │
└──────────────────────────────┘                            ▼
                                         ┌───────────────────────────────┐
                                         │  API NestJS (eschool-api)      │
                                         │  préfixe: /api/v1              │
                                         └───────────────┬───────────────┘
                                                         │ Prisma ORM
                                                         ▼
                                         ┌───────────────────────────────┐
                                         │  PostgreSQL (Supabase)         │
                                         └───────────────────────────────┘
```

- **Frontend** (ce dépôt) : Next.js 15, hébergé sur **Vercel**.
- **API** : `eschool-api` (NestJS + Prisma), à héberger séparément (Railway,
  Render, Fly.io, ou Vercel en fonctions serverless).
- **Base de données** : **Supabase** (PostgreSQL), pilotée par l'API via Prisma.

Le frontend ne communique qu'avec l'API (JWT Bearer). Les secrets de base de
données et de paiement (Orange Money, MTN MoMo, carte) vivent **côté API**, pas
dans le frontend.

## 1. Frontend — variables d'environnement

Copier `.env.example` → `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_JWT_STORAGE_KEY=eschool_token
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

En production, `NEXT_PUBLIC_API_URL` = URL publique de l'API déployée
(ex. `https://api.eschool.xyz/api/v1`).

## 2. Lancement local (frontend)

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production (vérifié)
npm run lint     # qualité de code
```

L'API doit tourner en parallèle (voir le dépôt `eschool-api`, port 3001 par
défaut) et autoriser l'origine du frontend via `CORS_ORIGIN`.

## 3. Déploiement Vercel (frontend)

1. Importer le dépôt `eschool` dans Vercel (framework Next.js détecté).
2. Définir les variables d'environnement (section 1) — pointer
   `NEXT_PUBLIC_API_URL` vers l'API de production.
3. Déployer.

## 4. API + base de données

Voir le dépôt **`eschool-api`** (`README.md`, `SUPABASE_SETUP.md`,
`INSTALLATION.md`) : configuration `DATABASE_URL` (Supabase), migrations Prisma
(`prisma migrate deploy`), et `CORS_ORIGIN` = domaine du frontend Vercel.

## 5. Authentification & sécurité (résumé)

- **JWT** émis par l'API. Le frontend le stocke en `localStorage` (header
  `Authorization: Bearer`) et en cookie `SameSite=Lax` (pour le contrôle
  d'accès par le middleware Next.js).
- **Contrôle d'accès** : le middleware redirige selon le rôle vers l'espace
  correspondant ; l'autorisation réelle est appliquée par les gardes de l'API.
- **Paiements par carte** : tokenisation côté PSP, **aucune donnée de carte
  stockée** (principe PCI-DSS). Intégration côté API.
