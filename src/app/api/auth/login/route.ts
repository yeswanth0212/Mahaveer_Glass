import { NextResponse } from 'next/server';
import { getFallbackData, saveFallbackData } from '@/lib/db';
import { comparePassword, generateToken, TOKEN_NAME } from '@/lib/auth';
import { seedInitialData } from '@/lib/seed';

export async function POST(request: Request) {
  try {
    await seedInitialData();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const data = getFallbackData();
    const admin = data.admin.find((a: any) => a.email.toLowerCase() === email.toLowerCase());

    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await comparePassword(password, admin.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateToken({ id: admin.id || 'admin-1', email: admin.email });
    const response = NextResponse.json({ success: true, message: 'Authentication successful' });

    response.cookies.set(TOKEN_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Authentication failed' }, { status: 500 });
  }
}
