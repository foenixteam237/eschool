/**
 * Discipline Service - Vie Scolaire & Billets de sortie (Norme MINESEC)
 * Ref: /public/assets/aistudio/API_REQUESTS_RESPONSES_cf10b953.md (Section 9)
 */

import { authService } from './auth.service';
import { getApiBaseUrl } from '@/lib/api-config';

export interface CreateExitTicketPayload {
  studentId: string;
  reason: string;
  authorizedBy: string;
}

export interface ExitTicket {
  id: string;
  studentId: string;
  studentName?: string;
  className?: string;
  reason: string;
  authorizedBy: string;
  status: string;
  createdAt: string;
}

export interface CreateIncidentPayload {
  studentId: string;
  description: string;
  sanction: string;
  details: string;
}

export interface DisciplineIncident {
  id: string;
  studentId: string;
  studentName?: string;
  className?: string;
  description: string;
  sanction: string;
  details: string;
  date: string;
}

class DisciplineService {
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
   * Délivrer un billet de sortie (POST /api/v1/discipline/tickets)
   */
  async createExitTicket(data: CreateExitTicketPayload): Promise<ExitTicket> {
    const response = await fetch(
      `${this.apiUrl}/discipline/tickets`,
      {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.message || `Échec délivrance billet (HTTP ${response.status})`);
    }

    const json = await response.json();
    return json.data || json;
  }

  /**
   * Enregistrer un incident ou une sanction disciplinaire (POST /api/v1/discipline/incidents)
   */
  async createIncident(data: CreateIncidentPayload): Promise<DisciplineIncident> {
    const response = await fetch(
      `${this.apiUrl}/discipline/incidents`,
      {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.message || `Échec enregistrement sanction (HTTP ${response.status})`);
    }

    const json = await response.json();
    return json.data || json;
  }
}

export const disciplineService = new DisciplineService();
