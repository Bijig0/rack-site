"use client";

import { usePropertyJobs } from "@/context/PropertyJobsContext";

export default function PendingPropertyJobs() {
  const { pendingJobs, removeJob } = usePropertyJobs();

  // Filter to only show active jobs (pending, processing, or error)
  const activeJobs = pendingJobs.filter(
    (j) => j.status === "pending" || j.status === "processing" || j.status === "error"
  );

  if (activeJobs.length === 0) return null;

  return (
    <>
      {activeJobs.map((job) => (
        <tr key={job.jobId} className="border-bottom">
          <td className="py-3 ps-3">
            <div className="d-flex align-items-center">
              <div
                className="flex-shrink-0 d-flex align-items-center justify-content-center"
                style={{
                  width: 56,
                  height: 56,
                  backgroundColor: job.status === "error" ? "#ffebee" : "#e3f2fd",
                  borderRadius: 10,
                }}
              >
                {job.status === "error" ? (
                  <i className="fas fa-exclamation-triangle fz20" style={{ color: "#c62828" }} />
                ) : (
                  <span
                    className="spinner-border spinner-border-sm"
                    style={{ color: "#1565c0" }}
                    role="status"
                  />
                )}
              </div>
              <div className="ms-3">
                <span
                  className="fw600 fz15 text-dark d-block mb-1"
                  style={{ lineHeight: 1.3 }}
                >
                  {job.addressCommonName.length > 35
                    ? `${job.addressCommonName.substring(0, 35)}...`
                    : job.addressCommonName}
                </span>
                <span className="fz13" style={{ color: job.status === "error" ? "#c62828" : "#1565c0" }}>
                  {job.status === "error"
                    ? job.error || "Failed to create property"
                    : job.status === "processing"
                    ? "Fetching property data..."
                    : "Starting..."}
                </span>
              </div>
            </div>
          </td>
          <td className="py-3 px-3">
            <span className="fz14" style={{ color: "#999" }}>
              —
            </span>
          </td>
          <td className="py-3 px-3 text-center">
            <span className="fz14" style={{ color: "#999" }}>
              — / —
            </span>
          </td>
          <td className="py-3 px-3 text-center">
            <span
              className="fz12 fw600 d-inline-block px-3 py-1 rounded-pill"
              style={{
                backgroundColor: job.status === "error" ? "#ffebee" : "#e3f2fd",
                color: job.status === "error" ? "#c62828" : "#1565c0",
              }}
            >
              {job.status === "error" ? (
                <>
                  <i className="fas fa-exclamation-circle me-1" />
                  Error
                </>
              ) : (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-1"
                    style={{ width: 10, height: 10, borderWidth: 2 }}
                    role="status"
                  />
                  Creating
                </>
              )}
            </span>
          </td>
          <td className="py-3 pe-3 text-end">
            {job.status === "error" && (
              <button
                onClick={() => removeJob(job.jobId)}
                className="ud-btn btn-white2 btn-sm fz12 fw600"
                style={{ padding: "8px 16px" }}
              >
                <i className="fas fa-times me-1" />
                Dismiss
              </button>
            )}
          </td>
        </tr>
      ))}
    </>
  );
}
