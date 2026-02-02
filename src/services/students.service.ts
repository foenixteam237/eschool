/**
 * Students Service - Connecté au backend NestJS
 */

import { authService } from './auth.service';
import { Student } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface CreateStudentRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  dateNaissance?: string;
  genre?: 'M' | 'F' | 'Autre';
  classeId?: string;
  parentId?: string;
}

export interface UpdateStudentRequest {
  nom?: string;
  prenom?: string;
  dateNaissance?: string;
  genre?: 'M' | 'F' | 'Autre';
  classeId?: string;
}

export interface StudentsListResponse {
  data: Student[];
  total: number;
  page: number;
  limit: number;
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
   * Get all students with pagination
   */
  async getStudents(
    page: number = 1,
    limit: number = 20,
    search?: string
  ): Promise<StudentsListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) {
      params.append('search', search);
    }

    const response = await fetch(
      `${API_URL}/students?${params.toString()}`,
      { headers: this.getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Failed to fetch students');
    return response.json();
  }

  /**
   * Get student by ID
   */
  async getStudent(id: string): Promise<Student> {
    const response = await fetch(
      `${API_URL}/students/${id}`,
      { headers: this.getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Failed to fetch student');
    return response.json();
  }

  /**
   * Create new student
   */
  async createStudent(data: CreateStudentRequest): Promise<Student> {
    const response = await fetch(
      `${API_URL}/students`,
      {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) throw new Error('Failed to create student');
    return response.json();
  }

  /**
   * Update student
   */
  async updateStudent(id: string, data: UpdateStudentRequest): Promise<Student> {
    const response = await fetch(
      `${API_URL}/students/${id}`,
      {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) throw new Error('Failed to update student');
    return response.json();
  }

  /**
   * Delete student
   */
  async deleteStudent(id: string): Promise<void> {
    const response = await fetch(
      `${API_URL}/students/${id}`,
      {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) throw new Error('Failed to delete student');
  }

  /**
   * Get students by class
   */
  async getStudentsByClass(classId: string): Promise<Student[]> {
    const response = await fetch(
      `${API_URL}/students?classId=${classId}`,
      { headers: this.getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Failed to fetch students by class');
    return response.json();
  }

  /**
   * Get students by parent
   */
  async getStudentsByParent(parentId: string): Promise<Student[]> {
    const response = await fetch(
      `${API_URL}/students?parentId=${parentId}`,
      { headers: this.getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Failed to fetch students by parent');
    return response.json();
  }
}

export const studentsService = new StudentsService();
