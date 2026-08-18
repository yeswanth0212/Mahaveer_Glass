import { NextResponse } from 'next/server';
import { getFallbackData, saveFallbackData } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const data = getFallbackData();
  const initialLength = data.gallery.length;

  data.gallery = data.gallery.filter((g: any) => g.id !== id);

  if (data.gallery.length === initialLength) {
    return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
  }

  saveFallbackData(data);
  return NextResponse.json({ success: true, message: 'Gallery item deleted successfully' });
}
