/**
 * Configuration et constants du projet
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

export const ROUTES = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REGISTER: '/auth/register',
  REFRESH_TOKEN: '/auth/refresh',
  
  // Students
  STUDENTS: '/students',
  STUDENT: (id: string) => `/students/${id}`,
  
  // Teachers
  TEACHERS: '/teachers',
  TEACHER: (id: string) => `/teachers/${id}`,
  
  // Classes
  CLASSES: '/classes',
  CLASS: (id: string) => `/classes/${id}`,
  
  // Grades
  GRADES: '/grades',
  GRADE: (id: string) => `/grades/${id}`,
  GRADES_BY_STUDENT: (studentId: string) => `/grades/student/${studentId}`,
  
  // Attendance
  ATTENDANCE: '/attendance',
  ATTENDANCE_RECORD: (id: string) => `/attendance/${id}`,
  ATTENDANCE_BY_CLASS: (classId: string) => `/attendance/class/${classId}`,
  
  // Finance
  PAYMENTS: '/payments',
  PAYMENT: (id: string) => `/payments/${id}`,
  INVOICE: (id: string) => `/invoices/${id}`,
  
  // Messages
  MESSAGES: '/messages',
  MESSAGE: (id: string) => `/messages/${id}`,
  CONVERSATIONS: '/conversations',
  
  // Profile
  PROFILE: '/profile',
  UPDATE_PROFILE: '/profile/update',
} as const;

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  ENSEIGNANT: 'ENSEIGNANT',
  PARENT: 'PARENT',
  ELEVE: 'ELEVE',
} as const;

export const GRADE_TYPES = {
  DEVOIR: 'Devoir',
  CONTROLE: 'Contrôle',
  COMPOSITION: 'Composition',
  TRIMESTRE: 'Trimestre',
} as const;

export const ATTENDANCE_STATUS = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  RETARD: 'RETARD',
  JUSTIFIE: 'JUSTIFIE',
} as const;

export const PAYMENT_STATUS = {
  PAYE: 'PAYE',
  EN_ATTENTE: 'EN_ATTENTE',
  PARTIEL: 'PARTIEL',
  REJETE: 'REJETE',
} as const;

export const GENDER = {
  M: 'M',
  F: 'F',
  AUTRE: 'Autre',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
