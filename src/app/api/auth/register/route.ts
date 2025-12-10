import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { user, account } from '@/db/schema';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, companyName } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { status: 'fail', message: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { status: 'fail', message: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email.toLowerCase()));

    if (existingUser) {
      return NextResponse.json(
        { status: 'fail', message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Generate IDs
    const userId = nanoid();
    const accountId = nanoid();

    // Create user
    const [newUser] = await db
      .insert(user)
      .values({
        id: userId,
        name: name || 'User',
        email: email.toLowerCase(),
        emailVerified: false,
        role: 'real-estate-agent',
        companyName: companyName || null,
      } as any)
      .returning({ id: user.id, email: user.email, name: user.name, companyName: user.companyName });

    // Create credential account with password
    await db.insert(account).values({
      id: accountId,
      accountId: email.toLowerCase(),
      providerId: 'credential',
      userId: userId,
      password: hashedPassword,
    } as any);

    return NextResponse.json(
      {
        status: 'success',
        message: 'Registration successful.',
        payload: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/auth/register]', error);
    return NextResponse.json(
      { status: 'fail', message: 'Registration failed' },
      { status: 500 }
    );
  }
}
