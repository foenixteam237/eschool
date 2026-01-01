// src/lib/documents.test.ts
import { generateDocumentHash } from './documents';

describe('generateDocumentHash', () => {
  it('should return a string', async () => {
    const documentData = {
      studentId: 'test-student-id',
      documentType: 'test-document-type',
    };
    const hash = await generateDocumentHash(documentData);
    expect(typeof hash).toBe('string');
  });
});
