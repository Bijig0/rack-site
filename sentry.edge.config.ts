// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Define how likely traces are sampled. Adjust this value in production.
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Environment configuration
  environment: process.env.NODE_ENV || "development",

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
