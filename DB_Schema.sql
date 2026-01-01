-- ============================================================================
-- BASE DE DONNÉES : Système de Gestion Scolaire
-- ============================================================================

-- Activer les extensions utiles (PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- Pour gen_random_uuid()

-- ============================================================================
-- TABLEAUX PRINCIPALES
-- ============================================================================

-- Utilisateurs (comptes communs : Admin, Enseignant, Parent, Élève)
CREATE TABLE utilisateurs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    mot_de_passe_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('ADMIN', 'ENSEIGNANT', 'PARENT', 'ELEVE')),
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    telephone TEXT,
    adresse TEXT,
    photo_url TEXT,                          -- URL vers stockage (S3, Supabase, etc.)
    derniere_connexion TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    est_actif BOOLEAN DEFAULT TRUE
);

-- Années scolaires (ex: 2025-2026)
CREATE TABLE annees_scolaires (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    annee TEXT NOT NULL UNIQUE,              -- ex: '2025-2026'
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    est_active BOOLEAN DEFAULT FALSE
);

-- Classes
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom TEXT NOT NULL,                       -- ex: '6ème A'
    niveau TEXT NOT NULL,                    -- ex: '6ème', '5ème', 'Terminale'
    annee_scolaire_id UUID REFERENCES annees_scolaires(id) ON DELETE CASCADE,
    enseignant_principal_id UUID REFERENCES utilisateurs(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (nom, annee_scolaire_id)
);

-- Matières
CREATE TABLE matieres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom TEXT NOT NULL UNIQUE,
    coefficient NUMERIC(3,1) DEFAULT 1.0,
    description TEXT
);

-- Élèves
CREATE TABLE eleves (
    id UUID PRIMARY KEY REFERENCES utilisateurs(id) ON DELETE CASCADE,
    matricule TEXT UNIQUE NOT NULL,          -- ex: '2025-ECO-0001'
    date_naissance DATE,
    genre TEXT CHECK (genre IN ('M', 'F', 'Autre')),
    classe_id UUID REFERENCES classes(id),
    photo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Parents (liés à plusieurs élèves)
CREATE TABLE parents_enfants (
    parent_id UUID REFERENCES utilisateurs(id) ON DELETE CASCADE,
    eleve_id UUID REFERENCES eleves(id) ON DELETE CASCADE,
    PRIMARY KEY (parent_id, eleve_id)
);

-- Enseignants - Matières enseignées
CREATE TABLE enseignants_matieres (
    enseignant_id UUID REFERENCES utilisateurs(id) ON DELETE CASCADE,
    matiere_id UUID REFERENCES matieres(id) ON DELETE CASCADE,
    PRIMARY KEY (enseignant_id, matiere_id)
);

-- Emplois du temps (séances de cours)
CREATE TABLE emplois_du_temps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classe_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    matiere_id UUID REFERENCES matieres(id) ON DELETE CASCADE,
    enseignant_id UUID REFERENCES utilisateurs(id) ON DELETE SET NULL,
    jour_semaine INTEGER CHECK (jour_semaine BETWEEN 1 AND 7),
    heure_debut TIME NOT NULL,
    heure_fin TIME NOT NULL,
    salle TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (classe_id, jour_semaine, heure_debut)  -- Pas de chevauchement dans la même classe
);

-- Notes
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eleve_id UUID REFERENCES eleves(id) ON DELETE CASCADE,
    matiere_id UUID REFERENCES matieres(id) ON DELETE CASCADE,
    enseignant_id UUID REFERENCES utilisateurs(id) ON DELETE SET NULL,
    valeur NUMERIC(4,2) CHECK (valeur BETWEEN 0 AND 20),
    type_note TEXT CHECK (type_note IN ('Devoir', 'Contrôle', 'Composition', 'Trimestre')),
    trimestre INTEGER CHECK (trimestre BETWEEN 1 AND 3),
    annee_scolaire_id UUID REFERENCES annees_scolaires(id),
    date DATE NOT NULL,
    commentaire TEXT,
    verrouille BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Présences
CREATE TABLE presences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eleve_id UUID REFERENCES eleves(id) ON DELETE CASCADE,
    emploi_du_temps_id UUID REFERENCES emplois_du_temps(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    statut TEXT CHECK (statut IN ('PRESENT', 'ABSENT', 'RETARD', 'JUSTIFIE')),
    motif_justification TEXT,
    justificatif_url TEXT,                   -- upload PDF ou image
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (eleve_id, emploi_du_temps_id, date)
);

-- Paiements
CREATE TABLE paiements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eleve_id UUID REFERENCES eleves(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES utilisateurs(id),
    montant NUMERIC(12,2) NOT NULL,
    type_paiement TEXT CHECK (type_paiement IN ('Inscription', 'Mensuel', 'APEE', 'Autre')),
    annee_scolaire_id UUID REFERENCES annees_scolaires(id),
    date_paiement DATE NOT NULL,
    statut TEXT CHECK (statut IN ('PAYE', 'EN_ATTENTE', 'PARTIEL', 'ANNULE')),
    reference_transaction TEXT,
    commentaire TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Devoirs assignés
CREATE TABLE devoirs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matiere_id UUID REFERENCES matieres(id),
    classe_id UUID REFERENCES classes(id),
    enseignant_id UUID REFERENCES utilisateurs(id),
    description TEXT NOT NULL,
    date_attribution DATE NOT NULL,
    date_remise DATE NOT NULL,
    fichier_joint_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Soumissions de devoirs par élèves
CREATE TABLE soumissions_devoirs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    devoir_id UUID REFERENCES devoirs(id) ON DELETE CASCADE,
    eleve_id UUID REFERENCES eleves(id) ON DELETE CASCADE,
    fichier_rendu_url TEXT,
    date_soumission TIMESTAMP,
    note NUMERIC(4,2),
    commentaire_enseignant TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (devoir_id, eleve_id)
);

-- Messages (messagerie interne)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expediteur_id UUID REFERENCES utilisateurs(id),
    destinataire_id UUID REFERENCES utilisateurs(id),
    contenu TEXT NOT NULL,
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lu BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Livres (module bibliothèque)
CREATE TABLE livres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titre TEXT NOT NULL,
    auteur TEXT,
    isbn TEXT UNIQUE,
    quantite_disponible INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emprunts bibliothèque
CREATE TABLE emprunts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    livre_id UUID REFERENCES livres(id),
    utilisateur_id UUID REFERENCES utilisateurs(id),
    date_emprunt DATE NOT NULL,
    date_retour_prevue DATE NOT NULL,
    date_retour_reelle DATE,
    statut TEXT CHECK (statut IN ('EMPRUNTE', 'RETOURNE', 'EN_RETARD')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Journal de Caisse pour la traçabilité financière
CREATE TABLE journal_caisse (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id TEXT UNIQUE NOT NULL,
    eleve_id UUID REFERENCES eleves(id),
    parent_id UUID REFERENCES utilisateurs(id),
    montant NUMERIC(12,2) NOT NULL,
    type_paiement TEXT,
    date_heure_transaction TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour les notifications (absences, etc.)
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destinataire_id UUID REFERENCES utilisateurs(id) NOT NULL,
    message TEXT NOT NULL,
    statut TEXT CHECK (statut IN ('NON_LU', 'LU', 'ARCHIVE')) DEFAULT 'NON_LU',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour la signature numérique des documents officiels
CREATE TABLE hash_document (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eleve_id UUID REFERENCES eleves(id) ON DELETE CASCADE,
    type_document TEXT NOT NULL,
    hash_valeur TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEX POUR PERFORMANCES
-- ============================================================================
CREATE INDEX idx_utilisateurs_email ON utilisateurs(email);
CREATE INDEX idx_eleves_matricule ON eleves(matricule);
CREATE INDEX idx_notes_eleve_matiere ON notes(eleve_id, matiere_id);
CREATE INDEX idx_presences_eleve_date ON presences(eleve_id, date);
CREATE INDEX idx_paiements_eleve ON paiements(eleve_id);
CREATE INDEX idx_messages_destinataire ON messages(destinataire_id);

-- ============================================================================
-- VUES UTILES (exemples)
-- ============================================================================

-- Vue pour moyenne par élève et matière
CREATE VIEW moyennes_eleve_matiere AS
SELECT 
    n.eleve_id,
    n.matiere_id,
    AVG(n.valeur * m.coefficient) / AVG(m.coefficient) AS moyenne_ponderee
FROM notes n
JOIN matieres m ON n.matiere_id = m.id
GROUP BY n.eleve_id, n.matiere_id;

-- Vue pour solde financier élève
CREATE VIEW soldes_eleve AS
SELECT 
    e.id AS eleve_id,
    COALESCE(SUM(p.montant), 0) AS total_paye,
    -- À compléter avec frais théoriques par élève/classe
    0 AS total_du,  -- À implémenter selon vos règles
    (0 - COALESCE(SUM(p.montant), 0)) AS solde
FROM eleves e
LEFT JOIN paiements p ON e.id = p.eleve_id AND p.statut = 'PAYE'
GROUP BY e.id;
