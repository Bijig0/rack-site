import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {
  uploadFile,
  generateFileKey,
  isValidImageType,
  getMaxFileSize,
  isStorageConfigured,
} from '@/lib/storage';
import { createScopedLogger, startTimer } from '@/lib/logger';

const log = createScopedLogger('api/upload');

export async function POST(request: NextRequest) {
  const getElapsed = startTimer();

  try {
    // Check if storage is configured
    if (!isStorageConfigured()) {
      log.warn('Upload attempted but storage is not configured');
      return NextResponse.json(
        { error: 'Storage is not configured. Please contact the administrator.' },
        { status: 503 }
      );
    }

    // Verify authentication
    const session = await getSession();
    if (!session?.userId) {
      log.warn('Unauthorized upload attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'uploads';

    if (!file) {
      log.warn('Upload attempt with no file', { userId: session.userId });
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!isValidImageType(file.type)) {
      log.warn('Upload attempt with invalid file type', { userId: session.userId, fileType: file.type });
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP' },
        { status: 400 }
      );
    }

    // Validate file size
    const maxSize = getMaxFileSize();
    if (file.size > maxSize) {
      const maxMB = Math.round(maxSize / (1024 * 1024));
      log.warn('Upload attempt with file too large', { userId: session.userId, fileSize: file.size, maxSize });
      return NextResponse.json(
        { error: `File too large. Maximum size: ${maxMB}MB` },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique file key with user folder
    const key = generateFileKey(`${folder}/${session.userId}`, file.name);

    // Upload to storage
    const result = await uploadFile(buffer, key, file.type);

    log.info('File uploaded successfully', {
      userId: session.userId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      key: result.key,
      durationMs: getElapsed(),
    });

    return NextResponse.json({
      success: true,
      url: result.url,
      key: result.key,
    });
  } catch (error) {
    log.error('Upload failed', error, { durationMs: getElapsed() });
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS if needed
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
