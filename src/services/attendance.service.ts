/**
 * Attendance Service - Connecté au backend NestJS
 */

import { authService } from './auth.service';
import { apiClient } from '@/lib/api-client';
import { ROUTES } from '@/lib/routes';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'JUSTIFIED';
  reason?: string;
  justificationUrl?: string;
}

export interface CreateAttendanceRequest {
  studentId: string;
  classId: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'JUSTIFIED';
  reason?: string;
}

export interface UpdateAttendanceRequest {
  status?: 'PRESENT' | 'ABSENT' | 'LATE' | 'JUSTIFIED';
  reason?: string;
  justificationUrl?: string;
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  justified: number;
  attendancePercentage: number;
}

class AttendanceService {
  private getAuthHeaders() {
    const token = authService.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get attendance records
   */
  async getAttendance(page: number = 1, limit: number = 20): Promise<{ data: AttendanceRecord[]; total: number }> {
    const response = await fetch(
      `${API_URL}/attendance?page=${page}&limit=${limit}`,
      { headers: this.getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Failed to fetch attendance');
    return response.json();
  }

  /**
   * Get attendance by ID
   */
  async getAttendanceRecord(id: string): Promise<AttendanceRecord> {
    const response = await fetch(
      `${API_URL}/attendance/${id}`,
      { headers: this.getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Failed to fetch attendance record');
    return response.json();
  }

  /**
   * Get attendance by class
   */
  async getAttendanceByClass(classId: string, date?: string): Promise<AttendanceRecord[]> {
    const params = new URLSearchParams({ classId });
    if (date) params.append('date', date);

    const response = await fetch(
      `${API_URL}/attendance/class/${classId}?${params.toString()}`,
      { headers: this.getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Failed to fetch class attendance');
    return response.json();
  }

  /**
   * Get attendance by student
   */
  async getAttendanceByStudent(
    studentId: string,
    startDate?: string,
    endDate?: string
  ): Promise<AttendanceRecord[]> {
    const params = new URLSearchParams({ studentId });
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await fetch(
      `${API_URL}/attendance/student/${studentId}?${params.toString()}`,
      { headers: this.getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Failed to fetch student attendance');
    return response.json();
  }

  /**
   * Create attendance record
   */
  async createAttendance(data: CreateAttendanceRequest): Promise<AttendanceRecord> {
    const response = await fetch(
      `${API_URL}/attendance`,
      {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) throw new Error('Failed to create attendance');
    return response.json();
  }

  /**
   * Update attendance record
   */
  async updateAttendance(id: string, data: UpdateAttendanceRequest): Promise<AttendanceRecord> {
    const response = await fetch(
      `${API_URL}/attendance/${id}`,
      {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) throw new Error('Failed to update attendance');
    return response.json();
  }

  /**
   * Delete attendance record
   */
  async deleteAttendance(id: string): Promise<void> {
    return apiClient.delete(ROUTES.ATTENDANCE_RECORD(id));
  }

  /**
   * Get attendance statistics
   */
  async getAttendanceStats(
    studentId?: string,
    classId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<AttendanceStats> {
    const params = new URLSearchParams();
    if (studentId) params.append('studentId', studentId);
    if (classId) params.append('classId', classId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    return apiClient.get<AttendanceStats>(
      `/stats/attendance?${params.toString()}`
    );
  }

  /**
   * Bulk create attendance records
   */
  async bulkCreateAttendance(records: CreateAttendanceRequest[]): Promise<AttendanceRecord[]> {
    return apiClient.post<AttendanceRecord[]>(
      `${ROUTES.ATTENDANCE}/bulk`,
      { records }
    );
  }

  /**
   * Justify absence
   */
  async justifyAbsence(attendanceId: string, justificatifUrl: string): Promise<AttendanceRecord> {
    return apiClient.patch<AttendanceRecord>(
      ROUTES.ATTENDANCE_RECORD(attendanceId),
      {
        statut: 'JUSTIFIE',
        justificatifUrl,
      }
    );
  }
}

export const attendanceService = new AttendanceService();
