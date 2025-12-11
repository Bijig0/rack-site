import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Storage configuration from environment variables
const config = {
  endpoint: process.env.STORAGE_ENDPOINT || '',
  region: process.env.STORAGE_REGION || 'us-east-1',
  bucket: process.env.STORAGE_BUCKET || '',
  accessKeyId: process.env.STORAGE_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY || '',
  publicUrl: process.env.STORAGE_PUBLIC_URL || '', // CDN or public bucket URL
};

// Validate configuration
export function isStorageConfigured(): boolean {
  return !!(
    config.endpoint &&
    config.bucket &&
    config.accessKeyId &&
    config.secretAccessKey
  );
}

// Create S3 client (works with any S3-compatible storage like Railway, MinIO, Cloudflare R2, etc.)
function getS3Client(): S3Client {
  if (!isStorageConfigured()) {
    throw new Error('Storage is not configured. Please set the required environment variables.');
  }

  return new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
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
    Bucket: config.bucket,
    Key: key,
  });

  // Generate presigned URL (default 7 days, max 90 days for Railway)
  return getSignedUrl(client, command, { expiresIn });
}

// Get the public URL for a file (deprecated for Railway - use getPresignedReadUrl instead)
export function getPublicUrl(key: string): string {
  if (config.publicUrl) {
    // Use CDN or custom public URL
    return `${config.publicUrl}/${key}`;
  }
  // Fallback to direct endpoint URL
  // For Railway Object Storage, the public URL format is: https://{bucket}.{endpoint-host}/{key}
  // e.g., https://pdfs-urro8dpjdf-cxa59g-ro.storage.railway.app/file.pdf
  try {
    const endpointUrl = new URL(config.endpoint);
    // Check if this looks like Railway storage
    if (endpointUrl.hostname === 'storage.railway.app') {
      return `https://${config.bucket}.storage.railway.app/${key}`;
    }
  } catch {
    // If URL parsing fails, fall through to default
  }
  return `${config.endpoint}/${config.bucket}/${key}`;
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
    Bucket: config.bucket,
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
    Bucket: config.bucket,
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
    Bucket: config.bucket,
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
    if (config.publicUrl && url.startsWith(config.publicUrl)) {
      return url.substring(config.publicUrl.length + 1);
    }

    // Try Railway format: https://{bucket}.storage.railway.app/{key}
    const railwayPrefix = `https://${config.bucket}.storage.railway.app/`;
    if (url.startsWith(railwayPrefix)) {
      return url.substring(railwayPrefix.length);
    }

    // Try endpoint format (legacy): https://storage.railway.app/{bucket}/{key}
    const endpointPrefix = `${config.endpoint}/${config.bucket}/`;
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

// Get max file size in bytes (default 10MB)
export function getMaxFileSize(): number {
  const maxMB = parseInt(process.env.STORAGE_MAX_FILE_SIZE_MB || '10', 10);
  return maxMB * 1024 * 1024;
}
