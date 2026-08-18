import { NextResponse } from 'next/server';
import { getFallbackData, saveFallbackData } from '@/lib/db';
import { seedInitialData } from '@/lib/seed';
import { getAdminSession } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await seedInitialData();
  const { id } = await params;
  const data = getFallbackData();
  const product = data.products.find((p: any) => p.id === id || p._id === id);

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const data = getFallbackData();

    const index = data.products.findIndex((p: any) => p.id === id || p._id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updated = {
      ...data.products[index],
      ...body,
      price: body.price !== undefined ? Number(body.price) : data.products[index].price,
      priceDisplay: body.price !== undefined ? `₹${Number(body.price).toLocaleString('en-IN')}` : data.products[index].priceDisplay,
      specifications: Array.isArray(body.specifications) ? body.specifications : typeof body.specifications === 'string' ? body.specifications.split(',').map((s: string) => s.trim()) : data.products[index].specifications,
      variants: Array.isArray(body.variants) ? body.variants : typeof body.variants === 'string' ? body.variants.split(',').map((v: string) => v.trim()) : data.products[index].variants,
    };

    data.products[index] = updated;
    saveFallbackData(data);

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const data = getFallbackData();
  const initialLength = data.products.length;

  data.products = data.products.filter((p: any) => p.id !== id && p._id !== id);

  if (data.products.length === initialLength) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  saveFallbackData(data);
  return NextResponse.json({ success: true, message: 'Product deleted successfully' });
}
