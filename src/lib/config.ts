import { z } from 'zod';

/**
 * Environment variable configuration with Zod validation.
 * The server will fail to start if required variables are missing.
 *
 * Usage:
 *   import { env } from '@/lib/config';
 *   const dbUrl = env.DATABASE_URL;
 */

// =============================================================================
// Schema Definition
// =============================================================================

const serverSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // =============================================================================
  // Database (Required)
  // =============================================================================
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid PostgreSQL connection URL'),

  // =============================================================================
  // Authentication (Required)
  // =============================================================================
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),

  // =============================================================================
  // API Server Configuration (Required for production)
  // =============================================================================
  DEDICATED_SERVER_URL: z.string().url().optional(),
  INTERNAL_API_KEY: z.string().min(1).optional(),

  // =============================================================================
  // Storage Configuration (Optional - features disabled if not set)
  // =============================================================================
  STORAGE_ENDPOINT: z.string().url().optional(),
  STORAGE_REGION: z.string().default('us-east-1'),
  STORAGE_BUCKET: z.string().optional(),
  STORAGE_ACCESS_KEY_ID: z.string().optional(),
  STORAGE_SECRET_ACCESS_KEY: z.string().optional(),
  STORAGE_PUBLIC_URL: z.string().url().optional().or(z.literal('')),
  STORAGE_MAX_FILE_SIZE_MB: z.coerce.number().positive().default(10),

  // =============================================================================
  // Email Configuration (Optional - email features disabled if not set)
  // =============================================================================
  EMAIL_HOST: z.string().optional(),
  EMAIL_PORT: z.coerce.number().positive().default(587),
  EMAIL_USERNAME: z.string().optional(),
  EMAIL_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),

  // =============================================================================
  // Sanity CMS (Optional)
  // =============================================================================
  SANITY_API_TOKEN: z.string().optional(),

  // =============================================================================
  // Sentry Error Tracking (Optional)
  // =============================================================================
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),

  // =============================================================================
  // SEO (Optional)
  // =============================================================================
  GOOGLE_SITE_VERIFICATION: z.string().optional(),
});

const clientSchema = z.object({
  // =============================================================================
  // Public Site Configuration
  // =============================================================================
  NEXT_PUBLIC_SITE_URL: z.string().url().default('https://rack.com.au'),

  // =============================================================================
  // API URLs
  // =============================================================================
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_DEDICATED_SERVER_URL: z.string().url().optional(),

  // =============================================================================
  // Maps & Geocoding (Google Maps)
  // =============================================================================
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().min(1, 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is required for address autocomplete'),

  // =============================================================================
  // Sanity CMS (Public)
  // =============================================================================
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().default('lj9mp7qf'),
  NEXT_PUBLIC_SANITY_DATASET: z.string().default('production'),

  // =============================================================================
  // Sentry (Public)
  // =============================================================================
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
});

// Combined schema for full validation
const envSchema = serverSchema.merge(clientSchema);

// =============================================================================
// Validation & Export
// =============================================================================

type ServerEnv = z.infer<typeof serverSchema>;
type ClientEnv = z.infer<typeof clientSchema>;
type Env = z.infer<typeof envSchema>;

/**
 * Validates environment variables and returns typed config.
 * Throws an error with details if validation fails.
 */
function validateEnv(): Env {
  // Only validate server vars on the server
  const isServer = typeof window === 'undefined';

  // Collect all env vars
  const envVars: Record<string, string | undefined> = {
    NODE_ENV: process.env.NODE_ENV,

    // Server-only vars (only include on server)
    ...(isServer ? {
      DATABASE_URL: process.env.DATABASE_URL,
      JWT_SECRET: process.env.JWT_SECRET,
      DEDICATED_SERVER_URL: process.env.DEDICATED_SERVER_URL,
      INTERNAL_API_KEY: process.env.INTERNAL_API_KEY,
      STORAGE_ENDPOINT: process.env.STORAGE_ENDPOINT,
      STORAGE_REGION: process.env.STORAGE_REGION,
      STORAGE_BUCKET: process.env.STORAGE_BUCKET,
      STORAGE_ACCESS_KEY_ID: process.env.STORAGE_ACCESS_KEY_ID,
      STORAGE_SECRET_ACCESS_KEY: process.env.STORAGE_SECRET_ACCESS_KEY,
      STORAGE_PUBLIC_URL: process.env.STORAGE_PUBLIC_URL,
      STORAGE_MAX_FILE_SIZE_MB: process.env.STORAGE_MAX_FILE_SIZE_MB,
      EMAIL_HOST: process.env.EMAIL_HOST,
      EMAIL_PORT: process.env.EMAIL_PORT,
      EMAIL_USERNAME: process.env.EMAIL_USERNAME,
      EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
      EMAIL_FROM: process.env.EMAIL_FROM,
      SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
      SENTRY_ORG: process.env.SENTRY_ORG,
      SENTRY_PROJECT: process.env.SENTRY_PROJECT,
      SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
      GOOGLE_SITE_VERIFICATION: process.env.GOOGLE_SITE_VERIFICATION,
    } : {}),

    // Client vars (available everywhere with NEXT_PUBLIC_ prefix)
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_DEDICATED_SERVER_URL: process.env.NEXT_PUBLIC_DEDICATED_SERVER_URL,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  };

  // Use appropriate schema based on environment
  const schema = isServer ? envSchema : clientSchema;
  const result = schema.safeParse(envVars);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const errorMessages = Object.entries(errors)
      .map(([key, messages]) => `  ${key}: ${messages?.join(', ')}`)
      .join('\n');

    console.error('\n❌ Invalid environment variables:\n' + errorMessages + '\n');

    throw new Error(
      `Environment validation failed. Please check your .env.local file.\n\nMissing or invalid variables:\n${errorMessages}`
    );
  }

  return result.data as Env;
}

// Validate on module load (will fail build/startup if invalid)
export const env = validateEnv();

// =============================================================================
// Type-safe accessors for specific feature configurations
// =============================================================================

/**
 * Check if storage is fully configured
 */
export function isStorageConfigured(): boolean {
  return !!(
    env.STORAGE_ENDPOINT &&
    env.STORAGE_BUCKET &&
    env.STORAGE_ACCESS_KEY_ID &&
    env.STORAGE_SECRET_ACCESS_KEY
  );
}

/**
 * Check if email is fully configured
 */
export function isEmailConfigured(): boolean {
  return !!(
    env.EMAIL_HOST &&
    env.EMAIL_USERNAME &&
    env.EMAIL_PASSWORD
  );
}

/**
 * Check if Sentry is configured
 */
export function isSentryConfigured(): boolean {
  return !!env.NEXT_PUBLIC_SENTRY_DSN;
}

/**
 * Check if we're in production
 */
export function isProduction(): boolean {
  return env.NODE_ENV === 'production';
}

/**
 * Check if we're in development
 */
export function isDevelopment(): boolean {
  return env.NODE_ENV === 'development';
}

// =============================================================================
// Storage config helper
// =============================================================================

export const storageConfig = {
  get endpoint() { return env.STORAGE_ENDPOINT || ''; },
  get region() { return env.STORAGE_REGION; },
  get bucket() { return env.STORAGE_BUCKET || ''; },
  get accessKeyId() { return env.STORAGE_ACCESS_KEY_ID || ''; },
  get secretAccessKey() { return env.STORAGE_SECRET_ACCESS_KEY || ''; },
  get publicUrl() { return env.STORAGE_PUBLIC_URL || ''; },
  get maxFileSizeMB() { return env.STORAGE_MAX_FILE_SIZE_MB; },
  get maxFileSizeBytes() { return env.STORAGE_MAX_FILE_SIZE_MB * 1024 * 1024; },
};

// =============================================================================
// Re-export types
// =============================================================================

export type { ServerEnv, ClientEnv, Env };
