import { NextResponse } from 'next/server';
import { getProductsFromFirestore, addProductToFirestore } from '@/lib/firestoreService';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const products = await getProductsFromFirestore();
    return NextResponse.json(products);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch products' }, { status: 500 });
  }
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

    const newProduct = await addProductToFirestore({
      name: body.name,
      category: body.category,
      price: Number(body.price),
      basePrice: body.basePrice !== undefined ? Number(body.basePrice) : undefined,
      discountType: body.discountType || 'percentage',
      discountValue: body.discountValue !== undefined ? Number(body.discountValue) : 0,
      typeVariant: body.typeVariant || '',
      shortDescription: body.shortDescription || body.description || '',
      description: body.description || body.shortDescription || '',
      specifications: Array.isArray(body.specifications) ? body.specifications : body.specifications ? body.specifications.split(',').map((s: string) => s.trim()) : [],
      variants: Array.isArray(body.variants) ? body.variants : body.variants ? body.variants.split(',').map((v: string) => v.trim()) : [],
      variantsData: Array.isArray(body.variantsData) ? body.variantsData : undefined,
      imageUrl: body.imageUrl || body.image || 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80',
      image: body.image || body.imageUrl || 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80',
      availability: body.availability || (body.available === false ? 'Out of Stock' : 'In Stock'),
      available: body.available !== undefined ? Boolean(body.available) : true,
      featured: Boolean(body.featured),
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create product' }, { status: 500 });
  }
}
