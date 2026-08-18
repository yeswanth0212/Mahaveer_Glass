import { NextResponse } from 'next/server';
import { getFallbackData, saveFallbackData } from '@/lib/db';
import { seedInitialData } from '@/lib/seed';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  await seedInitialData();
  const data = getFallbackData();
  return NextResponse.json(data.businessInfo);
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = getFallbackData();

    data.businessInfo = {
      ...data.businessInfo,
      ...body
    };

    saveFallbackData(data);
    return NextResponse.json(data.businessInfo);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update business info' }, { status: 500 });
  }
}
