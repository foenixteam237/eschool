/**
 * Services exports
 * Point d'entrée central pour tous les services (Norme MINESEC Cameroun)
 */

export * from './auth.service';
export * from './students.service';
export * from './grades.service';
export * from './attendance.service';
export * from './payments.service';
export * from './classes.service';
export * from './subjects.service';
export * from './timetable.service';
export * from './discipline.service';
export type { SchoolItem, SchoolStats, CreateSchoolApiPayload } from './schools.service';
export * from './superadmin.service';

// Import services instances for re-export
import { authService } from './auth.service';
import { studentsService } from './students.service';
import { gradesService } from './grades.service';
import { attendanceService } from './attendance.service';
import { paymentsService } from './payments.service';
import { classesService } from './classes.service';
import { subjectsService } from './subjects.service';
import { timetableService } from './timetable.service';
import { disciplineService } from './discipline.service';
import { schoolsService } from './schools.service';
import { superAdminService } from './superadmin.service';

// Services instances
export {
  authService,
  studentsService,
  gradesService,
  attendanceService,
  paymentsService,
  classesService,
  subjectsService,
  timetableService,
  disciplineService,
  schoolsService,
  superAdminService,
};
