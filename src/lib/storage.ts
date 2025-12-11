import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { storageConfig, isStorageConfigured as checkStorageConfigured } from '@/lib/config';

// Re-export the config check function
export const isStorageConfigured = checkStorageConfigured;

// Create S3 client (works with any S3-compatible storage like Railway, MinIO, Cloudflare R2, etc.)
function getS3Client(): S3Client {
  if (!checkStorageConfigured()) {
    throw new Error('Storage is not configured. Please set the required environment variables.');
  }

  return new S3Client({
    endpoint: storageConfig.endpoint,
    region: storageConfig.region,
    credentials: {
      accessKeyId: storageConfig.accessKeyId,
      secretAccessKey: storageConfig.secretAccessKey,
    },
    forcePathStyle: true, // Required for most S3-compatible services
  });
}

// Generate a unique file key for storage
export function generateFileKey(
  folder: string,
  originalFilename: string
): string {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const extension = originalFilename.split('.').pop()?.toLowerCase() || 'jpg';
  const sanitizedName = originalFilename
    .split('.')[0]
    .replace(/[^a-zA-Z0-9]/g, '-')
    .substring(0, 30);

  return `${folder}/${timestamp}-${sanitizedName}-${randomSuffix}.${extension}`;
}

// Get a presigned URL for reading a file (Railway buckets are private)
export async function getPresignedReadUrl(key: string, expiresIn: number = 604800): Promise<string> {
  const client = getS3Client();

  const command = new GetObjectCommand({
    Bucket: storageConfig.bucket,
    Key: key,
  });

  // Generate presigned URL (default 7 days, max 90 days for Railway)
  return getSignedUrl(client, command, { expiresIn });
}

// Get the public URL for a file (deprecated for Railway - use getPresignedReadUrl instead)
export function getPublicUrl(key: string): string {
  if (storageConfig.publicUrl) {
    // Use CDN or custom public URL
    return `${storageConfig.publicUrl}/${key}`;
  }
  // Fallback to direct endpoint URL
  // For Railway Object Storage, the public URL format is: https://{bucket}.{endpoint-host}/{key}
  // e.g., https://pdfs-urro8dpjdf-cxa59g-ro.storage.railway.app/file.pdf
  try {
    const endpointUrl = new URL(storageConfig.endpoint);
    // Check if this looks like Railway storage
    if (endpointUrl.hostname === 'storage.railway.app') {
      return `https://${storageConfig.bucket}.storage.railway.app/${key}`;
    }
  } catch {
    // If URL parsing fails, fall through to default
  }
  return `${storageConfig.endpoint}/${storageConfig.bucket}/${key}`;
}

// Upload a file to storage
// Returns the key (not a URL) - use getPresignedReadUrl to get a readable URL
export async function uploadFile(
  file: Buffer,
  key: string,
  contentType: string
): Promise<{ url: string; key: string }> {
  const client = getS3Client();

  // Upload without ACL (Railway doesn't support public buckets)
  const command = new PutObjectCommand({
    Bucket: storageConfig.bucket,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await client.send(command);

  // Generate a presigned URL for immediate access (7 days)
  const url = await getPresignedReadUrl(key);
  console.log('[storage] File uploaded:', { key });

  return {
    url,
    key,
  };
}

// Delete a file from storage
export async function deleteFile(key: string): Promise<void> {
  const client = getS3Client();

  const command = new DeleteObjectCommand({
    Bucket: storageConfig.bucket,
    Key: key,
  });

  await client.send(command);
}

// Generate a presigned URL for direct upload from client
export async function generatePresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600 // 1 hour
): Promise<{ uploadUrl: string; publicUrl: string }> {
  const client = getS3Client();

  const command = new PutObjectCommand({
    Bucket: storageConfig.bucket,
    Key: key,
    ContentType: contentType,
    ACL: 'public-read',
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn });

  return {
    uploadUrl,
    publicUrl: getPublicUrl(key),
  };
}

// Extract key from a public URL
export function extractKeyFromUrl(url: string): string | null {
  try {
    // Try to extract key from the URL
    if (storageConfig.publicUrl && url.startsWith(storageConfig.publicUrl)) {
      return url.substring(storageConfig.publicUrl.length + 1);
    }

    // Try Railway format: https://{bucket}.storage.railway.app/{key}
    const railwayPrefix = `https://${storageConfig.bucket}.storage.railway.app/`;
    if (url.startsWith(railwayPrefix)) {
      return url.substring(railwayPrefix.length);
    }

    // Try endpoint format (legacy): https://storage.railway.app/{bucket}/{key}
    const endpointPrefix = `${storageConfig.endpoint}/${storageConfig.bucket}/`;
    if (url.startsWith(endpointPrefix)) {
      return url.substring(endpointPrefix.length);
    }

    return null;
  } catch {
    return null;
  }
}

// Validate image file type
export function isValidImageType(contentType: string): boolean {
  const validTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];
  return validTypes.includes(contentType.toLowerCase());
}

// Get max file size in bytes
export function getMaxFileSize(): number {
  return storageConfig.maxFileSizeBytes;
}
