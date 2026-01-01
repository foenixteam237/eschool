// src/app/api/documents/hash/route.ts
import { NextResponse } from 'next/server';
import { generateDocumentHash } from '@/lib/documents';

export async function POST(request: Request) {
  const documentData = await request.json();
  const hash = await generateDocumentHash(documentData);
  return NextResponse.json({ hash });
}
