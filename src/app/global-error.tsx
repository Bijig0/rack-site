"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          <div
            style={{
              maxWidth: "500px",
              textAlign: "center",
            }}
          >
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                color: "#1a1a1a",
              }}
            >
              Something went wrong
            </h1>
            <p
              style={{
                fontSize: "1rem",
                color: "#666",
                marginBottom: "2rem",
                lineHeight: 1.6,
              }}
            >
              We apologize for the inconvenience. An unexpected error has occurred.
              Our team has been notified and is working to fix the issue.
            </p>
            <button
              onClick={() => reset()}
              style={{
                backgroundColor: "#eb6753",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#d85a47")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#eb6753")}
            >
              Try Again
            </button>
            {error.digest && (
              <p
                style={{
                  marginTop: "2rem",
                  fontSize: "0.75rem",
                  color: "#999",
                }}
              >
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
