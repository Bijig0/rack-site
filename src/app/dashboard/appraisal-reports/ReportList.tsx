"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteAppraisal } from "@/actions/appraisals";
import { usePropertyJobs } from "@/context/PropertyJobsContext";
import ConfirmModal from "@/components/common/ConfirmModal";

type Report = {
  id: string;
  propertyId: string;
  addressCommonName: string;
  bedroomCount: number | null;
  bathroomCount: number | null;
  propertyType: string | null;
  status: string;
  pdfUrl: string | null;
  createdAt: Date;
};

// Spinning loader component for generating state
function GeneratingSpinner({ size = 14 }: { size?: number }) {
  return (
    <span
      className="spinner-border spinner-border-sm"
      role="status"
      style={{ width: size, height: size, borderWidth: 2 }}
    >
      <span className="visually-hidden">Generating...</span>
    </span>
  );
}

function ReportCard({
  report,
  onDeleteClick,
}: {
  report: Report;
  onDeleteClick: (id: string, address: string) => void;
}) {
  const [isIdExpanded, setIsIdExpanded] = useState(false);

  const reportDate = new Date(report.createdAt).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const isGenerating =
    report.status === "pending" || report.status === "processing";

  return (
    <div className="col-sm-6 col-xl-4">
      <div
        className="ps-widget bgc-white bdrs12 p30 mb30 overflow-hidden position-relative"
        style={{
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          border: isGenerating ? "2px solid #3b82f6" : "none",
        }}
      >
        {/* Header with address and download button */}
        <div className="d-flex justify-content-between align-items-start mb20">
          <Link
            href={`/dashboard/my-properties/${report.propertyId}`}
            className="text-decoration-none flex-grow-1"
            prefetch={true}
          >
            <h5
              className="fw600 mb-0"
              style={{
                color: "#222",
                fontSize: 16,
                lineHeight: 1.4,
                paddingRight: 10,
              }}
            >
              {report.addressCommonName}
            </h5>
          </Link>

          {report.pdfUrl ? (
            <a
              href={report.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ud-btn btn-white2 btn-sm fz12 fw600 flex-shrink-0"
              style={{ padding: "8px 14px" }}
            >
              <i className="fas fa-download me-2" style={{ fontSize: 11 }} />
              Download
            </a>
          ) : (
            <span
              className="badge flex-shrink-0 fz12 d-inline-flex align-items-center gap-1"
              style={{
                backgroundColor: report.status === "processing" ? "#3b82f6" : "#f59e0b",
                color: "#fff",
                padding: "8px 12px",
              }}
            >
              <GeneratingSpinner size={10} />
              {report.status === "processing" ? "Generating..." : "Pending"}
            </span>
          )}
        </div>

        {/* Report ID */}
        <div className="mb10 fz13">
          <span style={{ color: "#888" }}>Report ID</span>
          <code
            className="ms-2"
            onClick={() => setIsIdExpanded(!isIdExpanded)}
            style={{
              fontSize: 11,
              backgroundColor: "#f5f5f5",
              padding: "2px 6px",
              borderRadius: 4,
              cursor: "pointer",
              userSelect: isIdExpanded ? "text" : "none",
              wordBreak: isIdExpanded ? "break-all" : "normal",
            }}
            title={isIdExpanded ? "Click to collapse" : "Click to expand"}
          >
            {isIdExpanded ? report.id : `${report.id.slice(0, 8)}...`}
          </code>
        </div>

        {/* Property Details label */}
        <div className="mb10 fz13 fw500" style={{ color: "#888" }}>
          Property Details
        </div>

        {/* Property Info */}
        <div className="d-flex flex-wrap gap-4 mb15 fz14">
          {report.bedroomCount && (
            <div>
              <span style={{ color: "#888" }}>Bedrooms</span>
              <span className="ms-2 fw500" style={{ color: "#222" }}>{report.bedroomCount}</span>
            </div>
          )}
          {report.bathroomCount && (
            <div>
              <span style={{ color: "#888" }}>Bathrooms</span>
              <span className="ms-2 fw500" style={{ color: "#222" }}>{report.bathroomCount}</span>
            </div>
          )}
          {report.propertyType && (
            <div>
              <span style={{ color: "#888" }}>Property Type</span>
              <span className="ms-2 fw500" style={{ color: "#222" }}>{report.propertyType}</span>
            </div>
          )}
        </div>

        {/* Report Creation Date or Generating Status */}
        <div className="fz14 mb15">
          {isGenerating ? (
            <div className="d-flex align-items-center gap-2">
              <GeneratingSpinner size={14} />
              <span
                style={{
                  color: "#3b82f6",
                  fontWeight: 500,
                }}
              >
                Report generating...
              </span>
            </div>
          ) : (
            <>
              <span style={{ color: "#888" }}>Report Creation Date</span>
              <span className="ms-3" style={{ color: "#222" }}>
                {reportDate}
              </span>
            </>
          )}
        </div>

        {/* Delete button */}
        {!isGenerating && (
          <div className="pt-2 border-top">
            <button
              onClick={() => onDeleteClick(report.id, report.addressCommonName)}
              className="btn btn-sm btn-outline-danger"
              style={{ padding: "4px 12px", fontSize: 12 }}
            >
              <i className="fas fa-trash-alt me-1"></i>
              Delete Report
            </button>
          </div>
        )}

        {/* Generating badge overlay */}
        {isGenerating && (
          <div
            className="position-absolute"
            style={{
              top: 10,
              left: 10,
              backgroundColor: "#3b82f6",
              color: "#fff",
              padding: "4px 10px",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              zIndex: 2,
            }}
          >
            <GeneratingSpinner size={10} /> <span className="ms-1">Generating</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface ReportListProps {
  reports: Report[];
}

export default function ReportList({ reports }: ReportListProps) {
  const router = useRouter();
  const { showToast } = usePropertyJobs();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<{ id: string; address: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredReports = reports.filter((report) =>
    report.addressCommonName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (id: string, address: string) => {
    setReportToDelete({ id, address });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!reportToDelete) return;

    setIsDeleting(true);
    const result = await deleteAppraisal(reportToDelete.id);
    setIsDeleting(false);

    if (result.success) {
      setDeleteModalOpen(false);
      showToast("success", "Appraisal report deleted successfully");
      setReportToDelete(null);
      router.refresh();
    } else {
      showToast("error", result.error || "Failed to delete appraisal");
    }
  };

  const handleCloseModal = () => {
    if (!isDeleting) {
      setDeleteModalOpen(false);
      setReportToDelete(null);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="row align-items-center pb30">
        <div className="col-lg-6">
          <div className="dashboard_title_area">
            <h2>Appraisal Reports</h2>
            <p className="text">View and download your rental appraisal reports</p>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="d-flex flex-wrap justify-content-lg-end gap-3">
            {/* Search input */}
            <div className="position-relative">
              <i
                className="fas fa-search position-absolute"
                style={{ left: 14, top: "50%", transform: "translateY(-50%)", color: "#888", fontSize: 14 }}
              />
              <input
                type="text"
                placeholder="Search by address..."
                className="form-control"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  paddingLeft: 40,
                  borderRadius: 8,
                  border: "1px solid #e0e0e0",
                  width: 220,
                  fontSize: 14,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="row">
        {filteredReports.length === 0 ? (
          <div className="col-12">
            <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 text-center">
              {searchQuery ? (
                <>
                  <i className="fas fa-search fz60 text-muted mb-4 d-block" />
                  <h4 className="mb-3">No reports found</h4>
                  <p className="text-muted mb-4">
                    No reports match &quot;{searchQuery}&quot;
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ud-btn btn-thm"
                  >
                    Clear Search
                  </button>
                </>
              ) : (
                <>
                  <i className="fas fa-file-alt fz60 text-muted mb-4 d-block" />
                  <h4 className="mb-3">No appraisal reports yet</h4>
                  <p className="text-muted mb-4">
                    Generate your first appraisal report from any property.
                  </p>
                  <Link href="/dashboard/my-properties" className="ud-btn btn-thm" prefetch={true}>
                    <i className="fal fa-home me-2" />
                    View Properties
                  </Link>
                </>
              )}
            </div>
          </div>
        ) : (
          filteredReports.map((report) => (
            <ReportCard key={report.id} report={report} onDeleteClick={handleDeleteClick} />
          ))
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Delete Appraisal Report"
        message={`Are you sure you want to delete the appraisal report for "${reportToDelete?.address || ''}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        variant="danger"
      />
    </>
  );
}
