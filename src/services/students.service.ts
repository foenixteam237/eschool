/**
 * Students Service - Conforme Spécification API eSchool Cameroun (Norme MINESEC)
 * Ref: /public/assets/aistudio/API_REQUESTS_RESPONSES_cf10b953.md
 */

import { authService } from './auth.service';
import { Student } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ais-dev-z254n7p7ochfsg2saokkto-835800199062.europe-west2.run.app/api/v1';

export interface CreateStudentPayload {
  studentId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  classId: string;
  schoolId: string;
}

// Support format rétro-compatible avec formulaires existants
export type CreateStudentRequest = CreateStudentPayload | {
  email: string;
  password?: string;
  nom: string;
  prenom: string;
  studentId?: string;
  phone?: string;
  classeId?: string;
  classId?: string;
  schoolId?: string;
  dateNaissance?: string;
  genre?: 'M' | 'F' | 'Autre';
  parentId?: string;
};

export interface UpdateStudentRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  classId?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  nom?: string;
  prenom?: string;
  dateNaissance?: string;
  genre?: 'M' | 'F' | 'Autre';
  classeId?: string;
}

export interface ApiStudentUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone?: string;
}

export interface StudentApiResponse {
  id: string;
  studentId: string;
  enrollmentDate?: string;
  status: string;
  classId: string;
  schoolId?: string;
  user?: ApiStudentUser;
  class?: {
    id: string;
    name: string;
  };
}

export interface StudentsListResponse {
  data: StudentExtended[];
  total: number;
  page: number;
  limit: number;
}

export interface StudentExtended extends Student {
  classeNom?: string;
  etablissementNom?: string;
  statutFrais?: "SOLDE" | "PARTIEL" | "IMPAYE";
  montantDu?: number;
  parentNom?: string;
  parentTelephone?: string;
}

export const mockStudentsDatabase: StudentExtended[] = [
  {
    id: "std-001",
    matricule: "STU001",
    firstName: "Paul",
    lastName: "BIYA JR",
    email: "student1@eschool.com",
    genre: "M",
    dateNaissance: "2008-04-14",
    role: "ELEVE",
    estActif: true,
    classeId: "cls_1",
    classeNom: "Terminale C",
    etablissementNom: "Lycée Général Leclerc de Yaoundé",
    statutFrais: "SOLDE",
    montantDu: 0,
    parentNom: "M. Paul Biya",
    parentTelephone: "+237 690 00 00 03",
  },
  {
    id: "std-002",
    matricule: "STU002",
    firstName: "Samuel",
    lastName: "ETO'O FILS",
    email: "samuel.etoo@eschool.cm",
    genre: "M",
    dateNaissance: "2007-03-10",
    role: "ELEVE",
    estActif: true,
    classeId: "cls_1",
    classeNom: "Terminale C",
    etablissementNom: "Lycée Général Leclerc de Yaoundé",
    statutFrais: "SOLDE",
    montantDu: 0,
    parentNom: "M. Eto'o David",
    parentTelephone: "+237 677 88 99 00",
  },
  {
    id: "std-003",
    matricule: "STU003",
    firstName: "Carole",
    lastName: "ABENA",
    email: "carole.abena@ecole.cm",
    genre: "F",
    dateNaissance: "2010-09-22",
    role: "ELEVE",
    estActif: true,
    classeId: "cls-4All",
    classeNom: "4ème All",
    etablissementNom: "Lycée Général Leclerc de Yaoundé",
    statutFrais: "PARTIEL",
    montantDu: 25000,
    parentNom: "Mme ABENA Jeanne",
    parentTelephone: "+237 699 12 34 56",
  },
  {
    id: "std-004",
    matricule: "STU004",
    firstName: "Jean-Baptiste",
    lastName: "KAMGA",
    email: "jean.kamga@ecole.cm",
    genre: "M",
    dateNaissance: "2009-11-05",
    role: "ELEVE",
    estActif: true,
    classeId: "cls-3Esp",
    classeNom: "3ème Esp",
    etablissementNom: "Lycée Bilingue de Deido (Douala)",
    statutFrais: "IMPAYE",
    montantDu: 75000,
    parentNom: "M. KAMGA Thomas",
    parentTelephone: "+237 655 44 33 22",
  },
  {
    id: "std-005",
    matricule: "STU005",
    firstName: "Anne-Sophie",
    lastName: "NGONO",
    email: "anne.ngono@ecole.cm",
    genre: "F",
    dateNaissance: "2008-07-30",
    role: "ELEVE",
    estActif: true,
    classeId: "cls-1D",
    classeNom: "1ère D",
    etablissementNom: "Lycée Bilingue de Deido (Douala)",
    statutFrais: "SOLDE",
    montantDu: 0,
    parentNom: "Mme NGONO Célestine",
    parentTelephone: "+237 671 22 33 44",
  }
];

class StudentsService {
  private getAuthHeaders() {
    const token = authService.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Transformation format API v1 -> StudentExtended
   */
  private mapApiStudent(item: any): StudentExtended {
    const user = item.user || {};
    return {
      id: item.id || `std_${item.studentId}`,
      matricule: item.studentId || item.matricule || item.id,
      firstName: user.firstName || item.firstName || item.prenom || 'Élève',
      lastName: user.lastName || item.lastName || item.nom || '',
      email: user.email || item.email || '',
      genre: item.genre || 'M',
      dateNaissance: item.dateNaissance || '2008-01-01',
      role: 'ELEVE',
      estActif: item.status === 'ACTIVE' || item.estActif !== false,
      classeId: item.classId || item.classeId || item.class?.id || 'cls_1',
      classeNom: item.class?.name || item.classeNom || 'Classe Principale',
      etablissementNom: item.schoolName || item.etablissementNom || "Lycée d'Enseignement Secondaire",
      statutFrais: item.statutFrais || "SOLDE",
      montantDu: item.montantDu || 0,
      parentNom: item.parentNom || "Tuteur légal",
      parentTelephone: user.phone || item.phone || item.parentTelephone || "+237 600000000",
    };
  }

  /**
   * Liste des élèves (GET /api/v1/students)
   */
  async getStudents(
    page: number = 1,
    limit: number = 20,
    search?: string
  ): Promise<StudentsListResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) {
        params.append('search', search);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(
        `${API_URL}/students?${params.toString()}`,
        { headers: this.getAuthHeaders(), signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        const rawList = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
        const formatted = rawList.map((item: any) => this.mapApiStudent(item));
        return {
          data: formatted,
          total: json.total || formatted.length,
          page,
          limit,
        };
      }
    } catch (err) {
      console.warn('API /students non joignable directement:', err);
    }

    // Répertoire local filtrable
    let filtered = [...mockStudentsDatabase];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.lastName.toLowerCase().includes(q) ||
          s.firstName.toLowerCase().includes(q) ||
          s.matricule.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.classeNom?.toLowerCase().includes(q)
      );
    }

    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      total: filtered.length,
      page,
      limit,
    };
  }

  /**
   * Détail élève (GET /api/v1/students/:id)
   */
  async getStudent(id: string): Promise<StudentExtended> {
    try {
      const response = await fetch(
        `${API_URL}/students/${id}`,
        { headers: this.getAuthHeaders() }
      );

      if (response.ok) {
        const json = await response.json();
        return this.mapApiStudent(json.data || json);
      }
    } catch (err) {
      console.warn('API /students/:id non joignable:', err);
    }

    const found = mockStudentsDatabase.find(s => s.id === id || s.matricule === id);
    if (found) return found;
    throw new Error(`Élève avec identifiant ${id} non trouvé`);
  }

  /**
   * Inscription d'un élève (POST /api/v1/students)
   * Payload format exact: { studentId, email, firstName, lastName, phone, classId, schoolId }
   */
  async createStudent(data: CreateStudentRequest): Promise<StudentExtended> {
    const payload: CreateStudentPayload = {
      studentId: (data as any).studentId || (data as any).matricule || `STU${Date.now().toString().slice(-4)}`,
      email: data.email,
      firstName: (data as any).firstName || (data as any).prenom || '',
      lastName: (data as any).lastName || (data as any).nom || '',
      phone: (data as any).phone || (data as any).parentTelephone || '+237 600000000',
      classId: (data as any).classId || (data as any).classeId || 'cls_1',
      schoolId: (data as any).schoolId || 'sch_1',
    };

    const response = await fetch(
      `${API_URL}/students`,
      {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.message || `Échec d'inscription de l'élève (HTTP ${response.status})`);
    }

    const json = await response.json();
    return this.mapApiStudent(json.data || json);
  }

  /**
   * Mise à jour élève (PATCH /api/v1/students/:id)
   */
  async updateStudent(id: string, data: UpdateStudentRequest): Promise<StudentExtended> {
    const payload: Record<string, any> = {};
    if (data.firstName || data.prenom) payload.firstName = data.firstName || data.prenom;
    if (data.lastName || data.nom) payload.lastName = data.lastName || data.nom;
    if (data.email) payload.email = data.email;
    if (data.phone) payload.phone = data.phone;
    if (data.classId || data.classeId) payload.classId = data.classId || data.classeId;
    if (data.status) payload.status = data.status;

    const response = await fetch(
      `${API_URL}/students/${id}`,
      {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.message || `Erreur de modification (HTTP ${response.status})`);
    }

    const json = await response.json();
    return this.mapApiStudent(json.data || json);
  }

  /**
   * Supprimer un élève (DELETE /api/v1/students/:id)
   */
  async deleteStudent(id: string): Promise<void> {
    const response = await fetch(
      `${API_URL}/students/${id}`,
      {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok && response.status !== 404) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.message || `Erreur de suppression (HTTP ${response.status})`);
    }
  }

  /**
   * Liste des élèves d'une classe (GET /api/v1/classes/:id/students)
   */
  async getStudentsByClass(classId: string): Promise<StudentExtended[]> {
    try {
      const response = await fetch(
        `${API_URL}/classes/${classId}/students`,
        { headers: this.getAuthHeaders() }
      );

      if (response.ok) {
        const json = await response.json();
        const list = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
        return list.map((item: any) => this.mapApiStudent(item));
      }
    } catch (err) {
      console.warn(`Erreur lors de la récupération des élèves de la classe ${classId}:`, err);
    }

    return mockStudentsDatabase.filter(s => s.classeId === classId || classId === 'all');
  }
}

export const studentsService = new StudentsService();
