/**
 * Timetable Service - Emploi du Temps Scolaire
 * Ref: /public/assets/aistudio/API_REQUESTS_RESPONSES_cf10b953.md (Section 8)
 */

import { authService } from './auth.service';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ais-dev-z254n7p7ochfsg2saokkto-835800199062.europe-west2.run.app/api/v1';

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY';

export interface CreateTimetableSlotPayload {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  classId: string;
  subjectId: string;
  teacherId: string;
}

export interface TimetableSlot {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  classId: string;
  subjectId?: string;
  subjectName?: string;
  teacherId?: string;
  teacherName?: string;
  room?: string;
  createdAt?: string;
}

const mockTimetable: TimetableSlot[] = [
  { id: "tt_1", dayOfWeek: "MONDAY", startTime: "07:30", endTime: "09:30", classId: "cls_1", subjectName: "Mathématiques", teacherName: "M. Talla Roger", room: "Salle 12" },
  { id: "tt_2", dayOfWeek: "MONDAY", startTime: "09:45", endTime: "11:45", classId: "cls_1", subjectName: "Physique-Chimie", teacherName: "M. Kamdem Paul", room: "Labo 1" },
  { id: "tt_3", dayOfWeek: "TUESDAY", startTime: "07:30", endTime: "09:30", classId: "cls_1", subjectName: "Français", teacherName: "Mme Ngono Marie", room: "Salle 12" },
  { id: "tt_4", dayOfWeek: "TUESDAY", startTime: "09:45", endTime: "11:45", classId: "cls_1", subjectName: "Philosophie", teacherName: "M. Essomba Jean", room: "Salle 12" },
  { id: "tt_5", dayOfWeek: "WEDNESDAY", startTime: "07:30", endTime: "10:30", classId: "cls_1", subjectName: "SVT", teacherName: "Dr. Fouda Alice", room: "Labo SVT" },
  { id: "tt_6", dayOfWeek: "THURSDAY", startTime: "07:30", endTime: "09:30", classId: "cls_1", subjectName: "Anglais", teacherName: "Mr. Smith John", room: "Salle 12" },
  { id: "tt_7", dayOfWeek: "FRIDAY", startTime: "07:30", endTime: "09:30", classId: "cls_1", subjectName: "Histoire-Géographie", teacherName: "M. Onana Pierre", room: "Salle 12" },
];

class TimetableService {
  private getAuthHeaders() {
    const token = authService.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Ajouter un créneau d'emploi du temps (POST /api/v1/timetable)
   */
  async createSlot(data: CreateTimetableSlotPayload): Promise<TimetableSlot> {
    const response = await fetch(
      `${API_URL}/timetable`,
      {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.message || `Échec création créneau (HTTP ${response.status})`);
    }

    const json = await response.json();
    return json.data || json;
  }

  /**
   * Emploi du temps d'une classe (GET /api/v1/timetable/class/:id)
   */
  async getClassTimetable(classId: string): Promise<TimetableSlot[]> {
    try {
      const response = await fetch(
        `${API_URL}/timetable/class/${classId}`,
        { headers: this.getAuthHeaders() }
      );

      if (response.ok) {
        const json = await response.json();
        return Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
      }
    } catch (err) {
      console.warn(`Erreur récupération emploi du temps classe ${classId}:`, err);
    }

    return mockTimetable.filter(t => t.classId === classId || classId === 'all');
  }
}

export const timetableService = new TimetableService();
