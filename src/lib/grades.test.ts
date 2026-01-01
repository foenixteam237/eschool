// src/lib/grades.test.ts
import { toggleGradeLock } from './grades';

describe('toggleGradeLock', () => {
  it('should not throw an error', async () => {
    // We're just logging to the console, so we can't test the output.
    // We can, however, test that the function doesn't throw an error.
    await expect(toggleGradeLock('test-grade-id')).resolves.not.toThrow();
  });
});
