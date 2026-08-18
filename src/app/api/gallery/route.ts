import { NextResponse } from 'next/server';
import { getFallbackData, saveFallbackData } from '@/lib/db';
import { seedInitialData } from '@/lib/seed';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  await seedInitialData();
  const data = getFallbackData();
  return NextResponse.json(data.gallery || []);
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.title || !body.imageUrl || !body.category) {
      return NextResponse.json({ error: 'Title, category, and image URL are required' }, { status: 400 });
    }

    const data = getFallbackData();
    const newItem = {
      id: 'gal-' + Date.now(),
      title: body.title,
      category: body.category,
      imageUrl: body.imageUrl,
      date: new Date().toISOString().split('T')[0]
    };

    if (!data.gallery) data.gallery = [];
    data.gallery.unshift(newItem);
    saveFallbackData(data);

    return NextResponse.json(newItem, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to add gallery item' }, { status: 500 });
  }
}
