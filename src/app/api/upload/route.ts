import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 });
    }

    // Validate file size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 8MB.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert directly to Base64 Data URL (100% compatible with Vercel, serverless, and local)
    const mimeType = file.type || 'image/jpeg';
    const base64Data = buffer.toString('base64');
    const imageUrl = `data:${mimeType};base64,${base64Data}`;

    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
  }
}
