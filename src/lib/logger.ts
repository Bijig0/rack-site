import * as Sentry from '@sentry/nextjs';
import { isProduction as checkIsProduction } from '@/lib/config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

interface Logger {
  debug: (message: string, context?: LogContext) => void;
  info: (message: string, context?: LogContext) => void;
  warn: (message: string, context?: LogContext) => void;
  error: (message: string, error?: Error | unknown, context?: LogContext) => void;
}

/**
 * Format log message with timestamp and level
 */
function formatMessage(level: LogLevel, message: string): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
}

/**
 * Serialize context for logging
 */
function serializeContext(context?: LogContext): string {
  if (!context || Object.keys(context).length === 0) return '';
  try {
    return ` | ${JSON.stringify(context)}`;
  } catch {
    return ' | [Context serialization failed]';
  }
}

/**
 * Add breadcrumb to Sentry for tracing
 */
function addBreadcrumb(level: LogLevel, message: string, context?: LogContext) {
  if (checkIsProduction()) {
    Sentry.addBreadcrumb({
      category: 'log',
      message,
      level: level === 'debug' ? 'debug' : level === 'info' ? 'info' : level === 'warn' ? 'warning' : 'error',
      data: context,
    });
  }
}

/**
 * Production-ready logger with Sentry integration
 *
 * Usage:
 * ```ts
 * import { logger } from '@/lib/logger';
 *
 * logger.info('User logged in', { userId: '123' });
 * logger.error('Failed to process payment', error, { orderId: '456' });
 * ```
 */
export const logger: Logger = {
  debug(message: string, context?: LogContext) {
    if (!checkIsProduction()) {
      console.debug(formatMessage('debug', message) + serializeContext(context));
    }
    // Debug logs are not sent to Sentry in production
  },

  info(message: string, context?: LogContext) {
    const formattedMessage = formatMessage('info', message);

    if (checkIsProduction()) {
      // In production, use structured logging format
      console.log(JSON.stringify({
        level: 'info',
        message,
        timestamp: new Date().toISOString(),
        ...context,
      }));
    } else {
      console.log(formattedMessage + serializeContext(context));
    }

    addBreadcrumb('info', message, context);
  },

  warn(message: string, context?: LogContext) {
    const formattedMessage = formatMessage('warn', message);

    if (checkIsProduction()) {
      console.warn(JSON.stringify({
        level: 'warn',
        message,
        timestamp: new Date().toISOString(),
        ...context,
      }));
    } else {
      console.warn(formattedMessage + serializeContext(context));
    }

    addBreadcrumb('warn', message, context);
  },

  error(message: string, error?: Error | unknown, context?: LogContext) {
    const formattedMessage = formatMessage('error', message);
    const errorDetails = error instanceof Error
      ? { errorName: error.name, errorMessage: error.message, stack: error.stack }
      : { error: String(error) };

    const fullContext = { ...context, ...errorDetails };

    if (checkIsProduction()) {
      console.error(JSON.stringify({
        level: 'error',
        message,
        timestamp: new Date().toISOString(),
        ...fullContext,
      }));

      // Capture error in Sentry
      if (error instanceof Error) {
        Sentry.captureException(error, {
          extra: context,
          tags: { source: 'logger' },
        });
      } else {
        Sentry.captureMessage(message, {
          level: 'error',
          extra: fullContext,
          tags: { source: 'logger' },
        });
      }
    } else {
      console.error(formattedMessage + serializeContext(fullContext));
      if (error instanceof Error && error.stack) {
        console.error(error.stack);
      }
    }

    addBreadcrumb('error', message, fullContext);
  },
};

/**
 * Create a scoped logger with a prefix
 *
 * Usage:
 * ```ts
 * const authLogger = createScopedLogger('auth');
 * authLogger.info('User logged in'); // [auth] User logged in
 * ```
 */
export function createScopedLogger(scope: string): Logger {
  const prefix = `[${scope}]`;

  return {
    debug: (message, context) => logger.debug(`${prefix} ${message}`, { scope, ...context }),
    info: (message, context) => logger.info(`${prefix} ${message}`, { scope, ...context }),
    warn: (message, context) => logger.warn(`${prefix} ${message}`, { scope, ...context }),
    error: (message, error, context) => logger.error(`${prefix} ${message}`, error, { scope, ...context }),
  };
}

/**
 * Log API request details (for use in API routes)
 */
export function logApiRequest(
  method: string,
  path: string,
  statusCode: number,
  durationMs: number,
  context?: LogContext
) {
  const message = `${method} ${path} ${statusCode} ${durationMs}ms`;

  if (statusCode >= 500) {
    logger.error(message, undefined, context);
  } else if (statusCode >= 400) {
    logger.warn(message, context);
  } else {
    logger.info(message, context);
  }
}

/**
 * Performance timing utility
 */
export function startTimer(): () => number {
  const start = performance.now();
  return () => Math.round(performance.now() - start);
}

export default logger;
