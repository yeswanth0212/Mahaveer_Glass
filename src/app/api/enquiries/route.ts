import { NextResponse } from 'next/server';
import { getFallbackData, saveFallbackData } from '@/lib/db';
import { seedInitialData } from '@/lib/seed';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await seedInitialData();
  const data = getFallbackData();
  return NextResponse.json(data.enquiries || []);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.phone || !body.message) {
      return NextResponse.json({ error: 'Name, phone, and message are required' }, { status: 400 });
    }

    const data = getFallbackData();
    const newEnquiry = {
      id: 'enq-' + Date.now(),
      name: body.name,
      phone: body.phone,
      email: body.email || '',
      product: body.product || 'General Enquiry',
      message: body.message,
      date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'New'
    };

    if (!data.enquiries) data.enquiries = [];
    data.enquiries.unshift(newEnquiry);
    saveFallbackData(data);

    return NextResponse.json({ success: true, enquiry: newEnquiry }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to submit enquiry' }, { status: 500 });
  }
}
