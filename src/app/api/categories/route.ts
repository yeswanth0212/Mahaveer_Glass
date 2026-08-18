import { NextResponse } from 'next/server';
import { getCategoriesFromFirestore, addCategoryToFirestore } from '@/lib/firestoreService';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const categories = await getCategoriesFromFirestore();
    return NextResponse.json(categories);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch categories' }, { status: 500 });
  }
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

    const newCategory = await addCategoryToFirestore({
      name: body.name,
      slug: body.slug,
      description: body.description || '',
      image: body.image || body.imageUrl || '',
      imageUrl: body.imageUrl || body.image || '',
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to add category' }, { status: 500 });
  }
}
