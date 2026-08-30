import { NextResponse } from 'next/server';
import { updateCategoryInFirestore, deleteCategoryFromFirestore } from '@/lib/firestoreService';
import { getAdminSession } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await updateCategoryInFirestore(id, {
      name: body.name,
      description: body.description,
      imageUrl: body.imageUrl || body.image,
      image: body.image || body.imageUrl,
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteCategoryFromFirestore(id);
    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete category' }, { status: 500 });
  }
}
