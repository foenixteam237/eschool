/**
 * Subjects Service - Cours & Matières MINESEC
 * Ref: /public/assets/aistudio/API_REQUESTS_RESPONSES_cf10b953.md (Section 4)
 */

import { authService } from './auth.service';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ais-dev-z254n7p7ochfsg2saokkto-835800199062.europe-west2.run.app/api/v1';

export interface CreateSubjectPayload {
  name: string;
  code: string;
  credits: number; // Coefficient MINESEC
  classId: string;
}

export interface SubjectItem {
  id: string;
  name: string;
  code: string;
  credits: number;
  classId: string;
  class?: {
    id: string;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

const mockSubjects: SubjectItem[] = [
  { id: "sbj_1", name: "Mathématiques", code: "MATH-TC", credits: 6, classId: "cls_1" },
  { id: "sbj_2", name: "Physique-Chimie", code: "PC-TC", credits: 5, classId: "cls_1" },
  { id: "sbj_3", name: "Français", code: "FRAN-TC", credits: 3, classId: "cls_1" },
  { id: "sbj_4", name: "Anglais", code: "ANG-TC", credits: 3, classId: "cls_1" },
  { id: "sbj_5", name: "Philosophie", code: "PHIL-TC", credits: 4, classId: "cls_1" },
  { id: "sbj_6", name: "Histoire-Géographie", code: "HG-TC", credits: 2, classId: "cls_1" },
  { id: "sbj_7", name: "SVT", code: "SVT-TC", credits: 4, classId: "cls_1" },
  { id: "sbj_8", name: "Informatique", code: "INFO-TC", credits: 2, classId: "cls_1" },
];

class SubjectsService {
  private getAuthHeaders() {
    const token = authService.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Créer une matière avec coefficient MINESEC (POST /api/v1/subjects)
   * Body: { name, code, credits, classId }
   */
  async createSubject(data: CreateSubjectPayload): Promise<SubjectItem> {
    const response = await fetch(
      `${API_URL}/subjects`,
      {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.message || `Échec création matière (HTTP ${response.status})`);
    }

    const json = await response.json();
    return json.data || json;
  }

  /**
   * Liste des matières (GET /api/v1/subjects)
   */
  async getSubjects(classId?: string): Promise<SubjectItem[]> {
    try {
      const query = classId ? `?classId=${classId}` : '';
      const response = await fetch(
        `${API_URL}/subjects${query}`,
        { headers: this.getAuthHeaders() }
      );

      if (response.ok) {
        const json = await response.json();
        return Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
      }
    } catch (err) {
      console.warn('API /subjects non joignable:', err);
    }

    if (classId) {
      return mockSubjects.filter(s => s.classId === classId);
    }
    return mockSubjects;
  }
}

export const subjectsService = new SubjectsService();
