export type UserRole = "SUPERADMIN" | "ADMIN" | "ENSEIGNANT" | "PARENT" | "ELEVE";

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    telephone?: string;
    adresse?: string;
    photoUrl?: string;
    estActif: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface Student extends User {
    matricule: string;
    dateNaissance?: string;
    genre?: "M" | "F" | "Autre";
    classeId?: string;
    parentId?: string;
}

export interface Teacher extends User {
    specialite?: string;
    experience?: number;
    classes?: string[];
    matieres?: string[];
}

export interface Parent extends User {
    enfants?: string[];
    profession?: string;
}

export interface Class {
    id: string;
    nom: string;
    niveau: string;
    anneeScolaireId: string;
    enseignantPrincipalId?: string;
    description?: string;
    capacity?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface Subject {
    id: string;
    nom: string;
    coefficient: number;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Grade {
    id: string;
    eleveId: string;
    matiereId: string;
    enseignantId: string;
    valeur: number;
    typeNote: "Devoir" | "Contrôle" | "Composition" | "Trimestre";
    trimestre: 1 | 2 | 3;
    date: string;
    commentaire?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Payment {
    id: string;
    eleveId: string;
    parentId: string;
    montant: number;
    typePaiement: "Inscription" | "Mensuel" | "APEE" | "Autre";
    datePaiement: string;
    statut: "PAYE" | "EN_ATTENTE" | "PARTIEL" | "ANNULE";
    referenceTransaction?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Attendance {
    id: string;
    eleveId: string;
    coursId: string;
    date: string;
    statut: "PRESENT" | "ABSENT" | "RETARD" | "JUSTIFIE";
    motif?: string;
    justificatifUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Lesson {
    id: string;
    classeId: string;
    matiereId: string;
    enseignantId: string;
    jour: string;
    heureDebut: string;
    heureFin: string;
    salle: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Message {
    id: string;
    expediteurId: string;
    destinataireId: string;
    contenu: string;
    date: string;
    lu: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface Assignment {
    id: string;
    matiereId: string;
    classeId: string;
    enseignantId: string;
    titre: string;
    description: string;
    dateRemise: string;
    fichierJoint?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AssignmentSubmission {
    id: string;
    devoirId: string;
    eleveId: string;
    fichierRendu?: string;
    dateRemise: string;
    note?: number;
    commentaireEnseignant?: string;
    statut: "SOUMIS" | "EVALUE" | "RETARD";
    createdAt?: string;
    updatedAt?: string;
}

export interface SchoolYear {
    id: string;
    annee: string;
    dateDebut: string;
    dateFin: string;
    actif: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface AcademicRecord {
    id: string;
    eleveId: string;
    anneeScolaireId: string;
    moyenneGenerale: number;
    rang: number;
    statut: "ADMIS" | "REDOUBLE" | "RENVOY";
    observation?: string;
    createdAt?: string;
    updatedAt?: string;
}

/* API Response Types */

export interface ApiSuccessResponse<T> {
    success: true;
    data: T;
    message?: string;
}

export interface ApiErrorResponse {
    success: false;
    error: {
        message: string;
        code?: string;
        details?: Record<string, unknown>;
    };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/* Pagination */

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}
