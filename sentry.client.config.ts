// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a user loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Define how likely traces are sampled. Adjust this value in production,
  // or use tracesSampler for greater control.
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Enable replay only in production
  replaysOnErrorSampleRate: process.env.NODE_ENV === "production" ? 1.0 : 0,
  replaysSessionSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 0,

  // Integrations
  integrations: [
    Sentry.replayIntegration({
      // Additional configuration options
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.browserTracingIntegration(),
  ],

  // Filter out common non-actionable errors
  ignoreErrors: [
    // Random plugins/extensions
    "top.GLOBALS",
    // Chrome extensions
    /extensions\//i,
    /^chrome:\/\//i,
    // Firefox extensions
    /^resource:\/\//i,
    // Network errors
    "Failed to fetch",
    "NetworkError",
    "Load failed",
    // AbortController
    "AbortError",
    // Common browser errors
    "ResizeObserver loop",
    // Script loading errors
    /Loading chunk \d+ failed/,
  ],

  // Deny URLs from certain third-party scripts
  denyUrls: [
    // Chrome extensions
    /extensions\//i,
    /^chrome:\/\//i,
    /^chrome-extension:\/\//i,
    // Firefox extensions
    /^moz-extension:\/\//i,
    // Safari extensions
    /^safari-extension:\/\//i,
  ],

  // Environment configuration
  environment: process.env.NODE_ENV || "development",

  // Enable sending of default PII
  sendDefaultPii: false,

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

    return event;
  },
});
