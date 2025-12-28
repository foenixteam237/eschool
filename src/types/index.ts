export type UserRole = "ADMIN" | "ENSEIGNANT" | "PARENT" | "ELEVE";

export interface User {
    id: string;
    email: string;
    nom: string;
    prenom: string;
    role: UserRole;
    telephone?: string;
    adresse?: string;
    photoUrl?: string;
    estActif: boolean;
}

export interface Student extends User {
    matricule: string;
    dateNaissance?: string;
    genre?: "M" | "F" | "Autre";
    classeId?: string;
}

export interface Class {
    id: string;
    nom: string;
    niveau: string;
    anneeScolaireId: string;
    enseignantPrincipalId?: string;
}

export interface Subject {
    id: string;
    nom: string;
    coefficient: number;
    description?: string;
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
}
