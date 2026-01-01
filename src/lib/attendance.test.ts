// src/lib/attendance.test.ts
import { createAbsenceNotification } from './attendance';

describe('createAbsenceNotification', () => {
  it('should not throw an error', async () => {
    await expect(createAbsenceNotification('test-student-id')).resolves.not.toThrow();
  });
});
