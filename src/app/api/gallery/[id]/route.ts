import { NextResponse } from 'next/server';
import { deleteGalleryItemFromFirestore } from '@/lib/firestoreService';
import { getAdminSession } from '@/lib/auth';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteGalleryItemFromFirestore(id);
    return NextResponse.json({ success: true, message: 'Gallery item deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete gallery item' }, { status: 500 });
  }
}
