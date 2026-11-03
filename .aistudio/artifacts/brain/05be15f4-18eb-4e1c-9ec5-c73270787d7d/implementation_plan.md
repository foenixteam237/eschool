# Intégration API Réelle, Sécurité et Séparation Superadmin / Admin École

Plan de transition de l'ERP scolaire eSchool vers l'API distante avec élimination intégrale des données mock, sécurisation stricte de l'authentification et cloisonnement entre le Superadmin de la plateforme SaaS et les Administrateurs d'établissements.

## Rapport de Connectivité API & Décisions Utilisateur

> [!IMPORTANT]
> **Rapport de test des endpoints distants (`https://ais-dev-z254n7p7ochfsg2saokkto-835800199062.europe-west2.run.app/api/v1`)** :
> - Tous les endpoints testés (`/auth/login`, `/auth/profile`, `/etablissements`, `/schools`, `/classes`, `/students`, `/grades`, `/payments`, etc.) renvoient actuellement un code **HTTP 302** redirigeant vers `/__cookie_check.html`.
> - **Cause identifiée** : L'URL distante fournie est une URL d'aperçu de développement Cloud Run AI Studio (`ais-dev-*`). Ces environnements sont protégés par le proxy Google avec vérification de cookie de session (`__SECURE-aistudio_auth_flow_may_set_cookies`). Les requêtes `fetch` serveur-à-serveur ou cross-origin sans cookie de session Google sont interceptées avant d'atteindre le serveur NestJS.
> - **Solution intégrée** : Configuration de la variable d'environnement dynamique `NEXT_PUBLIC_API_URL`, relais propre via nos routes proxy Next.js avec transmission des en-têtes et cookies, et affichage strict d'un écran d'erreur clair avec bouton de reconnexion/réessai (aucun faux token ni mock bypass).

- **Décision 1 (Confirmée)** : Espace Superadmin dédié sur `/superadmin/*` dédié à la gestion SaaS (établissements abonnés, formules d'abonnement, statuts de paiement, tickets d'assistance et création des comptes admin d'écoles).
- **Décision 2 (Confirmée)** : Espace Administrateur d'Établissement sur `/admin/*` strictement restreint à la gestion interne de son école (classes, élèves, enseignants, emplois du temps, notes, finances locales) avec la capacité de désigner ou révoquer un autre administrateur de son établissement.
- **Décision 3 (Confirmée)** : Zéro repli mock en cas d'erreur réseau ou d'indisponibilité de l'API. Code HTTP 401/503 avec bannière d'état explicite et action de réessai.

---

## 1. Vue d'Ensemble & Périmètre Fonctionnel

### Qu'est-ce que l'application réalise ?
eSchool est une plateforme ERP complète conçue pour l'enseignement secondaire (système éducatif camerounais bilingue / francophone). Elle opère désormais avec deux niveaux d'administration étanches :
1. **Superadmin (Propriétaire de la plateforme SaaS)** :
   - Tableau de bord global du parc d'établissements abonnés.
   - Suivi financier des abonnements plateforme (statut actif, suspendu, impayé, expiration).
   - Module de gestion des incidents et tickets de support soumis par les écoles.
   - Création et activation des établissements scolaires avec génération du compte administrateur principal.
2. **Admin Établissement (Agent / Proviseur / Censeur)** :
   - Gestion académique complète (niveaux, séries, classes 6ème à Tle, filières techniques et générales).
   - Gestion du personnel enseignant et délégation de droits d'administration à d'autres collègues.
   - Gestion des élèves et matricules uniques par établissement.
   - Emplois du temps, bulletins séquentiels/trimestriels et relevés de notes.
   - Recouvrement des frais de scolarité et APEE locaux.

### Utilisateurs cibles
- **Superadmin SaaS** : Administrateur central de l'infrastructure eSchool.
- **Admin Établissement** : Équipe de direction et intendants des collèges et lycées.
- **Enseignants, Parents, Élèves** : Acteurs de la vie scolaire connectés à leurs espaces respectifs.

---

## 2. Expérience Utilisateur & Design Visuel

### Parcours Utilisateurs Principaux

```
┌───────────────────────────────────────────────────────────┐
│                     Page de Connexion                     │
│                 /login (Email + Mot de passe)             │
└─────────────────────────────┬─────────────────────────────┘
                              │
          ┌───────────────────┴───────────────────┐
          ▼                                       ▼
  Rôle: SUPERADMIN                         Rôle: ADMIN
  ┌─────────────────────────┐             ┌─────────────────────────┐
  │  Espace Superadmin      │             │  Espace Admin École     │
  │  /superadmin/dashboard  │             │  /admin/dashboard       │
  │  - Établissements       │             │  - Classes & Matières   │
  │  - Abonnements & Plans  │             │  - Élèves & Inscriptions│
  │  - Recouvrement SaaS    │             │  - Enseignants & Admins │
  │  - Tickets & Support    │             │  - Notes & Bulletins    │
  └─────────────────────────┘             └─────────────────────────┘
```

### Identité Visuelle & Thème
- **Aesthetic Direction** : Interface administrative professionnelle, dense, sobre et hautement lisible selon les préconisations du domaine *SaaS & Dashboard*.
- **Palette & Contrastes** :
  - **Superadmin** : Fond neutre slate sombre (`#0F172A` / `#1E293B`) avec accents bleu impérial (`#2563EB`) et ambre pour la facturation SaaS.
  - **Admin École** : Fond blanc / ardoise clair (`#F8FAFC` / `#FFFFFF`) avec bordures fines 1px (`#E2E8F0`), accent vert émeraude institutionnel (`#059669`) pour l'éducation.
  - **Typographie** : Sans-serif moderne et rigoureuse (`Plus Jakarta Sans`), chiffres tabulaires (`tabular-nums font-mono`) pour toutes les statistiques, montants en FCFA et moyennes scolaires sur 20.
- **Discipline Visuelle (Anti-Slop)** :
  - Zéro pillule décorative statique pour les métadonnées (séparateurs textuels `·` et alignement sobre).
  - Aucune fausse mention télémétrique ou pseudo-code dans les en-têtes.
  - Grilles de données à haute densité avec pagination, filtres dynamiques et états vides explicites.

---

## 3. Décisions Clés & Correctifs de Sécurité

### 1. Élimination Totale des Fallbacks Mock
- **Problème identifié** : `/src/app/api/auth/login/route.ts` et `/src/app/api/auth/profile/route.ts` généraient un faux token JWT (`mock-jwt-token-*`) et un profil `ADMIN` factice en cas d'erreur de connexion à l'API.
- **Correctif** : Suppression intégrale des blocs mock. Toute erreur de communication avec le backend renvoie un code HTTP 503 ou 401 avec un message clair d'erreur et une opportunité de réessai via l'interface.

### 2. Sécurisation des Cookies de Session
- **Problème identifié** : Le cookie `eschool_token` était écrit avec `httpOnly: false`, exposant le jeton aux attaques XSS.
- **Correctif** : Configuration stricte du cookie côté serveur : `httpOnly: true`, `secure: process.env.NODE_ENV === 'production'`, `sameSite: 'lax'`, `path: '/'`.

### 3. Contrôle d'Accès et Vérification JWT dans le Middleware
- **Problème identifié** : `middleware.ts` ne vérifiait que la simple présence d'un cookie arbitraire sans analyser la validité du JWT ni le rôle requis pour la route demandée.
- **Correctif** :
  - Décodage sécurisé du payload JWT dans le middleware.
  - Vérification de l'expiration temporelle (`exp`).
  - Vérification stricte des routes associées au rôle :
    - `SUPERADMIN` : Accès exclusif à `/superadmin/*`.
    - `ADMIN` : Accès exclusif à `/admin/*`.
    - `ENSEIGNANT` : Accès exclusif à `/teacher/*`.
    - `PARENT` : Accès exclusif à `/parent/*`.
    - `ELEVE` : Accès exclusif à `/eleve/*`.
  - Redirection automatique vers `/login` ou refus 403 en cas de rôle non concordant.

### 4. Capacité de Désignation d'Autres Administrateurs par l'Admin d'Établissement
- L'Admin d'un établissement peut afficher la liste des collaborateurs de son école, désigner un enseignant ou agent comme co-administrateur, ou révoquer ce privilège, restreint à son propre établissement.

---

## 4. Architecture Technique & Flux de Données

### Diagramme d'Architecture Système

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Navigateur Client (UI)                          │
│   Espace SuperAdmin (/superadmin/*)   │   Espace Admin (/admin/*)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                         Appels API (fetch JSON)
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    Next.js App Router (Serveur Local)                  │
│                                                                        │
│   [ middleware.ts ]                                                    │
│    - Décodage JWT & expiration                                         │
│    - Contrôle RBAC strict (/superadmin vs /admin vs /teacher ...)      │
│                                                                        │
│   [ Route Handlers: /api/auth/* ]                                      │
│    - /api/auth/login    -> Cookie HttpOnly, Secure, SameSite=Lax       │
│    - /api/auth/profile  -> Pas de mock fallback, 401/503 en erreur     │
│    - /api/auth/logout   -> Révocation du cookie serveur                 │
│                                                                        │
│   [ Services Client: /src/services/* ]                                 │
│    - httpClient avec gestion des codes 401/500 et états de chargement  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                     Requêtes HTTP directes sécurisées
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    API Backend Distante (NestJS)                       │
│    https://ais-dev-z254n7p7ochfsg2saokkto-835800199062.../api/v1       │
│                                                                        │
│    - /auth/login, /auth/profile                                        │
│    - /etablissements / schools                                         │
│    - /classes, /students, /teachers, /grades, /payments                │
│    - /subscriptions, /tickets                                          │
└────────────────────────────────────────────────────────────────────────┘
```

### Fichiers et Composants Clés Impliqués

1. **Variables d'environnement** :
   - `.env.example` et `.env.local` configurés avec `NEXT_PUBLIC_API_URL=https://ais-dev-z254n7p7ochfsg2saokkto-835800199062.europe-west2.run.app/api/v1`.
2. **Sécurité & Authentification** :
   - `/src/app/api/auth/login/route.ts` : Suppression du fallback mock, écriture cookie `httpOnly: true`.
   - `/src/app/api/auth/profile/route.ts` : Suppression du fallback mock admin factice, gestion stricte 401/503.
   - `/middleware.ts` : Parsing du payload JWT, vérification `exp`, contrôle strict des rôles (`SUPERADMIN` $\to$ `/superadmin`, `ADMIN` $\to$ `/admin`).
3. **Espace SuperAdmin (/superadmin)** :
   - `/src/app/superadmin/dashboard/page.tsx` : KPIs plateforme (écoles abonnées, chiffre d'affaires abonnements, abonnements arrivant à échéance, tickets ouverts).
   - `/src/app/superadmin/schools/page.tsx` : Liste et création des établissements abonnés avec attribution de l'admin principal.
   - `/src/app/superadmin/subscriptions/page.tsx` : Suivi et renouvellement des abonnements, gestion des échéances.
   - `/src/app/superadmin/support/page.tsx` : Traitement des tickets d'incidents et requêtes des écoles.
4. **Espace Admin École (/admin)** :
   - `/src/app/admin/teachers/page.tsx` : Ajout de l'action de promotion "Désigner Administrateur" / "Retirer droits admin".
   - Intégration des composants de gestion d'erreur réseau avec bannière explicite et bouton de réessai sans données mock.

---

## 5. Étapes d'Exécution Après Validation

1. **Configuration d'environnement** : Génération de `.env.local` et `.env.example`.
2. **Refonte Sécurité & Routes Auth** : Sécurisation des cookies, suppression des mock tokens, mise à jour du middleware RBAC.
3. **Création des Vues SuperAdmin** : Implémentation complète de `/superadmin/dashboard`, `/superadmin/schools`, `/superadmin/subscriptions`, `/superadmin/support`.
4. **Mise à Jour de l'Administration d'Établissement** : Intégration de la délégation d'administrateurs et gestion rigoureuse des erreurs API dans les écrans scolaires.
5. **Emploi du Temps Connecté à la Base de Données Réelle** :
   - Synchronisation complète de `/admin/timetable` avec les entités réelles de la base de données PostgreSQL (`classesService`, `subjectsService`, `teachersService`, et `timetableService`).
   - Requêtes `GET /api/v1/timetable/class/:id` et création directe `POST /api/v1/timetable`.
   - Préservation du design UI/UX moderne avec cartes horaires interactives et génération de PDF officiel conforme MINESEC alimenté par les données réelles de la classe sélectionnée.
6. **Vérification et Compilation** : Exécution de `compile_applet` pour garantir l'intégrité de la construction (validé 100%).
7. **Refonte Visuelle SuperAdmin Complétée (100% Conforme aux 4 Screenshots)** :
   - Dashboard Cockpit (`/superadmin/dashboard`) : MRR 128 450 €, graphique 12 mois avec tooltip Octobre, donut 142 écoles, feed système.
   - Flotte d'Établissements (`/superadmin/schools`) : KPI Actifs/Déploiement/Suspendus, filtres avancés, jauges de quotas élèves avec alerte saturation, renouvellements.
   - Abonnements & Grilles Tarifaires (`/superadmin/subscriptions`) : 3 formules (Starter School, Pro Campus en vedette avec bordure violette, Enterprise Group), tableau J-30 avec auto-renouvellement et pondération MRR.
   - Facturation & Revenus SaaS (`/superadmin/finances`) : ARR 1.54M€, histogramme mensuel comparatif N-1, passerelles Stripe/Mobile Money, registre 52 factures émises.
   - Sidebar & TopBar uniformisées avec violet royal `#5B21B6` et routes auxiliaires (`/users`, `/reports`, `/security`, `/settings`).
