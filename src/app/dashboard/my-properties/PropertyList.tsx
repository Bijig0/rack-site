"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { PropertyWithAppraisal } from "@/actions/properties";
import { usePropertyJobs, type PendingJob } from "@/context/PropertyJobsContext";
import { useReportJobs } from "@/context/ReportJobsContext";

// Card hover styles
const cardStyles = `
  .property-card {
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .property-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(0,0,0,0.12) !important;
  }
  .property-card .thumbnail-wrapper {
    overflow: hidden;
    border-radius: 8px;
  }
  .property-card .thumbnail-wrapper img,
  .property-card .thumbnail-wrapper .placeholder-thumb {
    transition: transform 0.35s ease;
  }
  .property-card:hover .thumbnail-wrapper img,
  .property-card:hover .thumbnail-wrapper .placeholder-thumb {
    transform: scale(1.05);
  }
  .property-card .card-title {
    transition: color 0.2s ease;
  }
  .property-card:hover .card-title {
    color: #3b82f6 !important;
  }
`;

// Spinning loader component for generating state
function GeneratingSpinner() {
  return (
    <div
      className="spinner-border spinner-border-sm"
      role="status"
      style={{ width: 14, height: 14, borderWidth: 2 }}
    >
      <span className="visually-hidden">Generating...</span>
    </div>
  );
}

// Card for pending property creation jobs
function PendingPropertyCard({ job, onDismiss }: { job: PendingJob; onDismiss: () => void }) {
  const isError = job.status === "error";

  return (
    <div className="col-sm-6 col-xl-4">
      <div
        className="ps-widget bgc-white bdrs12 p30 mb30 overflow-hidden position-relative"
        style={{
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          border: isError ? "2px solid #ef4444" : "2px solid #3b82f6",
        }}
      >
        {/* Creating/Error badge overlay */}
        <div
          className="position-absolute"
          style={{
            top: 10,
            left: 10,
            backgroundColor: isError ? "#ef4444" : "#3b82f6",
            color: "#fff",
            padding: "4px 10px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            zIndex: 2,
          }}
        >
          {isError ? (
            <>
              <i className="fas fa-exclamation-triangle" /> <span className="ms-1">Error</span>
            </>
          ) : (
            <>
              <GeneratingSpinner /> <span className="ms-1">Creating</span>
            </>
          )}
        </div>

        {/* Dismiss button for errors */}
        {isError && (
          <button
            onClick={onDismiss}
            className="btn p-0 position-absolute"
            style={{ top: 10, right: 10, zIndex: 2 }}
            title="Dismiss"
          >
            <i className="fas fa-times" style={{ color: "#666" }} />
          </button>
        )}

        {/* Placeholder Thumbnail */}
        <div
          className="d-flex align-items-center justify-content-center mb20"
          style={{
            width: "100%",
            height: 140,
            borderRadius: 8,
            backgroundColor: isError ? "#fef2f2" : "#eff6ff",
          }}
        >
          {isError ? (
            <i className="fas fa-exclamation-circle" style={{ fontSize: 40, color: "#ef4444" }} />
          ) : (
            <div
              className="spinner-border"
              role="status"
              style={{ width: 40, height: 40, color: "#3b82f6" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
        </div>

        {/* Address */}
        <h5
          className="fw600 mb15"
          style={{
            color: "#222",
            fontSize: 16,
            lineHeight: 1.4,
          }}
        >
          {job.addressCommonName}
        </h5>

        {/* Status message */}
        <div className="fz14">
          <div className="d-flex align-items-center gap-2">
            {!isError && <GeneratingSpinner />}
            <span
              style={{
                color: isError ? "#ef4444" : "#3b82f6",
                fontWeight: 500,
              }}
            >
              {isError
                ? job.error || "Failed to create property"
                : job.status === "processing"
                ? "Fetching property data..."
                : "Starting property creation..."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropertyCard({ property, isGeneratingReport }: { property: PropertyWithAppraisal; isGeneratingReport: boolean }) {
  const lastAppraisalDate = property.latestAppraisal?.createdAt
    ? new Date(property.latestAppraisal.createdAt).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  // Check both server state AND context state for generating indicator
  const isGeneratingFromServer =
    property.latestAppraisal?.status === "pending" ||
    property.latestAppraisal?.status === "processing";

  const isGenerating = isGeneratingFromServer || isGeneratingReport;

  return (
    <div className="col-sm-6 col-xl-4">
      <div
        className="property-card ps-widget bgc-white bdrs12 p30 mb30 overflow-hidden position-relative"
        style={{
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          border: isGenerating ? "2px solid #3b82f6" : "none",
          cursor: "pointer",
        }}
      >
        {/* Three dots menu */}
        <div className="dropdown position-absolute" style={{ top: 16, right: 16, zIndex: 1 }}>
          <button
            className="btn p-0 three-dots-menu"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fas fa-ellipsis-v" />
          </button>
          <ul className="dropdown-menu dropdown-menu-end" style={{ border: "1px solid #e0e0e0", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <li>
              <Link className="dropdown-item fz14" href={`/dashboard/my-properties/${property.id}`}>
                <i className="fas fa-eye me-2" /> View Details
              </Link>
            </li>
            <li>
              <Link className="dropdown-item fz14" href={`/dashboard/my-properties/${property.id}/edit`}>
                <i className="fas fa-edit me-2" /> Edit Property
              </Link>
            </li>
            <li>
              <Link className="dropdown-item fz14" href={`/dashboard/my-properties/${property.id}/generate-report`}>
                <i className="fas fa-file-pdf me-2" /> Generate Report
              </Link>
            </li>
          </ul>
        </div>

        {/* Property Thumbnail */}
        <Link href={`/dashboard/my-properties/${property.id}`} className="d-block mb20">
          <div className="thumbnail-wrapper">
            {property.mainImageUrl ? (
              <Image
                src={property.mainImageUrl}
                alt={property.addressCommonName}
                width={400}
                height={140}
                className="property-thumbnail"
                style={{ objectFit: "cover", width: "100%", height: 140 }}
              />
            ) : (
              <div
                className="placeholder-thumb d-flex align-items-center justify-content-center"
                style={{
                  width: "100%",
                  height: 140,
                  backgroundColor: "#f5f5f5",
                }}
              >
                <i className="flaticon-home" style={{ fontSize: 40, color: "#ccc" }} />
              </div>
            )}
          </div>
        </Link>

        {/* Address */}
        <Link
          href={`/dashboard/my-properties/${property.id}`}
          className="text-decoration-none"
        >
          <h5
            className="card-title fw600 mb15"
            style={{
              color: "#222",
              fontSize: 16,
              lineHeight: 1.4,
            }}
          >
            {property.addressCommonName}
          </h5>
        </Link>

        {/* Property Info */}
        <div className="d-flex flex-wrap gap-4 mb15 fz14">
          {property.bedroomCount && (
            <div>
              <span style={{ color: "#888" }}>Bedrooms</span>
              <span className="ms-2 fw500" style={{ color: "#222" }}>{property.bedroomCount}</span>
            </div>
          )}
          {property.bathroomCount && (
            <div>
              <span style={{ color: "#888" }}>Bathrooms</span>
              <span className="ms-2 fw500" style={{ color: "#222" }}>{property.bathroomCount}</span>
            </div>
          )}
          {property.propertyType && (
            <div>
              <span style={{ color: "#888" }}>Type</span>
              <span className="ms-2 fw500" style={{ color: "#222" }}>{property.propertyType}</span>
            </div>
          )}
        </div>

        {/* Last Appraisal Date or Generating Status */}
        <div className="fz14">
          {isGenerating ? (
            <div className="d-flex align-items-center gap-2">
              <GeneratingSpinner />
              <span
                style={{
                  color: "#3b82f6",
                  fontWeight: 500,
                }}
              >
                Generating Report...
              </span>
            </div>
          ) : (
            <>
              <span style={{ color: "#888" }}>Last Appraisal</span>
              <span className="ms-3" style={{ color: "#222" }}>
                {lastAppraisalDate || "N/A"}
              </span>
            </>
          )}
        </div>

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
            <GeneratingSpinner /> <span className="ms-1">Generating</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface PropertyListProps {
  properties: PropertyWithAppraisal[];
}

export default function PropertyList({ properties }: PropertyListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { pendingJobs, removeJob, mergeWithOptimistic } = usePropertyJobs();
  const { isPropertyGeneratingReport } = useReportJobs();

  // Merge server properties with optimistic properties for immediate display
  const mergedProperties = mergeWithOptimistic(properties);

  // Get active pending jobs (pending, processing, or error)
  const activePendingJobs = pendingJobs.filter(
    (j) => j.status === "pending" || j.status === "processing" || j.status === "error"
  );

  const filteredProperties = mergedProperties.filter((property) =>
    property.addressCommonName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Also filter pending jobs by search
  const filteredPendingJobs = searchQuery
    ? activePendingJobs.filter((job) =>
        job.addressCommonName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : activePendingJobs;

  const hasContent = filteredProperties.length > 0 || filteredPendingJobs.length > 0;

  return (
    <>
      <style>{cardStyles}</style>
      {/* Header */}
      <div className="row align-items-center pb30">
        <div className="col-lg-6">
          <div className="dashboard_title_area">
            <h2>My Properties</h2>
            <p className="text">Manage your properties and appraisal reports</p>
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
                placeholder="Search..."
                className="form-control"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  paddingLeft: 40,
                  borderRadius: 8,
                  border: "1px solid #e0e0e0",
                  width: 200,
                  fontSize: 14,
                }}
              />
            </div>

            {/* Add Property button */}
            <Link href="/dashboard/add-property" className="ud-btn btn-thm">
              <i className="fal fa-plus me-2" />
              Add Property
            </Link>
          </div>
        </div>
      </div>

      {/* Property Cards Grid */}
      <div className="row">
        {/* Show pending property creation jobs first */}
        {filteredPendingJobs.map((job) => (
          <PendingPropertyCard
            key={job.jobId}
            job={job}
            onDismiss={() => removeJob(job.jobId)}
          />
        ))}

        {/* Show existing properties */}
        {filteredProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            isGeneratingReport={isPropertyGeneratingReport(property.id)}
          />
        ))}

        {/* Empty state - only show if no pending jobs AND no properties */}
        {!hasContent && (
          <div className="col-12">
            <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 text-center">
              {searchQuery ? (
                <>
                  <i className="fas fa-search fz60 text-muted mb-4 d-block" />
                  <h4 className="mb-3">No properties found</h4>
                  <p className="text-muted mb-4">
                    No properties match &quot;{searchQuery}&quot;
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
                  <i className="flaticon-home fz60 text-muted mb-4 d-block" />
                  <h4 className="mb-3">No properties yet</h4>
                  <p className="text-muted mb-4">
                    Add your first property to start generating appraisal reports.
                  </p>
                  <Link href="/dashboard/add-property" className="ud-btn btn-thm">
                    <i className="fal fa-plus me-2" />
                    Add Property
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
