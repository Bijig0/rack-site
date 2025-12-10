import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import {
  uploadFile,
  deleteFile,
  generateFileKey,
  extractKeyFromUrl,
  isValidImageType,
  getMaxFileSize,
  isStorageConfigured,
} from '@/lib/storage';

// Upload company logo
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { status: 'fail', message: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (!isStorageConfigured()) {
      return NextResponse.json(
        { status: 'fail', message: 'Storage is not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { status: 'fail', message: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!isValidImageType(file.type)) {
      return NextResponse.json(
        { status: 'fail', message: 'Invalid file type. Please upload an image (JPEG, PNG, GIF, or WebP)' },
        { status: 400 }
      );
    }

    // Validate file size
    const maxSize = getMaxFileSize();
    if (file.size > maxSize) {
      return NextResponse.json(
        { status: 'fail', message: `File too large. Maximum size is ${maxSize / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Get current user to check for existing logo
    const [currentUser] = await db
      .select({ companyLogoUrl: user.companyLogoUrl })
      .from(user)
      .where(eq(user.id, session.userId));

    // Delete old logo if exists
    if (currentUser?.companyLogoUrl) {
      const oldKey = extractKeyFromUrl(currentUser.companyLogoUrl);
      if (oldKey) {
        try {
          await deleteFile(oldKey);
        } catch (error) {
          console.error('Failed to delete old logo:', error);
          // Continue even if delete fails
        }
      }
    }

    // Upload new logo
    const buffer = Buffer.from(await file.arrayBuffer());
    const key = generateFileKey('company-logos', file.name);
    const { url } = await uploadFile(buffer, key, file.type);

    // Update user record
    await db
      .update(user)
      .set({
        companyLogoUrl: url,
        updatedAt: new Date(),
      } as any)
      .where(eq(user.id, session.userId));

    return NextResponse.json({
      status: 'success',
      message: 'Logo uploaded successfully',
      payload: { url },
    });
  } catch (error) {
    console.error('[POST /api/user/company-logo]', error);
    return NextResponse.json(
      { status: 'fail', message: 'Failed to upload logo' },
      { status: 500 }
    );
  }
}

// Delete company logo
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { status: 'fail', message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get current user's logo URL
    const [currentUser] = await db
      .select({ companyLogoUrl: user.companyLogoUrl })
      .from(user)
      .where(eq(user.id, session.userId));

    if (currentUser?.companyLogoUrl) {
      const key = extractKeyFromUrl(currentUser.companyLogoUrl);
      if (key) {
        try {
          await deleteFile(key);
        } catch (error) {
          console.error('Failed to delete logo from storage:', error);
          // Continue even if delete fails
        }
      }
    }

    // Update user record
    await db
      .update(user)
      .set({
        companyLogoUrl: null,
        updatedAt: new Date(),
      } as any)
      .where(eq(user.id, session.userId));

    return NextResponse.json({
      status: 'success',
      message: 'Logo deleted successfully',
    });
  } catch (error) {
    console.error('[DELETE /api/user/company-logo]', error);
    return NextResponse.json(
      { status: 'fail', message: 'Failed to delete logo' },
      { status: 500 }
    );
  }
}
