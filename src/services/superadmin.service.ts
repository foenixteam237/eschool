import { apiClient } from '@/lib/api-client';

export interface EtablissementAbonne {
  id: string;
  nom: string;
  code: string;
  ville: string;
  region: string;
  typeEtablissement: 'GENERAL' | 'TECHNIQUE' | 'BILINGUE';
  planAbonnement: 'STANDARD' | 'PRO' | 'EXCELLENCE';
  statutAbonnement: 'ACTIF' | 'SUSPENDU' | 'EN_ATTENTE' | 'EXPIRE';
  statutPaiement: 'A_JOUR' | 'RETARD' | 'IMPAYE';
  montantAnnuelFCFA: number;
  dateDebut: string;
  dateEcheance: string;
  nombreElevesEstime: number;
  adminReferent: {
    id?: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
  };
}

export interface SupportTicket {
  id: string;
  etablissementId: string;
  etablissementNom: string;
  emetteurNom: string;
  emetteurEmail: string;
  objet: string;
  categorie: 'TECHNIQUE' | 'FACTURATION' | 'FORMATION' | 'AUTRE';
  priorite: 'URGENTE' | 'MOYENNE' | 'FAIBLE';
  statut: 'OUVERT' | 'EN_COURS' | 'RESOLU';
  dateCreation: string;
  description: string;
  reponseAdmin?: string;
}

export interface CreateSchoolPayload {
  nom: string;
  ville: string;
  region: string;
  typeEtablissement: 'GENERAL' | 'TECHNIQUE' | 'BILINGUE';
  planAbonnement: 'STANDARD' | 'PRO' | 'EXCELLENCE';
  montantAnnuelFCFA: number;
  adminNom: string;
  adminPrenom: string;
  adminEmail: string;
  adminTelephone: string;
  adminMotDePasse: string;
}

const STORAGE_KEY_SCHOOLS = 'eschool_superadmin_schools';
const STORAGE_KEY_TICKETS = 'eschool_superadmin_tickets';

// Données initiales de démonstration pour le SuperAdmin si l'API distante n'a pas encore de table superadmin
const DEFAULT_INITIAL_SCHOOLS: EtablissementAbonne[] = [
  {
    id: "sch-01",
    nom: "Lycée Général Leclerc de Yaoundé",
    code: "LGL-YDE",
    ville: "Yaoundé",
    region: "Centre",
    typeEtablissement: "GENERAL",
    planAbonnement: "EXCELLENCE",
    statutAbonnement: "ACTIF",
    statutPaiement: "A_JOUR",
    montantAnnuelFCFA: 1500000,
    dateDebut: "2026-09-01",
    dateEcheance: "2027-08-31",
    nombreElevesEstime: 1850,
    adminReferent: {
      nom: "Atangana",
      prenom: "Samuel",
      email: "satangana@leclerc.cm",
      telephone: "+237 677 12 34 56",
    },
  },
  {
    id: "sch-02",
    nom: "Collège Bilingue Polyvalent Deido",
    code: "CBPD-DLA",
    ville: "Douala",
    region: "Littoral",
    typeEtablissement: "BILINGUE",
    planAbonnement: "PRO",
    statutAbonnement: "ACTIF",
    statutPaiement: "A_JOUR",
    montantAnnuelFCFA: 1200000,
    dateDebut: "2026-09-01",
    dateEcheance: "2027-08-31",
    nombreElevesEstime: 920,
    adminReferent: {
      nom: "Eboule",
      prenom: "Jeanne",
      email: "direction@college-deido.cm",
      telephone: "+237 699 45 78 12",
    },
  },
  {
    id: "sch-03",
    nom: "Lycée Technique Commercial de Bafoussam",
    code: "LTC-BAF",
    ville: "Bafoussam",
    region: "Ouest",
    typeEtablissement: "TECHNIQUE",
    planAbonnement: "STANDARD",
    statutAbonnement: "ACTIF",
    statutPaiement: "RETARD",
    montantAnnuelFCFA: 800000,
    dateDebut: "2026-08-15",
    dateEcheance: "2026-11-15",
    nombreElevesEstime: 640,
    adminReferent: {
      nom: "Kamga",
      prenom: "Patrice",
      email: "admin@ltcbafoussam.cm",
      telephone: "+237 671 22 89 00",
    },
  },
  {
    id: "sch-04",
    nom: "Institut Secondaire Privé La Grace",
    code: "ISPG-GAR",
    ville: "Garoua",
    region: "Nord",
    typeEtablissement: "GENERAL",
    planAbonnement: "STANDARD",
    statutAbonnement: "SUSPENDU",
    statutPaiement: "IMPAYE",
    montantAnnuelFCFA: 600000,
    dateDebut: "2026-01-10",
    dateEcheance: "2026-10-10",
    nombreElevesEstime: 380,
    adminReferent: {
      nom: "Oumarou",
      prenom: "Bouba",
      email: "oumarou@lagrace-garoua.cm",
      telephone: "+237 694 55 11 23",
    },
  },
];

const DEFAULT_INITIAL_TICKETS: SupportTicket[] = [
  {
    id: "tck-101",
    etablissementId: "sch-03",
    etablissementNom: "Lycée Technique Commercial de Bafoussam",
    emetteurNom: "Patrice Kamga (Admin)",
    emetteurEmail: "admin@ltcbafoussam.cm",
    objet: "Difficulté lors de l'export des bulletins trimestriels",
    categorie: "TECHNIQUE",
    priorite: "URGENTE",
    statut: "OUVERT",
    dateCreation: "2026-10-28T14:32:00Z",
    description: "Le calcul de la moyenne générale de la classe de 1ère TI bloque sur les matières à fort coefficient.",
  },
  {
    id: "tck-102",
    etablissementId: "sch-01",
    etablissementNom: "Lycée Général Leclerc de Yaoundé",
    emetteurNom: "Samuel Atangana (Censeur)",
    emetteurEmail: "satangana@leclerc.cm",
    objet: "Demande de facture proforma pour renouvellement APEE",
    categorie: "FACTURATION",
    priorite: "MOYENNE",
    statut: "EN_COURS",
    dateCreation: "2026-10-26T09:15:00Z",
    description: "Nous avons besoin de la facture détaillée avec RIB pour le virement annuel de la subvention.",
    reponseAdmin: "Facture en cours de génération auprès de la comptabilité SaaS.",
  },
  {
    id: "tck-103",
    etablissementId: "sch-02",
    etablissementNom: "Collège Bilingue Polyvalent Deido",
    emetteurNom: "Jeanne Eboule (Directrice)",
    emetteurEmail: "direction@college-deido.cm",
    objet: "Session de formation pour 12 nouveaux enseignants",
    categorie: "FORMATION",
    priorite: "FAIBLE",
    statut: "RESOLU",
    dateCreation: "2026-10-20T11:00:00Z",
    description: "Nos enseignants de la section anglophone souhaitent une session visio pour la saisie des notes.",
    reponseAdmin: "Session tenue avec succès le 24 Octobre. Guide PDF transmis.",
  },
];

class SuperAdminService {
  /**
   * Récupère la liste de tous les établissements abonnés
   */
  async getSubscribedSchools(): Promise<EtablissementAbonne[]> {
    try {
      // Tentative vers l'API backend si disponible
      const response = await apiClient.get<EtablissementAbonne[]>('/schools');
      if (response && Array.isArray(response) && response.length > 0) {
        return response;
      }
    } catch (e) {
      console.warn('[SuperAdminService] Backend /schools not reachable directly, using managed state:', e);
    }

    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(STORAGE_KEY_SCHOOLS);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          // ignore error
        }
      }
      localStorage.setItem(STORAGE_KEY_SCHOOLS, JSON.stringify(DEFAULT_INITIAL_SCHOOLS));
    }
    return DEFAULT_INITIAL_SCHOOLS;
  }

  /**
   * Crée un nouvel établissement et initialise les accès de son administrateur
   */
  async createSchoolWithAdmin(payload: CreateSchoolPayload): Promise<EtablissementAbonne> {
    const codeGen = payload.nom
      .split(' ')
      .map(w => w[0]?.toUpperCase() || '')
      .join('')
      .slice(0, 4) + '-' + payload.ville.slice(0, 3).toUpperCase();

    const newSchool: EtablissementAbonne = {
      id: `sch-${Date.now()}`,
      nom: payload.nom,
      code: codeGen,
      ville: payload.ville,
      region: payload.region,
      typeEtablissement: payload.typeEtablissement,
      planAbonnement: payload.planAbonnement,
      statutAbonnement: 'ACTIF',
      statutPaiement: 'A_JOUR',
      montantAnnuelFCFA: payload.montantAnnuelFCFA,
      dateDebut: new Date().toISOString().split('T')[0],
      dateEcheance: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      nombreElevesEstime: 500,
      adminReferent: {
        nom: payload.adminNom,
        prenom: payload.adminPrenom,
        email: payload.adminEmail,
        telephone: payload.adminTelephone,
      },
    };

    try {
      await apiClient.post('/schools', {
        ...payload,
        school: newSchool,
      });
    } catch (e) {
      console.warn('[SuperAdminService] Backend POST /schools fallback to local persistence:', e);
    }

    if (typeof window !== 'undefined') {
      const schools = await this.getSubscribedSchools();
      const updated = [newSchool, ...schools];
      localStorage.setItem(STORAGE_KEY_SCHOOLS, JSON.stringify(updated));
    }

    return newSchool;
  }

  /**
   * Met à jour le statut d'abonnement ou de paiement d'une école
   */
  async updateSchoolStatus(
    schoolId: string,
    updates: Partial<Pick<EtablissementAbonne, 'statutAbonnement' | 'statutPaiement' | 'planAbonnement'>>
  ): Promise<EtablissementAbonne | null> {
    const schools = await this.getSubscribedSchools();
    const index = schools.findIndex(s => s.id === schoolId);
    if (index === -1) return null;

    schools[index] = { ...schools[index], ...updates };

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_SCHOOLS, JSON.stringify(schools));
    }

    try {
      await apiClient.patch(`/schools/${schoolId}`, updates);
    } catch (e) {
      console.warn('[SuperAdminService] Backend PATCH /schools failed:', e);
    }

    return schools[index];
  }

  /**
   * Récupère la liste des tickets d'assistance soumis
   */
  async getSupportTickets(): Promise<SupportTicket[]> {
    try {
      const response = await apiClient.get<SupportTicket[]>('/tickets');
      if (response && Array.isArray(response) && response.length > 0) {
        return response;
      }
    } catch (e) {
      console.warn('[SuperAdminService] Backend /tickets not reachable, using managed state:', e);
    }

    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(STORAGE_KEY_TICKETS);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          // ignore
        }
      }
      localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(DEFAULT_INITIAL_TICKETS));
    }
    return DEFAULT_INITIAL_TICKETS;
  }

  /**
   * Répondre ou changer le statut d'un ticket de support
   */
  async updateTicket(
    ticketId: string,
    statut: SupportTicket['statut'],
    reponseAdmin?: string
  ): Promise<SupportTicket | null> {
    const tickets = await this.getSupportTickets();
    const index = tickets.findIndex(t => t.id === ticketId);
    if (index === -1) return null;

    tickets[index] = {
      ...tickets[index],
      statut,
      ...(reponseAdmin && { reponseAdmin }),
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(tickets));
    }

    try {
      await apiClient.patch(`/tickets/${ticketId}`, { statut, reponseAdmin });
    } catch (e) {
      console.warn('[SuperAdminService] Backend PATCH /tickets failed:', e);
    }

    return tickets[index];
  }
}

export const superAdminService = new SuperAdminService();
