-- ============================================================================
-- eSchool — Migration 0001 : FONDATION (multi-tenant, rôles, RLS)
-- Cible : Supabase (PostgreSQL 15+). L'authentification est gérée par
-- Supabase Auth (schéma auth.users). Ce fichier ajoute le schéma applicatif.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Rôles applicatifs (établissement secondaire)
-- ---------------------------------------------------------------------------
do $$ begin
    create type public.app_role as enum (
        'SUPERADMIN',            -- exploitant de la plateforme (multi-établissements)
        'FONDATEUR',
        'ADMIN',
        'PROVISEUR',
        'PROVISEUR_ADJOINT',
        'CENSEUR',
        'SURVEILLANT_GENERAL',
        'COMPTABLE',
        'SECRETAIRE',
        'ENSEIGNANT',
        'PROFESSEUR_PRINCIPAL',
        'ELEVE',
        'PARENT',
        'BIBLIOTHECAIRE',
        'RESP_LABORATOIRE',
        'RESP_INFORMATIQUE'
    );
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Fonction utilitaire : updated_at automatique
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end $$;

-- ---------------------------------------------------------------------------
-- Établissements (le tenant)
-- ---------------------------------------------------------------------------
create table if not exists public.etablissements (
    id            uuid primary key default gen_random_uuid(),
    nom           text not null,
    logo_url      text,
    devise        text not null default 'XAF',
    adresse       text,
    ville         text,
    departement   text,
    region        text,
    pays          text default 'Cameroun',
    telephone     text,
    email         text,
    site_web      text,
    parametres    jsonb not null default '{}'::jsonb,
    est_actif     boolean not null default true,
    created_at    timestamptz not null default now(),
    updated_at    timestamptz not null default now()
);

create trigger trg_etablissements_updated
    before update on public.etablissements
    for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Profils (1-1 avec auth.users) — rattachés à un établissement
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
    id               uuid primary key references auth.users(id) on delete cascade,
    etablissement_id uuid references public.etablissements(id) on delete set null,
    role             public.app_role not null default 'ELEVE',
    nom              text not null default '',
    prenom           text not null default '',
    telephone        text,
    adresse          text,
    photo_url        text,
    est_actif        boolean not null default true,
    created_at       timestamptz not null default now(),
    updated_at       timestamptz not null default now()
);

create index if not exists idx_profiles_etablissement on public.profiles(etablissement_id);
create index if not exists idx_profiles_role on public.profiles(role);

create trigger trg_profiles_updated
    before update on public.profiles
    for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Années scolaires (par établissement)
-- ---------------------------------------------------------------------------
create table if not exists public.annees_scolaires (
    id               uuid primary key default gen_random_uuid(),
    etablissement_id uuid not null references public.etablissements(id) on delete cascade,
    annee            text not null,          -- ex: '2025-2026'
    date_debut       date not null,
    date_fin         date not null,
    est_active       boolean not null default false,
    created_at       timestamptz not null default now(),
    updated_at       timestamptz not null default now(),
    unique (etablissement_id, annee)
);

create index if not exists idx_annees_etablissement on public.annees_scolaires(etablissement_id);

create trigger trg_annees_updated
    before update on public.annees_scolaires
    for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Catalogue de permissions + matrice rôle → permission
-- (surcharge possible par établissement ; NULL = valeur par défaut système)
-- ---------------------------------------------------------------------------
create table if not exists public.permissions (
    code        text primary key,           -- ex: 'students.create'
    description text
);

create table if not exists public.role_permissions (
    role             public.app_role not null,
    permission_code  text not null references public.permissions(code) on delete cascade,
    etablissement_id uuid references public.etablissements(id) on delete cascade,
    allowed          boolean not null default true,
    unique (role, permission_code, etablissement_id)
);

-- ---------------------------------------------------------------------------
-- Fonctions d'aide RLS (SECURITY DEFINER pour éviter la récursion de policy)
-- ---------------------------------------------------------------------------
create or replace function public.current_etablissement_id()
returns uuid language sql stable security definer set search_path = public as $$
    select etablissement_id from public.profiles where id = auth.uid()
$$;

create or replace function public.current_app_role()
returns public.app_role language sql stable security definer set search_path = public as $$
    select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_superadmin()
returns boolean language sql stable security definer set search_path = public as $$
    select coalesce((select role = 'SUPERADMIN' from public.profiles where id = auth.uid()), false)
$$;

-- Rôles disposant de la gestion administrative au sein d'un établissement
create or replace function public.is_etablissement_admin()
returns boolean language sql stable security definer set search_path = public as $$
    select coalesce((
        select role in ('FONDATEUR','ADMIN','PROVISEUR','PROVISEUR_ADJOINT','SECRETAIRE')
        from public.profiles where id = auth.uid()
    ), false)
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.etablissements   enable row level security;
alter table public.profiles         enable row level security;
alter table public.annees_scolaires enable row level security;
alter table public.permissions      enable row level security;
alter table public.role_permissions enable row level security;

-- Établissements : le SUPERADMIN voit tout ; les autres voient le leur.
create policy etab_select on public.etablissements for select
    using (public.is_superadmin() or id = public.current_etablissement_id());
create policy etab_all_superadmin on public.etablissements for all
    using (public.is_superadmin()) with check (public.is_superadmin());
create policy etab_update_admin on public.etablissements for update
    using (id = public.current_etablissement_id() and public.is_etablissement_admin())
    with check (id = public.current_etablissement_id());

-- Profils : chacun voit son profil ; les membres du même établissement se
-- voient entre eux ; le SUPERADMIN voit tout.
create policy profiles_select on public.profiles for select
    using (
        public.is_superadmin()
        or id = auth.uid()
        or etablissement_id = public.current_etablissement_id()
    );
create policy profiles_update_self on public.profiles for update
    using (id = auth.uid()) with check (id = auth.uid());
create policy profiles_admin_manage on public.profiles for all
    using (public.is_superadmin() or (etablissement_id = public.current_etablissement_id() and public.is_etablissement_admin()))
    with check (public.is_superadmin() or (etablissement_id = public.current_etablissement_id() and public.is_etablissement_admin()));

-- Années scolaires : isolation par établissement.
create policy annees_select on public.annees_scolaires for select
    using (public.is_superadmin() or etablissement_id = public.current_etablissement_id());
create policy annees_manage on public.annees_scolaires for all
    using (public.is_superadmin() or (etablissement_id = public.current_etablissement_id() and public.is_etablissement_admin()))
    with check (public.is_superadmin() or (etablissement_id = public.current_etablissement_id() and public.is_etablissement_admin()));

-- Permissions : lecture pour tout utilisateur authentifié, écriture SUPERADMIN.
create policy permissions_select on public.permissions for select
    using (auth.role() = 'authenticated');
create policy permissions_write on public.permissions for all
    using (public.is_superadmin()) with check (public.is_superadmin());

create policy role_perms_select on public.role_permissions for select
    using (public.is_superadmin() or etablissement_id is null or etablissement_id = public.current_etablissement_id());
create policy role_perms_manage on public.role_permissions for all
    using (public.is_superadmin() or (etablissement_id = public.current_etablissement_id() and public.is_etablissement_admin()))
    with check (public.is_superadmin() or (etablissement_id = public.current_etablissement_id() and public.is_etablissement_admin()));
