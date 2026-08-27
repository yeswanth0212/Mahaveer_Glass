import { NextResponse } from 'next/server';
import { getProductByIdFromFirestore, updateProductInFirestore, deleteProductFromFirestore } from '@/lib/firestoreService';
import { getAdminSession } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await getProductByIdFromFirestore(id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await updateProductInFirestore(id, {
      ...body,
      price: body.price !== undefined ? Number(body.price) : undefined,
      basePrice: body.basePrice !== undefined ? Number(body.basePrice) : undefined,
      discountType: body.discountType || undefined,
      discountValue: body.discountValue !== undefined ? Number(body.discountValue) : undefined,
      specifications: Array.isArray(body.specifications) ? body.specifications : typeof body.specifications === 'string' ? body.specifications.split(',').map((s: string) => s.trim()) : undefined,
      variants: Array.isArray(body.variants) ? body.variants : typeof body.variants === 'string' ? body.variants.split(',').map((v: string) => v.trim()) : undefined,
      variantsData: Array.isArray(body.variantsData) ? body.variantsData : undefined,
    });

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

  try {
    const { id } = await params;
    await deleteProductFromFirestore(id);
    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete product' }, { status: 500 });
  }
}
