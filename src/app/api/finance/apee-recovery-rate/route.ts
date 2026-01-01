// src/app/api/finance/apee-recovery-rate/route.ts
import { NextResponse } from 'next/server';
import { calculateApeeRecoveryRate } from '@/lib/finance';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const classId = searchParams.get('classId');

  if (!classId) {
    return NextResponse.json({ error: 'classId is required' }, { status: 400 });
  }

  const recoveryRate = await calculateApeeRecoveryRate(classId);
  return NextResponse.json({ recoveryRate });
}
