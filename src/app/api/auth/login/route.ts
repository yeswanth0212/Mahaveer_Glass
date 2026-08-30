import { NextResponse } from 'next/server';
import { generateToken, TOKEN_NAME } from '@/lib/auth';

// Rate limiting in-memory store: IP -> { attempts: number, resetAt: number }
const loginAttempts = new Map<string, { attempts: number; resetAt: number }>();

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout after 5 failed attempts

function isRateLimited(ip: string): boolean {
  if (process.env.NODE_ENV !== 'production') return false;
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return false;

  if (now > record.resetAt) {
    loginAttempts.delete(ip);
    return false;
  }

  return record.attempts >= MAX_ATTEMPTS;
}

function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { attempts: 1, resetAt: now + LOCKOUT_MS });
  } else {
    record.attempts += 1;
  }
}

function clearAttempts(ip: string) {
  loginAttempts.delete(ip);
}

export async function POST(request: Request) {
  try {
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: 'Too many failed login attempts. Please try again after 15 minutes.' },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const expectedEmail = (process.env.ADMIN_EMAIL || 'admin@mahaveerhardware.com').toLowerCase().trim();
    const expectedPassword = process.env.ADMIN_PASSWORD || 'Mhvr@Adm!n#9271';

    const cleanInputEmail = String(email).toLowerCase().trim();
    const cleanInputPassword = String(password);

    // Strict credential verification
    const isValid = cleanInputEmail === expectedEmail && cleanInputPassword === expectedPassword;

    if (!isValid) {
      recordFailedAttempt(clientIp);
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    // Success — clear any failed attempts
    clearAttempts(clientIp);

    const token = generateToken({ id: 'admin-1', email: expectedEmail });
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
