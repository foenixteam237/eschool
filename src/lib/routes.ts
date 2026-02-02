/**
 * API Routes Configuration
 * Centralized API endpoint definitions
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const ROUTES = {
  // Auth
  AUTH_LOGIN: `${API_BASE}/auth/login`,
  AUTH_REGISTER: `${API_BASE}/auth/register`,
  AUTH_LOGOUT: `${API_BASE}/auth/logout`,
  AUTH_PROFILE: `${API_BASE}/auth/profile`,
  AUTH_REFRESH: `${API_BASE}/auth/refresh`,

  // Students
  STUDENTS: `${API_BASE}/students`,
  STUDENT: (id: string) => `${API_BASE}/students/${id}`,
  STUDENTS_BY_CLASS: (classId: string) => `${API_BASE}/students?classId=${classId}`,
  STUDENTS_BY_PARENT: (parentId: string) => `${API_BASE}/students?parentId=${parentId}`,

  // Grades
  GRADES: `${API_BASE}/grades`,
  GRADE: (id: string) => `${API_BASE}/grades/${id}`,
  GRADES_BY_STUDENT: (studentId: string) => `${API_BASE}/grades/student/${studentId}`,
  GRADES_BY_CLASS_AND_SUBJECT: (classId: string, subjectId: string) =>
    `${API_BASE}/grades?classId=${classId}&subjectId=${subjectId}`,
  GRADES_STATS: (studentId: string) => `${API_BASE}/grades/student/${studentId}/stats`,
  GRADES_BULK: `${API_BASE}/grades/bulk`,

  // Attendance
  ATTENDANCE: `${API_BASE}/attendance`,
  ATTENDANCE_RECORD: (id: string) => `${API_BASE}/attendance/${id}`,
  ATTENDANCE_BY_STUDENT: (studentId: string) => `${API_BASE}/attendance/student/${studentId}`,
  ATTENDANCE_BY_CLASS: (classId: string) => `${API_BASE}/attendance/class/${classId}`,
  ATTENDANCE_STATS: `${API_BASE}/attendance/stats`,

  // Payments
  PAYMENTS: `${API_BASE}/payments`,
  PAYMENT: (id: string) => `${API_BASE}/payments/${id}`,
  PAYMENTS_BY_STUDENT: (studentId: string) => `${API_BASE}/payments?studentId=${studentId}`,
  PAYMENTS_BY_PARENT: (parentId: string) => `${API_BASE}/payments?parentId=${parentId}`,
  PAYMENTS_STATS: (studentId: string) => `${API_BASE}/payments/student/${studentId}/stats`,

  // Classes
  CLASSES: `${API_BASE}/classes`,
  CLASS: (id: string) => `${API_BASE}/classes/${id}`,
  CLASS_WITH_STUDENTS: (id: string) => `${API_BASE}/classes/${id}?withStudents=true`,
  CLASSES_BY_SCHOOL_YEAR: (schoolYearId: string) =>
    `${API_BASE}/classes?schoolYearId=${schoolYearId}`,
  CLASSES_BY_TEACHER: (teacherId: string) => `${API_BASE}/classes?teacherId=${teacherId}`,

  // Teachers
  TEACHERS: `${API_BASE}/teachers`,
  TEACHER: (id: string) => `${API_BASE}/teachers/${id}`,
  TEACHERS_BY_SCHOOL: (schoolId: string) => `${API_BASE}/teachers?schoolId=${schoolId}`,

  // Parents
  PARENTS: `${API_BASE}/parents`,
  PARENT: (id: string) => `${API_BASE}/parents/${id}`,

  // Messages
  MESSAGES: `${API_BASE}/messages`,
  MESSAGE: (id: string) => `${API_BASE}/messages/${id}`,

  // School Years
  SCHOOL_YEARS: `${API_BASE}/school-years`,
  SCHOOL_YEAR: (id: string) => `${API_BASE}/school-years/${id}`,

  // Subjects
  SUBJECTS: `${API_BASE}/subjects`,
  SUBJECT: (id: string) => `${API_BASE}/subjects/${id}`,
};
