// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Define how likely traces are sampled. Adjust this value in production.
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Environment configuration
  environment: process.env.NODE_ENV || "development",

  // Enable sending of default PII (personally identifiable information)
  sendDefaultPii: false,

  // Integrations for server
  integrations: [
    Sentry.httpIntegration(),
  ],

  // Filter out certain errors
  ignoreErrors: [
    // Authentication errors (expected behavior)
    "Not authenticated",
    "Invalid token",
    "Token expired",
    // Network timeouts
    "ETIMEDOUT",
    "ECONNRESET",
    "ECONNREFUSED",
  ],

  // Before send hook for additional filtering
  beforeSend(event, hint) {
    // Don't send events in development unless explicitly enabled
    if (process.env.NODE_ENV !== "production" && !process.env.SENTRY_DEBUG) {
      return null;
    }

    // Filter out events without a DSN configured
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
      return null;
    }

    // Add additional context
    const error = hint.originalException;
    if (error instanceof Error) {
      // Add error fingerprinting for better grouping
      event.fingerprint = [error.name, error.message.split('\n')[0]];
    }

    return event;
  },

  // Before breadcrumb hook
  beforeBreadcrumb(breadcrumb, hint) {
    // Filter out noisy breadcrumbs
    if (breadcrumb.category === 'console' && breadcrumb.level === 'debug') {
      return null;
    }
    return breadcrumb;
  },
});
