-- ============================================================================
-- BASE DE DONNÉES : Système de Gestion Scolaire eSchool (Multi-Tenant SaaS)
-- Architecture Multi-Écoles avec Isolation Stricte (Norme MINESEC Cameroun)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. ÉTABLISSEMENTS SCOLAIRES (MULTI-TENANT ROOT)
-- ============================================================================
CREATE TABLE IF NOT EXISTS etablissements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,                  -- ex: 'LGL-YDE-001'
    nom TEXT NOT NULL,
    type_etablissement TEXT NOT NULL CHECK (type_etablissement IN ('GENERAL', 'TECHNIQUE', 'BILINGUE')),
    secteur TEXT DEFAULT 'Public',
    region TEXT NOT NULL,                       -- Centre, Littoral, Ouest, etc.
    departement TEXT,
    arrondissement TEXT,
    adresse TEXT,
    telephone TEXT,
    email TEXT UNIQUE NOT NULL,
    slogan TEXT,
    fuseau_horaire TEXT DEFAULT 'Africa/Douala',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. ABONNEMENTS SAAS (GÉRÉS EXCLUSIVEMENT PAR LE SUPERADMIN)
-- ============================================================================
CREATE TABLE IF NOT EXISTS abonnements_saas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    etablissement_id UUID NOT NULL REFERENCES etablissements(id) ON DELETE CASCADE,
    plan TEXT NOT NULL CHECK (plan IN ('STANDARD', 'PRO', 'EXCELLENCE')),
    statut TEXT NOT NULL CHECK (statut IN ('ACTIF', 'SUSPENDU', 'EN_ATTENTE', 'EXPIRE')),
    statut_paiement TEXT NOT NULL CHECK (statut_paiement IN ('A_JOUR', 'RETARD', 'IMPAYE')),
    montant_annuel_fcfa NUMERIC(12,2) NOT NULL,
    date_debut DATE NOT NULL,
    date_echeance DATE NOT NULL,
    renouvellement_auto BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 3. UTILISATEURS (COMPTES ET RÔLES RBAC)
-- ============================================================================
CREATE TABLE IF NOT EXISTS utilisateurs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    mot_de_passe_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('SUPERADMIN', 'ADMIN', 'ENSEIGNANT', 'PARENT', 'ELEVE')),
    etablissement_id UUID REFERENCES etablissements(id) ON DELETE CASCADE, -- NULL uniquement pour SUPERADMIN
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    telephone TEXT,
    adresse TEXT,
    photo_url TEXT,
    est_actif BOOLEAN DEFAULT TRUE,
    derniere_connexion TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 4. ANNÉES SCOLAIRES PAR ÉTABLISSEMENT
-- ============================================================================
CREATE TABLE IF NOT EXISTS annees_scolaires (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    etablissement_id UUID NOT NULL REFERENCES etablissements(id) ON DELETE CASCADE,
    annee TEXT NOT NULL,                        -- ex: '2025-2026'
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    est_active BOOLEAN DEFAULT FALSE,
    UNIQUE (etablissement_id, annee)
);

-- ============================================================================
-- 5. CLASSES PAR ÉTABLISSEMENT
-- ============================================================================
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    etablissement_id UUID NOT NULL REFERENCES etablissements(id) ON DELETE CASCADE,
    nom TEXT NOT NULL,                          -- ex: 'Terminale C', '6ème A'
    niveau TEXT NOT NULL,                       -- 'Terminale', '1ère', '6ème'
    section TEXT NOT NULL,                      -- 'Scientifique', 'Littéraire', 'Général'
    capacite INTEGER DEFAULT 45,
    annee_scolaire_id UUID REFERENCES annees_scolaires(id) ON DELETE CASCADE,
    enseignant_principal_id UUID REFERENCES utilisateurs(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (etablissement_id, nom, annee_scolaire_id)
);

-- ============================================================================
-- 6. MATIÈRES ET COEFFICIENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS matieres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    etablissement_id UUID NOT NULL REFERENCES etablissements(id) ON DELETE CASCADE,
    nom TEXT NOT NULL,
    code TEXT NOT NULL,                         -- MATH, PC, FRAN
    coefficient NUMERIC(3,1) DEFAULT 3.0,
    niveau TEXT,
    UNIQUE (etablissement_id, code)
);

-- ============================================================================
-- 7. ÉLÈVES
-- ============================================================================
CREATE TABLE IF NOT EXISTS eleves (
    id UUID PRIMARY KEY REFERENCES utilisateurs(id) ON DELETE CASCADE,
    etablissement_id UUID NOT NULL REFERENCES etablissements(id) ON DELETE CASCADE,
    matricule TEXT NOT NULL,                     -- ex: '2026-LGL-001'
    date_naissance DATE NOT NULL,
    lieu_naissance TEXT,
    genre TEXT CHECK (genre IN ('M', 'F')),
    groupe_sanguin TEXT,
    nationalite TEXT DEFAULT 'Camerounaise',
    classe_id UUID REFERENCES classes(id),
    statut_scolarite TEXT DEFAULT 'ACTIF',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (etablissement_id, matricule)
);

-- ============================================================================
-- 8. PARENTS ET LIENS PARENT-ÉLÈVE
-- ============================================================================
CREATE TABLE IF NOT EXISTS parents_enfants (
    parent_id UUID REFERENCES utilisateurs(id) ON DELETE CASCADE,
    eleve_id UUID REFERENCES eleves(id) ON DELETE CASCADE,
    lien_parente TEXT DEFAULT 'Pere',
    PRIMARY KEY (parent_id, eleve_id)
);

-- ============================================================================
-- 9. NOTES & ÉVALUATIONS SÉQUENTIELLES (MINESEC 6 SÉQUENCES / 3 TRIMESTRES)
-- ============================================================================
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    etablissement_id UUID NOT NULL REFERENCES etablissements(id) ON DELETE CASCADE,
    eleve_id UUID NOT NULL REFERENCES eleves(id) ON DELETE CASCADE,
    matiere_id UUID NOT NULL REFERENCES matieres(id) ON DELETE CASCADE,
    enseignant_id UUID REFERENCES utilisateurs(id) ON DELETE SET NULL,
    valeur NUMERIC(4,2) CHECK (valeur BETWEEN 0 AND 20),
    bareme NUMERIC(4,2) DEFAULT 20.0,
    sequence_id TEXT NOT NULL,                  -- 'seq_1' à 'seq_6'
    trimestre INTEGER CHECK (trimestre BETWEEN 1 AND 3),
    type_evaluation TEXT DEFAULT 'SEQUENCE',
    appreciation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 10. PRÉSENCES ET ASSIDUITÉ
-- ============================================================================
CREATE TABLE IF NOT EXISTS presences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    etablissement_id UUID NOT NULL REFERENCES etablissements(id) ON DELETE CASCADE,
    eleve_id UUID NOT NULL REFERENCES eleves(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    statut TEXT CHECK (statut IN ('PRESENT', 'ABSENT', 'RETARD', 'JUSTIFIE')),
    heures_absence INTEGER DEFAULT 1,
    motif_justification TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 11. RECOUVREMENT DES FRAIS SCOLAIRES LOCAUX (APEE / SCOLARITÉ)
-- ============================================================================
CREATE TABLE IF NOT EXISTS paiements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    etablissement_id UUID NOT NULL REFERENCES etablissements(id) ON DELETE CASCADE,
    eleve_id UUID NOT NULL REFERENCES eleves(id) ON DELETE CASCADE,
    numero_recu TEXT UNIQUE NOT NULL,           -- ex: 'REC-2026-LGL-00089'
    montant NUMERIC(12,2) NOT NULL,
    devise TEXT DEFAULT 'XAF',
    type_frais TEXT NOT NULL,                   -- 'SCOLARITE_TRANCHE_1', 'APEE'
    mode_paiement TEXT NOT NULL,                -- 'MTN_MOMO', 'ORANGE_MONEY', 'ESPECES'
    transaction_id TEXT UNIQUE,
    statut TEXT DEFAULT 'SUCCESS',
    date_paiement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nom_caissier TEXT
);

-- ============================================================================
-- 12. DÉPENSES INTERNES ÉCOLE (CONFIDENTIALITÉ STRICTE)
-- ============================================================================
CREATE TABLE IF NOT EXISTS depenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    etablissement_id UUID NOT NULL REFERENCES etablissements(id) ON DELETE CASCADE,
    titre TEXT NOT NULL,
    montant NUMERIC(12,2) NOT NULL,
    devise TEXT DEFAULT 'XAF',
    categorie TEXT NOT NULL,                    -- Maintenance, Fournitures, Salaires
    approuve_par TEXT NOT NULL,
    date_depense DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 13. AUDIT LOGS & TRACABILITÉ MULTI-TENANT
-- ============================================================================
CREATE TABLE IF NOT EXISTS journaux_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    etablissement_id UUID REFERENCES etablissements(id) ON DELETE CASCADE,
    utilisateur_id UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
    action TEXT NOT NULL,                       -- CREATE, UPDATE, DELETE, LOGIN
    entite TEXT NOT NULL,                       -- Student, Grade, Payment, School
    details TEXT,
    ip_adresse TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEX D'ISOLATION ET DE PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_users_school ON utilisateurs(etablissement_id);
CREATE INDEX IF NOT EXISTS idx_classes_school ON classes(etablissement_id);
CREATE INDEX IF NOT EXISTS idx_eleves_school ON eleves(etablissement_id);
CREATE INDEX IF NOT EXISTS idx_notes_school ON notes(etablissement_id);
CREATE INDEX IF NOT EXISTS idx_paiements_school ON paiements(etablissement_id);
CREATE INDEX IF NOT EXISTS idx_audit_school ON journaux_audit(etablissement_id);
