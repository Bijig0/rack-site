import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import {
  uploadFile,
  deleteFile,
  generateFileKey,
  isValidImageType,
  getMaxFileSize,
  isStorageConfigured,
} from '@/lib/storage';

// Helper to extract key from stored value (could be a key or legacy URL)
function getKeyFromStored(stored: string): string {
  // If it's already a key (doesn't start with http), return as-is
  if (!stored.startsWith('http')) {
    return stored;
  }

  // Handle legacy URLs - extract key from various URL formats
  // Format: https://{bucket}.storage.railway.app/{key}
  const railwayMatch = stored.match(/\.storage\.railway\.app\/(.+)$/);
  if (railwayMatch) {
    return railwayMatch[1];
  }

  // Format: https://storage.railway.app/{bucket}/{key}
  const pathMatch = stored.match(/storage\.railway\.app\/[^/]+\/(.+)$/);
  if (pathMatch) {
    return pathMatch[1];
  }

  // Format with query params (presigned URL) - extract key before ?
  const urlWithParams = stored.split('?')[0];
  const keyMatch = urlWithParams.match(/\/([^/]+\/[^/]+\.[^/]+)$/);
  if (keyMatch) {
    return keyMatch[1];
  }

  // Fallback - return as-is (might fail but better than nothing)
  return stored;
}

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
      const oldKey = getKeyFromStored(currentUser.companyLogoUrl);
      try {
        await deleteFile(oldKey);
        console.log('[company-logo] Deleted old logo:', oldKey);
      } catch (error) {
        console.error('Failed to delete old logo:', error);
        // Continue even if delete fails
      }
    }

    // Upload new logo
    const buffer = Buffer.from(await file.arrayBuffer());
    const key = generateFileKey('company-logos', file.name);

    console.log('[company-logo] Uploading file:', {
      key,
      contentType: file.type,
      size: buffer.length,
    });

    const { url } = await uploadFile(buffer, key, file.type);

    console.log('[company-logo] Upload successful, key:', key);

    // Store the KEY (not URL) in the database
    // Presigned URLs will be generated on-demand when fetching profile
    await db
      .update(user)
      .set({
        companyLogoUrl: key, // Store key, not URL
        updatedAt: new Date(),
      } as any)
      .where(eq(user.id, session.userId));

    return NextResponse.json({
      status: 'success',
      message: 'Logo uploaded successfully',
      payload: { url, key },
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

    // Get current user's logo key
    const [currentUser] = await db
      .select({ companyLogoUrl: user.companyLogoUrl })
      .from(user)
      .where(eq(user.id, session.userId));

    if (currentUser?.companyLogoUrl) {
      const key = getKeyFromStored(currentUser.companyLogoUrl);
      try {
        await deleteFile(key);
        console.log('[company-logo] Deleted logo:', key);
      } catch (error) {
        console.error('Failed to delete logo from storage:', error);
        // Continue even if delete fails
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
