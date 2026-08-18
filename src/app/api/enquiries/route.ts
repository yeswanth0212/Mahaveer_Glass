import { NextResponse } from 'next/server';
import { getEnquiriesFromFirestore, addEnquiryToFirestore } from '@/lib/firestoreService';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const enquiries = await getEnquiriesFromFirestore();
    return NextResponse.json(enquiries);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch enquiries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = body.customerName || body.name;
    const phone = body.phone;
    const message = body.message;

    if (!name || !phone || !message) {
      return NextResponse.json({ error: 'Name, phone, and message are required' }, { status: 400 });
    }

    const newEnquiry = await addEnquiryToFirestore({
      customerName: name,
      name,
      phone,
      email: body.email || '',
      productId: body.productId || '',
      productName: body.productName || body.product || 'General Enquiry',
      product: body.product || body.productName || 'General Enquiry',
      message,
      status: 'New'
    });

    return NextResponse.json({ success: true, enquiry: newEnquiry }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to submit enquiry' }, { status: 500 });
  }
}
