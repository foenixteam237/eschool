// src/lib/finance.test.ts
import { logTransaction, calculateApeeRecoveryRate } from './finance';

describe('logTransaction', () => {
  it('should not throw an error', async () => {
    const paymentDetails = {
      id: 'test-payment-id',
      amount: 100,
      currency: 'USD',
    };
    await expect(logTransaction(paymentDetails)).resolves.not.toThrow();
  });
});

describe('calculateApeeRecoveryRate', () => {
  it('should return a number between 0 and 100', async () => {
    const recoveryRate = await calculateApeeRecoveryRate('test-class-id');
    expect(typeof recoveryRate).toBe('number');
    expect(recoveryRate).toBeGreaterThanOrEqual(0);
    expect(recoveryRate).toBeLessThanOrEqual(100);
  });
});
