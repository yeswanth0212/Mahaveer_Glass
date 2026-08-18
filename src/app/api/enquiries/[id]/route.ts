import { NextResponse } from 'next/server';
import { updateEnquiryStatusInFirestore } from '@/lib/firestoreService';
import { getAdminSession } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!['New', 'Contacted', 'Completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await updateEnquiryStatusInFirestore(id, status);
    return NextResponse.json({ success: true, id, status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update enquiry status' }, { status: 500 });
  }
}
