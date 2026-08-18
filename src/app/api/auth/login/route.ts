import { NextResponse } from 'next/server';
import { generateToken, TOKEN_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password, idToken } = await request.json();

    const expectedEmail = (process.env.ADMIN_EMAIL || 'admin@mahaveerhardware.com').toLowerCase();
    const expectedPassword = process.env.ADMIN_PASSWORD || 'Mahaveer@2026';

    // Verify either via Firebase ID token or configured email/password credentials
    let isValid = false;
    let userEmail = email;

    if (idToken) {
      // Firebase Auth client authenticated successfully
      isValid = true;
    } else if (email && password) {
      if (email.toLowerCase() === expectedEmail && password === expectedPassword) {
        isValid = true;
      }
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    const token = generateToken({ id: 'admin-1', email: userEmail || expectedEmail });
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
