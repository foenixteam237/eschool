/**
 * Payments Service - Connecté au backend NestJS
 */

import { authService } from './auth.service';
import { Payment } from '@/types';
import { apiClient } from '@/lib/api-client';
import { ROUTES } from '@/lib/routes';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface CreatePaymentRequest {
  studentId: string;
  amount: number;
  type: 'TUITION' | 'INSCRIPTION' | 'MONTHLY' | 'OTHER';
  transactionRef?: string;
  description?: string;
}

export interface UpdatePaymentRequest {
  amount?: number;
  status?: 'PENDING' | 'PAID' | 'PARTIAL' | 'OVERDUE';
}

export interface PaymentStats {
  totalDue: number;
  totalPaid: number;
  totalPartial: number;
  balance: number;
}

export interface Invoice {
  id: string;
  paymentId: string;
  number: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'PARTIAL' | 'OVERDUE';
}

class PaymentsService {
  private getAuthHeaders() {
    const token = authService.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get all payments
   */
  async getPayments(page: number = 1, limit: number = 20): Promise<{ data: Payment[]; total: number }> {
    const response = await fetch(
      `${API_URL}/payments?page=${page}&limit=${limit}`,
      { headers: this.getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Failed to fetch payments');
    return response.json();
  }

  /**
   * Get payment by ID
   */
  async getPayment(id: string): Promise<Payment> {
    const response = await fetch(
      `${API_URL}/payments/${id}`,
      { headers: this.getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Failed to fetch payment');
    return response.json();
  }

  /**
   * Get payments by student
   */
  async getPaymentsByStudent(studentId: string): Promise<Payment[]> {
    const response = await fetch(
      `${API_URL}/payments/student/${studentId}`,
      { headers: this.getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Failed to fetch student payments');
    return response.json();
  }

  /**
   * Get payments by parent
   */
  async getPaymentsByParent(parentId: string): Promise<Payment[]> {
    const response = await fetch(
      `${API_URL}/payments/parent/${parentId}`,
      { headers: this.getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Failed to fetch parent payments');
    return response.json();
  }

  /**
   * Create payment
   */
  async createPayment(data: CreatePaymentRequest): Promise<Payment> {
    const response = await fetch(
      `${API_URL}/payments`,
      {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) throw new Error('Failed to create payment');
    return response.json();
  }

  /**
   * Update payment
   */
  async updatePayment(id: string, data: UpdatePaymentRequest): Promise<Payment> {
    const response = await fetch(
      `${API_URL}/payments/${id}`,
      {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) throw new Error('Failed to update payment');
    return response.json();
  }

  /**
   * Delete payment
   */
  async deletePayment(id: string): Promise<void> {
    const response = await fetch(
      `${API_URL}/payments/${id}`,
      {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) throw new Error('Failed to delete payment');
  }

  /**
   * Get payment statistics
   */
  async getPaymentStats(
    studentId?: string,
    parentId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<PaymentStats> {
    const params = new URLSearchParams();
    if (studentId) params.append('studentId', studentId);
    if (parentId) params.append('parentId', parentId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await fetch(
      `${API_URL}/payments/stats?${params.toString()}`,
      { headers: this.getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Failed to fetch payment stats');
    return response.json();
  }

  /**
   * Get invoice
   */
  async getInvoice(invoiceId: string): Promise<Invoice> {
    const response = await fetch(
      `${API_URL}/payments/invoice/${invoiceId}`,
      { headers: this.getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Failed to fetch invoice');
    return response.json();
  }

  /**
   * Generate invoice
   */
  async generateInvoice(paymentId: string): Promise<Invoice> {
    const response = await fetch(
      `${API_URL}/payments/${paymentId}/invoice`,
      {
        method: 'POST',
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) throw new Error('Failed to generate invoice');
    return response.json();
  }

  /**
   * Send payment reminder
   */
  async sendPaymentReminder(studentId: string): Promise<{ success: boolean; message: string }> {
    return apiClient.post(
      `${ROUTES.PAYMENTS}/reminder`,
      { studentId }
    );
  }

  /**
   * Verify payment
   */
  async verifyPayment(transactionRef: string): Promise<Payment> {
    return apiClient.post<Payment>(
      `${ROUTES.PAYMENTS}/verify`,
      { transactionRef }
    );
  }
}

export const paymentsService = new PaymentsService();
