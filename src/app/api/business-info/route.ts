import { NextResponse } from 'next/server';
import { getBusinessInfoFromFirestore, updateBusinessInfoInFirestore } from '@/lib/firestoreService';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const info = await getBusinessInfoFromFirestore();
    return NextResponse.json(info);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch business info' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updated = await updateBusinessInfoInFirestore(body);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update business info' }, { status: 500 });
  }
}
