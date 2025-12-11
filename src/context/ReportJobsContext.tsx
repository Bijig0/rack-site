"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { revalidateProperties } from "@/actions/properties";

export interface ReportJob {
  jobId: string;
  propertyId: string;
  statusUrl: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  message?: string;
  error?: string;
  startedAt: number;
}

interface ReportJobsContextType {
  reportJobs: ReportJob[];
  addReportJob: (job: Omit<ReportJob, "status" | "progress" | "startedAt">) => void;
  removeReportJob: (propertyId: string) => void;
  getReportJobForProperty: (propertyId: string) => ReportJob | undefined;
  isPropertyGeneratingReport: (propertyId: string) => boolean;
}

const ReportJobsContext = createContext<ReportJobsContextType | null>(null);

const STORAGE_KEY = "pending-report-jobs";
const JOB_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes - jobs older than this are considered stale

export function ReportJobsProvider({ children }: { children: ReactNode }) {
  const [reportJobs, setReportJobs] = useState<ReportJob[]>([]);
  const router = useRouter();

  // Use refs to avoid stale closures in polling interval
  const reportJobsRef = useRef<ReportJob[]>([]);
  const isPollingRef = useRef(false);

  // Keep ref in sync with state
  useEffect(() => {
    reportJobsRef.current = reportJobs;
  }, [reportJobs]);

  // Load pending jobs from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const jobs = JSON.parse(stored) as ReportJob[];
        // Filter out stale jobs (older than 10 minutes) and completed/failed jobs
        const now = Date.now();
        const activeJobs = jobs.filter(
          (j) =>
            (j.status === "pending" || j.status === "processing") &&
            now - j.startedAt < JOB_TIMEOUT_MS
        );
        setReportJobs(activeJobs);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save jobs to localStorage when they change
  useEffect(() => {
    if (reportJobs.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reportJobs));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [reportJobs]);

  // Poll active jobs for status updates - use ref to avoid recreating interval on every state change
  useEffect(() => {
    const hasActiveJobs = reportJobs.some(
      (j) => j.status === "pending" || j.status === "processing"
    );

    if (!hasActiveJobs) {
      // No active jobs, ensure polling is stopped
      isPollingRef.current = false;
      return;
    }

    // Prevent multiple polling loops
    if (isPollingRef.current) return;
    isPollingRef.current = true;

    const pollInterval = setInterval(async () => {
      // Get current active jobs from ref (always fresh)
      const activeJobs = reportJobsRef.current.filter(
        (j) => j.status === "pending" || j.status === "processing"
      );

      // Stop polling if no active jobs
      if (activeJobs.length === 0) {
        return;
      }

      for (const job of activeJobs) {
        try {
          const response = await fetch(job.statusUrl, {
            credentials: "include",
          });

          if (!response.ok) {
            // If we get a 404, the job might have completed and been cleaned up
            if (response.status === 404) {
              setReportJobs((prev) => prev.filter((j) => j.jobId !== job.jobId));
              continue;
            }
            throw new Error(`Failed to check status: ${response.status}`);
          }

          const data = await response.json();

          if (data.status === "completed") {
            // Job completed successfully
            setReportJobs((prev) =>
              prev.map((j) =>
                j.jobId === job.jobId
                  ? { ...j, status: "completed", progress: 100, message: "Report generated successfully!" }
                  : j
              )
            );

            // Revalidate the properties cache
            await revalidateProperties();

            // Trigger refresh to update server components
            router.refresh();

            // Remove the job after a short delay
            setTimeout(() => {
              setReportJobs((prev) => prev.filter((j) => j.jobId !== job.jobId));
            }, 2000);
          } else if (data.status === "failed") {
            // Job failed
            setReportJobs((prev) =>
              prev.map((j) =>
                j.jobId === job.jobId
                  ? { ...j, status: "failed", error: data.error || data.message || "Report generation failed" }
                  : j
              )
            );

            // Remove failed jobs after showing error briefly
            setTimeout(() => {
              setReportJobs((prev) => prev.filter((j) => j.jobId !== job.jobId));
            }, 5000);
          } else {
            // Update progress for active jobs
            setReportJobs((prev) =>
              prev.map((j) =>
                j.jobId === job.jobId
                  ? {
                      ...j,
                      status: data.status === "queued" ? "pending" : "processing",
                      progress: data.progress || j.progress,
                      message: data.message,
                    }
                  : j
              )
            );
          }
        } catch (err) {
          console.error("Error polling report job status:", err);
        }
      }
    }, 3000); // Poll every 3 seconds

    return () => {
      clearInterval(pollInterval);
      isPollingRef.current = false;
    };
    // Only re-run when hasActiveJobs changes (not on every reportJobs change)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportJobs.some((j) => j.status === "pending" || j.status === "processing")]);

  const addReportJob = useCallback((job: Omit<ReportJob, "status" | "progress" | "startedAt">) => {
    setReportJobs((prev) => {
      // Remove any existing job for this property
      const filtered = prev.filter((j) => j.propertyId !== job.propertyId);
      return [...filtered, { ...job, status: "pending", progress: 0, startedAt: Date.now() }];
    });
  }, []);

  const removeReportJob = useCallback((propertyId: string) => {
    setReportJobs((prev) => prev.filter((j) => j.propertyId !== propertyId));
  }, []);

  const getReportJobForProperty = useCallback(
    (propertyId: string) => {
      return reportJobs.find((j) => j.propertyId === propertyId);
    },
    [reportJobs]
  );

  const isPropertyGeneratingReport = useCallback(
    (propertyId: string) => {
      const job = reportJobs.find((j) => j.propertyId === propertyId);
      return job?.status === "pending" || job?.status === "processing";
    },
    [reportJobs]
  );

  return (
    <ReportJobsContext.Provider
      value={{
        reportJobs,
        addReportJob,
        removeReportJob,
        getReportJobForProperty,
        isPropertyGeneratingReport,
      }}
    >
      {children}
    </ReportJobsContext.Provider>
  );
}

export function useReportJobs() {
  const context = useContext(ReportJobsContext);
  if (!context) {
    throw new Error("useReportJobs must be used within a ReportJobsProvider");
  }
  return context;
}
