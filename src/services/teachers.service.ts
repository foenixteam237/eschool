/**
 * Teachers Service - Enseignants MINESEC Cameroun
 * Interagit avec l'API /api/v1/teachers (Local ou Vercel)
 */

import { authService } from './auth.service';
import { getApiBaseUrl } from '@/lib/api-config';

export interface TeacherItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
  isAdmin: boolean;
  matricule?: string;
  createdAt?: string;
}

const mockTeachersList: TeacherItem[] = [
  {
    id: "tch_1",
    name: "Jean DUPONT",
    subjects: ["Mathématiques", "Physique-Chimie"],
    classes: ["6ème A", "3ème B", "Terminale C"],
    email: "j.dupont@ecole.com",
    phone: "+237 699 00 11 22",
    isAdmin: true,
    matricule: "ENS-2024-001"
  },
  {
    id: "tch_2",
    name: "Marie SMITH",
    subjects: ["Anglais"],
    classes: ["6ème A", "5ème B", "Terminale C"],
    email: "m.smith@ecole.com",
    phone: "+237 677 33 44 55",
    isAdmin: false,
    matricule: "ENS-2024-002"
  },
  {
    id: "tch_3",
    name: "Paul LEFEBVRE",
    subjects: ["SVT"],
    classes: ["3ème B", "2nde C"],
    email: "p.lefebvre@ecole.com",
    phone: "+237 655 77 88 99",
    isAdmin: false,
    matricule: "ENS-2024-003"
  },
  {
    id: "tch_4",
    name: "Alice MVE",
    subjects: ["Mathématiques"],
    classes: ["4ème A", "Terminale C"],
    email: "a.mve@ecole.com",
    phone: "+237 688 11 22 33",
    isAdmin: false,
    matricule: "ENS-2024-004"
  }
];

class TeachersService {
  private get apiUrl() {
    return getApiBaseUrl();
  }

  private getAuthHeaders() {
    const token = authService.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Récupérer la liste des enseignants
   */
  async getTeachers(): Promise<TeacherItem[]> {
    try {
      const response = await fetch(`${this.apiUrl}/teachers`, {
        headers: this.getAuthHeaders(),
      });

      if (response.ok) {
        const json = await response.json();
        const list = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
        if (list.length > 0) return list;
      }
    } catch (err) {
      console.warn("API /teachers inaccessible:", err);
    }

    return mockTeachersList;
  }

  /**
   * Créer un enseignant
   */
  async createTeacher(data: Partial<TeacherItem>): Promise<TeacherItem> {
    const response = await fetch(`${this.apiUrl}/teachers`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.message || `Échec création enseignant (HTTP ${response.status})`);
    }

    const json = await response.json();
    return json.data || json;
  }

  /**
   * Supprimer un enseignant
   */
  async deleteTeacher(id: string): Promise<void> {
    await fetch(`${this.apiUrl}/teachers/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
  }
}

export const teachersService = new TeachersService();
