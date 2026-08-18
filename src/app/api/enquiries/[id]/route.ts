import { NextResponse } from 'next/server';
import { getFallbackData, saveFallbackData } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await request.json();

  if (!['New', 'Contacted', 'Completed'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const data = getFallbackData();
  const enquiry = data.enquiries.find((e: any) => e.id === id);

  if (!enquiry) {
    return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
  }

  enquiry.status = status;
  saveFallbackData(data);

  return NextResponse.json(enquiry);
}
