import { NextResponse } from 'next/server';
import { getFallbackData, saveFallbackData } from '@/lib/db';
import { seedInitialData } from '@/lib/seed';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  await seedInitialData();
  const data = getFallbackData();
  return NextResponse.json(data.categories || []);
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const data = getFallbackData();
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCategory = {
      id: 'cat-' + Date.now(),
      name: body.name,
      slug,
      description: body.description || ''
    };

    data.categories.push(newCategory);
    saveFallbackData(data);

    return NextResponse.json(newCategory, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to add category' }, { status: 500 });
  }
}
