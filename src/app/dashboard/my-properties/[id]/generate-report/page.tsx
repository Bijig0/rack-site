"use client";

import Link from "next/link";
import Image from "next/image";
import { use, useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { revalidateProperties, getPropertyById } from "@/actions/properties";
import { getUserProfile, type UserProfile } from "@/actions/user";

type JobStatus = {
  status: "waiting" | "active" | "completed" | "failed" | "success";
  progress?: number;
  generateAPIUrl?: string;
  error?: string;
  message?: string;
};

type ErrorInfo = {
  message: string;
  attemptNumber: number;
  timestamp: Date;
};

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 3000; // 3 seconds between retries

export default function GenerateReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [attemptCount, setAttemptCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [errorHistory, setErrorHistory] = useState<ErrorInfo[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Track property data to avoid refetching on retry
  const propertyDataRef = useRef<{
    addressLine: string;
    suburb: string;
    state: string;
    postcode: string;
  } | null>(null);

  // Load user profile on mount
  useEffect(() => {
    getUserProfile().then(setUserProfile);
  }, []);

  // Poll job status
  const pollJobStatus = useCallback(async (statusUrl: string): Promise<void> => {
    const pollInterval = 2000; // 2 seconds
    const maxAttempts = 120; // 4 minutes max
    let attempts = 0;

    const poll = async (): Promise<void> => {
      attempts++;

      if (attempts > maxAttempts) {
        throw new Error("Report generation timed out. Please try again.");
      }

      try {
        const response = await fetch(statusUrl, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Failed to check status: ${response.status}`);
        }

        const data: JobStatus = await response.json();

        // Update progress
        if (typeof data.progress === "number") {
          setProgress(data.progress);
        }

        // Update status message based on progress
        if (data.progress !== undefined) {
          if (data.progress < 30) {
            setStatusMessage("Fetching property data...");
          } else if (data.progress < 60) {
            setStatusMessage("Analyzing market data...");
          } else if (data.progress < 90) {
            setStatusMessage("Generating report...");
          } else {
            setStatusMessage("Finalizing...");
          }
        }

        // Check completion states
        if (data.status === "success" || data.status === "completed") {
          setProgress(100);
          setStatusMessage("Report generated successfully!");
          setErrorHistory([]); // Clear error history on success

          // Revalidate caches
          await revalidateProperties();

          // Redirect back to property detail page
          setTimeout(() => {
            router.push(`/dashboard/my-properties/${id}`);
            router.refresh();
          }, 500);
          return;
        }

        if (data.status === "failed") {
          throw new Error(data.error || data.message || "Report generation failed");
        }

        // Continue polling for waiting/active states
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
        return poll();
      } catch (err) {
        throw err;
      }
    };

    return poll();
  }, [id, router]);

  // Core generation logic (can be called for initial attempt or retry)
  const executeGeneration = useCallback(async (currentAttempt: number): Promise<void> => {
    const dedicatedServerUrl = process.env.NEXT_PUBLIC_DEDICATED_SERVER_URL || "http://localhost:3000";

    // Use cached property data if available
    let propertyData = propertyDataRef.current;

    if (!propertyData) {
      // First attempt - fetch property data
      const property = await getPropertyById(id);

      if (!property) {
        throw new Error("Property not found");
      }

      if (!property.addressLine || !property.suburb || !property.state || !property.postcode) {
        throw new Error(
          "Property is missing address details. Please update the property with full address information."
        );
      }

      propertyData = {
        addressLine: property.addressLine,
        suburb: property.suburb,
        state: property.state,
        postcode: property.postcode,
      };
      propertyDataRef.current = propertyData;
    }

    // Call the Hono API to start report generation
    const response = await fetch(`${dedicatedServerUrl}/api/reports/generatePdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        ...propertyData,
        propertyId: id,
        attemptNumber: currentAttempt, // Send attempt number for server-side tracking
        // Include company branding info for the report
        companyName: userProfile?.companyName || null,
        companyLogoUrl: userProfile?.companyLogoUrl || null,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || data.message || "Failed to start report generation");
    }

    const { statusUrl } = await response.json();

    if (!statusUrl) {
      throw new Error("No status URL returned from server");
    }

    setStatusMessage("Report generation started...");
    setProgress(5);

    // Start polling for status
    await pollJobStatus(statusUrl);
  }, [id, pollJobStatus, userProfile]);

  // Handle retry with delay
  const handleRetry = useCallback(async (errorMessage: string, currentAttempt: number) => {
    // Record the error
    setErrorHistory((prev) => [
      ...prev,
      {
        message: errorMessage,
        attemptNumber: currentAttempt,
        timestamp: new Date(),
      },
    ]);

    if (currentAttempt >= MAX_RETRIES) {
      // Max retries reached - show final error
      setError(`Failed after ${MAX_RETRIES} attempts. Last error: ${errorMessage}`);
      setIsGenerating(false);
      setIsRetrying(false);
      setProgress(0);
      setStatusMessage("");
      return;
    }

    // Retry
    setIsRetrying(true);
    setError(null);
    setStatusMessage(`Error occurred. Retrying in ${RETRY_DELAY_MS / 1000} seconds... (Attempt ${currentAttempt + 1}/${MAX_RETRIES})`);

    // Wait before retry
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));

    const nextAttempt = currentAttempt + 1;
    setAttemptCount(nextAttempt);
    setIsRetrying(false);
    setProgress(0);
    setStatusMessage(`Starting retry attempt ${nextAttempt}...`);

    try {
      await executeGeneration(nextAttempt);
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : "An error occurred";
      await handleRetry(errMessage, nextAttempt);
    }
  }, [executeGeneration]);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setError(null);
    setProgress(0);
    setAttemptCount(1);
    setErrorHistory([]);
    propertyDataRef.current = null; // Clear cached data for fresh start
    setStatusMessage("Starting report generation...");

    try {
      await executeGeneration(1);
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : "An error occurred";
      await handleRetry(errMessage, 1);
    }
  };

  return (
    <>
      <div className="row align-items-center pb40">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2>Generate New Report</h2>
            <p className="text">
              <Link
                href={`/dashboard/my-properties/${id}`}
                className="text-decoration-underline"
              >
                ← Back to Property
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-8">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
            <h4 className="title fz17 mb30">Generate Appraisal Report</h4>

            <p className="text mb20">
              Click the button below to generate a new appraisal report for this
              property. The report will analyze market data and comparable
              properties to provide an estimated value range.
            </p>

            <div className="alert alert-info mb30">
              <i className="fas fa-info-circle me-2"></i>
              Report generation typically takes 1-2 minutes. You will be
              redirected back to the property page once the report is ready.
            </div>

            {/* Company Branding Preview */}
            {(userProfile?.companyName || userProfile?.companyLogoUrl) && (
              <div className="mb30 p-3 border rounded" style={{ backgroundColor: "#f8f9fa" }}>
                <h6 className="fz14 mb-3 d-flex align-items-center">
                  <i className="fas fa-building me-2 text-muted"></i>
                  Company Branding
                </h6>
                <div className="d-flex align-items-center gap-3">
                  {userProfile?.companyLogoUrl && (
                    <div
                      className="position-relative"
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 8,
                        overflow: "hidden",
                        border: "1px solid #e0e0e0",
                        backgroundColor: "#fff",
                      }}
                    >
                      <Image
                        src={userProfile.companyLogoUrl}
                        alt="Company Logo"
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  )}
                  <div>
                    {userProfile?.companyName && (
                      <p className="mb-0 fw500">{userProfile.companyName}</p>
                    )}
                    <small className="text-muted">
                      This branding will appear on your report
                    </small>
                  </div>
                </div>
              </div>
            )}

            {!userProfile?.companyName && !userProfile?.companyLogoUrl && (
              <div className="mb30 p-3 border rounded" style={{ backgroundColor: "#fff8e6", borderColor: "#ffc107" }}>
                <div className="d-flex align-items-start gap-2">
                  <i className="fas fa-lightbulb text-warning mt-1"></i>
                  <div>
                    <p className="mb-1 fz14 fw500">Add your company branding</p>
                    <p className="mb-2 fz13 text-muted">
                      Personalize your reports with your company logo and name.
                    </p>
                    <Link
                      href="/dashboard/profile"
                      className="btn btn-sm btn-outline-warning"
                    >
                      <i className="fas fa-cog me-1"></i>
                      Set up branding
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="alert alert-danger mb30">
                <i className="fas fa-exclamation-circle me-2"></i>
                {error}
              </div>
            )}

            {/* Error history display */}
            {errorHistory.length > 0 && !error && (
              <div className="alert alert-warning mb30">
                <i className="fas fa-history me-2"></i>
                <strong>Previous errors ({errorHistory.length}):</strong>
                <ul className="mb-0 mt-2">
                  {errorHistory.map((err, index) => (
                    <li key={index} className="small">
                      Attempt {err.attemptNumber}: {err.message}
                      <span className="text-muted ms-2">
                        ({err.timestamp.toLocaleTimeString()})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Progress display */}
            {isGenerating && (
              <div className="mb30">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted">
                    {isRetrying && (
                      <span className="text-warning me-2">
                        <i className="fas fa-redo-alt me-1"></i>
                        Retrying...
                      </span>
                    )}
                    {statusMessage}
                    {attemptCount > 1 && !isRetrying && (
                      <span className="text-muted ms-2">(Attempt {attemptCount}/{MAX_RETRIES})</span>
                    )}
                  </span>
                  <span className="fw-bold">{progress}%</span>
                </div>
                <div className="progress" style={{ height: "10px" }}>
                  <div
                    className={`progress-bar progress-bar-striped progress-bar-animated ${isRetrying ? "bg-warning" : ""}`}
                    role="progressbar"
                    style={{ width: `${progress}%` }}
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
              </div>
            )}

            <div className="d-flex gap-3">
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="ud-btn btn-thm"
              >
                {isGenerating ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Generating Report...
                  </>
                ) : (
                  <>
                    <i className="fas fa-file-alt me-2"></i>
                    Generate Report
                  </>
                )}
              </button>
              <Link
                href={`/dashboard/my-properties/${id}`}
                className="ud-btn btn-white2"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
