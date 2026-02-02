/**
 * Services exports
 * Point d'entrée central pour tous les services
 */

export * from './auth.service';
export * from './students.service';
export * from './grades.service';
export * from './attendance.service';
export * from './payments.service';
export * from './classes.service';

// Import services instances for re-export
import { authService } from './auth.service';
import { studentsService } from './students.service';
import { gradesService } from './grades.service';
import { attendanceService } from './attendance.service';
import { paymentsService } from './payments.service';
import { classesService } from './classes.service';

// Services instances
export {
  authService,
  studentsService,
  gradesService,
  attendanceService,
  paymentsService,
  classesService,
};
