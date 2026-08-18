import { NextResponse } from 'next/server';
import { getFallbackData, saveFallbackData } from '@/lib/db';
import { seedInitialData } from '@/lib/seed';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  await seedInitialData();
  const data = getFallbackData();
  return NextResponse.json(data.products || []);
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.name || !body.category || body.price === undefined) {
      return NextResponse.json({ error: 'Name, category, and price are required' }, { status: 400 });
    }

    const data = getFallbackData();
    const newProduct = {
      id: 'prod-' + Date.now(),
      name: body.name,
      category: body.category,
      price: Number(body.price),
      priceDisplay: body.priceDisplay || `₹${Number(body.price).toLocaleString('en-IN')}`,
      typeVariant: body.typeVariant || '',
      shortDescription: body.shortDescription || '',
      specifications: Array.isArray(body.specifications) ? body.specifications : body.specifications ? body.specifications.split(',').map((s: string) => s.trim()) : [],
      variants: Array.isArray(body.variants) ? body.variants : body.variants ? body.variants.split(',').map((v: string) => v.trim()) : [],
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80',
      availability: body.availability || 'In Stock',
      createdAt: new Date().toISOString()
    };

    data.products.unshift(newProduct);
    saveFallbackData(data);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create product' }, { status: 500 });
  }
}
