import { NextResponse } from 'next/server';
import { getGalleryFromFirestore, addGalleryItemToFirestore } from '@/lib/firestoreService';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const gallery = await getGalleryFromFirestore();
    return NextResponse.json(gallery);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch gallery items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const image = body.imageUrl || body.image;
    if (!body.title || !image || !body.category) {
      return NextResponse.json({ error: 'Title, category, and image URL are required' }, { status: 400 });
    }

    const newItem = await addGalleryItemToFirestore({
      title: body.title,
      category: body.category,
      image,
      imageUrl: image,
      description: body.description || body.title,
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to add gallery item' }, { status: 500 });
  }
}
