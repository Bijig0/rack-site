"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, ToastMessage } from "@/components/common/Toast";
import { revalidateProperties } from "@/actions/properties";

export interface PendingJob {
  jobId: string;
  statusUrl: string;
  addressCommonName: string;
  status: "pending" | "processing" | "success" | "error";
  error?: string;
  progress?: number;
}

interface PropertyJobsContextType {
  pendingJobs: PendingJob[];
  addJob: (job: Omit<PendingJob, "status">) => void;
  removeJob: (jobId: string) => void;
  showToast: (type: ToastMessage["type"], message: string) => void;
}

const PropertyJobsContext = createContext<PropertyJobsContextType | null>(null);

const STORAGE_KEY = "pending-property-jobs";

export function PropertyJobsProvider({ children }: { children: ReactNode }) {
  const [pendingJobs, setPendingJobs] = useState<PendingJob[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const router = useRouter();

  // Use refs to avoid stale closures in polling interval
  const pendingJobsRef = useRef<PendingJob[]>([]);
  const isPollingRef = useRef(false);

  // Keep ref in sync with state
  useEffect(() => {
    pendingJobsRef.current = pendingJobs;
  }, [pendingJobs]);

  // Load pending jobs from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const jobs = JSON.parse(stored) as PendingJob[];
        // Filter out completed/errored jobs older than 1 hour
        const activeJobs = jobs.filter(
          (j) => j.status === "pending" || j.status === "processing"
        );
        setPendingJobs(activeJobs);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save pending jobs to localStorage when they change
  useEffect(() => {
    if (pendingJobs.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pendingJobs));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [pendingJobs]);

  // Poll pending jobs - use ref to avoid recreating interval on every state change
  useEffect(() => {
    // Check if there are active jobs to poll
    const hasActiveJobs = pendingJobs.some(
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
      const activePendingJobs = pendingJobsRef.current.filter(
        (j) => j.status === "pending" || j.status === "processing"
      );

      // Stop polling if no active jobs
      if (activePendingJobs.length === 0) {
        return;
      }

      for (const job of activePendingJobs) {
        try {
          // statusUrl is a relative URL to our Next.js proxy (e.g., /api/properties/jobs/123)
          const response = await fetch(job.statusUrl);
          const data = await response.json();

          // BullMQ returns: waiting, active, completed, failed, delayed, paused
          // Our API returns "success" on completed jobs after creating the property record
          if (data.status === "success" || data.status === "completed") {
            // Job completed successfully
            setPendingJobs((prev) =>
              prev.map((j) =>
                j.jobId === job.jobId ? { ...j, status: "success" } : j
              )
            );
            showToast("success", `Property "${job.addressCommonName}" created successfully!`);

            // Revalidate the properties cache
            await revalidateProperties();

            // Trigger a client-side refresh to update any server components
            router.refresh();

            // Remove the job after a short delay
            setTimeout(() => {
              setPendingJobs((prev) => prev.filter((j) => j.jobId !== job.jobId));
            }, 1000);
          } else if (data.status === "failed" || data.error) {
            // Job failed
            setPendingJobs((prev) =>
              prev.map((j) =>
                j.jobId === job.jobId
                  ? { ...j, status: "error", error: data.error || data.message || "Failed to create property" }
                  : j
              )
            );
            showToast("error", `Failed to create property "${job.addressCommonName}": ${data.error || data.message || "Unknown error"}`);
          } else if (data.status === "active") {
            // Job is actively being processed
            setPendingJobs((prev) =>
              prev.map((j) =>
                j.jobId === job.jobId
                  ? { ...j, status: "processing", progress: data.progress }
                  : j
              )
            );
          } else if (data.status === "waiting" || data.status === "delayed") {
            // Job is queued/waiting
            setPendingJobs((prev) =>
              prev.map((j) =>
                j.jobId === job.jobId
                  ? { ...j, status: "pending", progress: data.progress }
                  : j
              )
            );
          }
        } catch (err) {
          console.error("Error polling job status:", err);
        }
      }
    }, 2000); // Poll every 2 seconds

    return () => {
      clearInterval(pollInterval);
      isPollingRef.current = false;
    };
    // Only re-run when hasActiveJobs changes (not on every pendingJobs change)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingJobs.some((j) => j.status === "pending" || j.status === "processing")]);

  const addJob = useCallback((job: Omit<PendingJob, "status">) => {
    setPendingJobs((prev) => [...prev, { ...job, status: "pending" }]);
  }, []);

  const removeJob = useCallback((jobId: string) => {
    setPendingJobs((prev) => prev.filter((j) => j.jobId !== jobId));
  }, []);

  const showToast = useCallback((type: ToastMessage["type"], message: string) => {
    const id = Math.random().toString(36).slice(2, 11);
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const closeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <PropertyJobsContext.Provider value={{ pendingJobs, addJob, removeJob, showToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={closeToast} />
    </PropertyJobsContext.Provider>
  );
}

export function usePropertyJobs() {
  const context = useContext(PropertyJobsContext);
  if (!context) {
    throw new Error("usePropertyJobs must be used within a PropertyJobsProvider");
  }
  return context;
}
