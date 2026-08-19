import { NextResponse } from 'next/server';
import { 
  seedFirestoreProducts, 
  seedFirestoreCategories, 
  seedFirestoreGallery,
  getBusinessInfoFromFirestore 
} from '@/lib/firestoreService';

export async function GET() {
  try {
    await seedFirestoreProducts();
    await seedFirestoreCategories();
    await seedFirestoreGallery();
    await getBusinessInfoFromFirestore();

    return NextResponse.json({
      success: true,
      message: 'Successfully created collections and seeded initial data into Cloud Firestore!',
      collectionsSeeded: ['products', 'categories', 'gallery', 'business']
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to seed Firestore database'
    }, { status: 500 });
  }
}
