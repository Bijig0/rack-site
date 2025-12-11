"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useReportJobs } from "@/context/ReportJobsContext";
import { usePropertyJobs } from "@/context/PropertyJobsContext";
import { deleteAppraisal } from "@/actions/appraisals";
import ConfirmModal from "@/components/common/ConfirmModal";

interface Appraisal {
  id: string;
  status: string;
  pdfUrl: string | null;
  createdAt: Date;
}

interface AppraisalReportsTableProps {
  appraisals: Appraisal[];
  propertyId: string;
}

const formatDate = (date: Date | string) => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

function AppraisalRow({
  appraisal,
  onDeleteClick,
}: {
  appraisal: Appraisal;
  onDeleteClick: (id: string) => void;
}) {
  const [isIdExpanded, setIsIdExpanded] = useState(false);
  const isGenerating =
    appraisal.status === "pending" || appraisal.status === "processing";

  return (
    <tr
      style={{
        backgroundColor: isGenerating ? "rgba(59, 130, 246, 0.05)" : undefined,
      }}
    >
      <td>
        <code
          onClick={() => setIsIdExpanded(!isIdExpanded)}
          style={{
            fontSize: 12,
            backgroundColor: "#f5f5f5",
            padding: "2px 6px",
            borderRadius: 4,
            cursor: "pointer",
            userSelect: isIdExpanded ? "text" : "none",
            wordBreak: isIdExpanded ? "break-all" : "normal",
            display: "inline-block",
            maxWidth: isIdExpanded ? "100%" : "auto",
          }}
          title={isIdExpanded ? "Click to collapse" : "Click to expand"}
        >
          {isIdExpanded ? appraisal.id : `${appraisal.id.slice(0, 8)}...`}
        </code>
      </td>
      <td>{formatDate(appraisal.createdAt)}</td>
      <td>
        {isGenerating ? (
          <span
            className="badge d-inline-flex align-items-center gap-1"
            style={{
              backgroundColor:
                appraisal.status === "processing" ? "#3b82f6" : "#f59e0b",
              color: "#fff",
            }}
          >
            <span
              className="spinner-border spinner-border-sm"
              style={{
                width: 10,
                height: 10,
                borderWidth: 2,
              }}
            />
            {appraisal.status === "processing" ? "Generating..." : "Pending"}
          </span>
        ) : (
          <span
            className={`badge ${
              appraisal.status === "completed" ? "bg-success" : "bg-danger"
            }`}
          >
            {appraisal.status}
          </span>
        )}
      </td>
      <td>
        <div className="d-flex align-items-center gap-2">
          {appraisal.pdfUrl ? (
            <a
              href={appraisal.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline-primary"
            >
              <i className="fas fa-file-pdf me-1"></i> View PDF
            </a>
          ) : isGenerating ? (
            <span className="text-muted fz12">Report will be available soon</span>
          ) : null}

          {/* Delete button */}
          {!isGenerating && (
            <button
              onClick={() => onDeleteClick(appraisal.id)}
              className="btn btn-sm btn-outline-danger"
              title="Delete report"
              style={{ padding: "4px 8px" }}
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

// Row for a report job that's currently generating (from context)
function PendingReportRow({ progress, message }: { progress: number; message?: string }) {
  return (
    <tr style={{ backgroundColor: "rgba(59, 130, 246, 0.08)" }}>
      <td>
        <code
          style={{
            fontSize: 12,
            backgroundColor: "#dbeafe",
            padding: "2px 6px",
            borderRadius: 4,
            color: "#3b82f6",
          }}
        >
          generating...
        </code>
      </td>
      <td>{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</td>
      <td>
        <span
          className="badge d-inline-flex align-items-center gap-1"
          style={{ backgroundColor: "#3b82f6", color: "#fff" }}
        >
          <span
            className="spinner-border spinner-border-sm"
            style={{ width: 10, height: 10, borderWidth: 2 }}
          />
          {progress > 0 ? `${progress}%` : "Starting..."}
        </span>
      </td>
      <td>
        <span className="text-muted fz12">{message || "Report generation in progress..."}</span>
      </td>
    </tr>
  );
}

export default function AppraisalReportsTable({
  appraisals,
  propertyId,
}: AppraisalReportsTableProps) {
  const router = useRouter();
  const { getReportJobForProperty } = useReportJobs();
  const { showToast } = usePropertyJobs();
  const activeJob = getReportJobForProperty(propertyId);
  const isGeneratingFromContext = activeJob?.status === "pending" || activeJob?.status === "processing";

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [appraisalToDelete, setAppraisalToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if there's already a generating appraisal in the server data
  const hasGeneratingAppraisal = appraisals.some(
    (a) => a.status === "pending" || a.status === "processing"
  );

  // Show pending row from context only if there's no generating appraisal in server data
  const showPendingRow = isGeneratingFromContext && !hasGeneratingAppraisal;

  const handleDeleteClick = (appraisalId: string) => {
    setAppraisalToDelete(appraisalId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!appraisalToDelete) return;

    setIsDeleting(true);
    const result = await deleteAppraisal(appraisalToDelete);
    setIsDeleting(false);

    if (result.success) {
      setDeleteModalOpen(false);
      setAppraisalToDelete(null);
      showToast("success", "Appraisal report deleted successfully");
      router.refresh();
    } else {
      showToast("error", result.error || "Failed to delete appraisal");
    }
  };

  const handleCloseModal = () => {
    if (!isDeleting) {
      setDeleteModalOpen(false);
      setAppraisalToDelete(null);
    }
  };

  if (appraisals.length === 0 && !showPendingRow) {
    return <p className="text-muted">No appraisal reports generated yet.</p>;
  }

  return (
    <>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Date Generated</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Show pending row from context at the top */}
            {showPendingRow && (
              <PendingReportRow
                progress={activeJob?.progress || 0}
                message={activeJob?.message}
              />
            )}
            {appraisals.map((appraisal) => (
              <AppraisalRow
                key={appraisal.id}
                appraisal={appraisal}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Delete Appraisal Report"
        message="Are you sure you want to delete this appraisal report? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        variant="danger"
      />
    </>
  );
}
