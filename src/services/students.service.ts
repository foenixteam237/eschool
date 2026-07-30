/**
 * Students Service — connecté à eschool-api (NestJS).
 * L'API renvoie des enregistrements Student avec l'utilisateur imbriqué
 * (`user`). Ce service aplatit la réponse vers le type `Student` du frontend.
 */

import { authService } from './auth.service';
import { Student } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export interface CreateStudentRequest {
  studentId: string;   // matricule
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface UpdateStudentRequest {
  phone?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'SUSPENDED' | 'TRANSFERRED';
  classId?: string;
}

export interface StudentsListResponse {
  data: Student[];
  total: number;
  page: number;
  limit: number;
}

// Forme brute renvoyée par l'API (partielle)
interface ApiStudent {
  id: string;
  studentId?: string;
  status?: string;
  classId?: string;
  class?: { id: string } | null;
  user?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    photoUrl?: string;
    isActive?: boolean;
  } | null;
}

function mapStudent(s: ApiStudent): Student {
  return {
    id: s.id,
    matricule: s.studentId ?? '',
    email: s.user?.email ?? '',
    firstName: s.user?.firstName ?? '',
    lastName: s.user?.lastName ?? '',
    role: 'STUDENT',
    telephone: s.user?.phone,
    photoUrl: s.user?.photoUrl,
    estActif: s.user?.isActive ?? true,
    classeId: s.class?.id ?? s.classId,
  };
}

class StudentsService {
  private getAuthHeaders() {
    const token = authService.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Liste des élèves (pagination via skip/take côté API).
   */
  async getStudents(
    page: number = 1,
    limit: number = 20,
    _search?: string
  ): Promise<StudentsListResponse> {
    const skip = (page - 1) * limit;
    const params = new URLSearchParams({
      skip: skip.toString(),
      take: limit.toString(),
    });

    const response = await fetch(`${API_URL}/students?${params.toString()}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Impossible de charger les élèves');

    const raw: ApiStudent[] = await response.json();
    const data = Array.isArray(raw) ? raw.map(mapStudent) : [];
    return { data, total: data.length, page, limit };
  }

  async getStudent(id: string): Promise<Student> {
    const response = await fetch(`${API_URL}/students/${id}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Impossible de charger l'élève");
    return mapStudent(await response.json());
  }

  async createStudent(data: CreateStudentRequest): Promise<Student> {
    const response = await fetch(`${API_URL}/students`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Impossible de créer l'élève");
    return mapStudent(await response.json());
  }

  async updateStudent(id: string, data: UpdateStudentRequest): Promise<Student> {
    const response = await fetch(`${API_URL}/students/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Impossible de mettre à jour l'élève");
    return mapStudent(await response.json());
  }

  async deleteStudent(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/students/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Impossible de supprimer l'élève");
  }

  async getStudentsByClass(classId: string): Promise<Student[]> {
    const response = await fetch(`${API_URL}/students?classId=${classId}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Impossible de charger les élèves de la classe');
    const raw: ApiStudent[] = await response.json();
    return Array.isArray(raw) ? raw.map(mapStudent) : [];
  }
}

export const studentsService = new StudentsService();
