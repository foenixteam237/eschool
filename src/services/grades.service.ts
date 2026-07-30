/**
 * Grades Service - Connecté au backend NestJS
 */

import { authService } from './auth.service';
import { Grade } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export interface CreateGradeRequest {
  studentId: string;
  subjectId: string;
  value: number;
  gradeType: 'ASSIGNMENT' | 'QUIZ' | 'MIDTERM' | 'FINAL';
  quarter: 1 | 2 | 3 | 4;
  date: string;
  comment?: string;
}

export interface UpdateGradeRequest {
  value?: number;
  comment?: string;
}

export interface GradeStats {
  average: number;
  min: number;
  max: number;
  total: number;
}

class GradesService {
  private getAuthHeaders() {
    const token = authService.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get all grades
   */
  async getGrades(page: number = 1, limit: number = 20): Promise<{ data: Grade[]; total: number }> {
    const response = await fetch(
      `${API_URL}/grades?page=${page}&limit=${limit}`,
      { headers: this.getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Failed to fetch grades');
    return response.json();
  }

  /**
   * Get grade by ID
   */
  async getGrade(id: string): Promise<Grade> {
    const response = await fetch(
      `${API_URL}/grades/${id}`,
      { headers: this.getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Failed to fetch grade');
    return response.json();
  }

  /**
   * Get grades by student
   */
  async getGradesByStudent(
    studentId: string,
    quarter?: number,
    subjectId?: string
  ): Promise<Grade[]> {
    const params = new URLSearchParams();
    if (quarter) params.append('quarter', quarter.toString());
    if (subjectId) params.append('subjectId', subjectId);
    const qs = params.toString();

    // L'API expose les notes d'un élève via /students/:id/grades
    const response = await fetch(
      `${API_URL}/students/${studentId}/grades${qs ? `?${qs}` : ''}`,
      { headers: this.getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Failed to fetch student grades');
    return response.json();
  }

  /**
   * Get grades by class and subject
   */
  async getGradesByClassAndSubject(classId: string, subjectId: string): Promise<Grade[]> {
    const response = await fetch(
      `${API_URL}/grades?classId=${classId}&subjectId=${subjectId}`,
      { headers: this.getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Failed to fetch grades');
    return response.json();
  }

  /**
   * Create grade
   */
  async createGrade(data: CreateGradeRequest): Promise<Grade> {
    const response = await fetch(
      `${API_URL}/grades`,
      {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) throw new Error('Failed to create grade');
    return response.json();
  }

  /**
   * Update grade
   */
  async updateGrade(id: string, data: UpdateGradeRequest): Promise<Grade> {
    const response = await fetch(
      `${API_URL}/grades/${id}`,
      {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) throw new Error('Failed to update grade');
    return response.json();
  }

  /**
   * Delete grade
   */
  async deleteGrade(id: string): Promise<void> {
    const response = await fetch(
      `${API_URL}/grades/${id}`,
      {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) throw new Error('Failed to delete grade');
  }

  /**
   * Get grade statistics
   */
  async getGradeStats(
    studentId?: string,
    subjectId?: string,
    classId?: string
  ): Promise<GradeStats> {
    const params = new URLSearchParams();
    if (studentId) params.append('studentId', studentId);
    if (subjectId) params.append('subjectId', subjectId);
    if (classId) params.append('classId', classId);

    const response = await fetch(
      `${API_URL}/grades/stats?${params.toString()}`,
      { headers: this.getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Failed to fetch grade stats');
    return response.json();
  }

  /**
   * Bulk create grades
   */
  async bulkCreateGrades(grades: CreateGradeRequest[]): Promise<Grade[]> {
    const response = await fetch(
      `${API_URL}/grades/bulk`,
      {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ grades }),
      }
    );

    if (!response.ok) throw new Error('Failed to create grades');
    return response.json();
  }
}

export const gradesService = new GradesService();
