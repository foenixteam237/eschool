/**
 * Classes Service - Connecté au backend NestJS
 */

import { authService } from './auth.service';
import { Class } from '@/types';
import { apiClient } from '@/lib/api-client';
import { ROUTES } from '@/lib/routes';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface CreateClassRequest {
  name: string;
  level: string;
  schoolYearId: string;
  mainTeacherId?: string;
  description?: string;
}

export interface UpdateClassRequest {
  name?: string;
  level?: string;
  mainTeacherId?: string;
  description?: string;
}

export interface ClassWithStudents extends Class {
  students: Array<{ id: string; name: string; email: string }>;
  studentCount: number;
}

class ClassesService {
  private getAuthHeaders() {
    const token = authService.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get all classes
   */
  async getClasses(page: number = 1, limit: number = 20): Promise<{ data: Class[]; total: number }> {
    const response = await fetch(
      `${API_URL}/classes?page=${page}&limit=${limit}`,
      { headers: this.getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Failed to fetch classes');
    return response.json();
  }

  /**
   * Get class by ID
   */
  async getClass(id: string): Promise<Class> {
    const response = await fetch(
      `${API_URL}/classes/${id}`,
      { headers: this.getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Failed to fetch class');
    return response.json();
  }

  /**
   * Get class with students
   */
  async getClassWithStudents(id: string): Promise<ClassWithStudents> {
    const response = await fetch(
      `${API_URL}/classes/${id}?withStudents=true`,
      { headers: this.getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Failed to fetch class with students');
    return response.json();
  }

  /**
   * Get classes by school year
   */
  async getClassesBySchoolYear(schoolYearId: string): Promise<Class[]> {
    const response = await fetch(
      `${API_URL}/classes?schoolYearId=${schoolYearId}`,
      { headers: this.getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Failed to fetch classes by school year');
    return response.json();
  }

  /**
   * Get classes by teacher
   */
  async getClassesByTeacher(teacherId: string): Promise<Class[]> {
    const response = await fetch(
      `${API_URL}/classes?teacherId=${teacherId}`,
      { headers: this.getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Failed to fetch classes by teacher');
    return response.json();
  }

  /**
   * Create class
   */
  async createClass(data: CreateClassRequest): Promise<Class> {
    const response = await fetch(
      `${API_URL}/classes`,
      {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) throw new Error('Failed to create class');
    return response.json();
  }

  /**
   * Update class
   */
  async updateClass(id: string, data: UpdateClassRequest): Promise<Class> {
    const response = await fetch(
      `${API_URL}/classes/${id}`,
      {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) throw new Error('Failed to update class');
    return response.json();
  }

  /**
   * Delete class
   */
  async deleteClass(id: string): Promise<void> {
    return apiClient.delete(ROUTES.CLASS(id));
  }

  /**
   * Add student to class
   */
  async addStudentToClass(classId: string, studentId: string): Promise<Class> {
    return apiClient.post(
      `${ROUTES.CLASS(classId)}/students`,
      { studentId }
    );
  }

  /**
   * Remove student from class
   */
  async removeStudentFromClass(classId: string, studentId: string): Promise<Class> {
    return apiClient.delete(
      `${ROUTES.CLASS(classId)}/students/${studentId}`
    );
  }

  /**
   * Set teacher for class
   */
  async setTeacherForClass(classId: string, teacherId: string): Promise<Class> {
    return apiClient.patch(
      ROUTES.CLASS(classId),
      { enseignantPrincipalId: teacherId }
    );
  }
}

export const classesService = new ClassesService();
