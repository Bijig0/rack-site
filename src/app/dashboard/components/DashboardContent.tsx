"use client";

import Link from "next/link";
import Image from "next/image";
import type { PropertyWithAppraisal } from "@/actions/properties";
import type { AppraisalReportData } from "@/actions/appraisals";
import type { UserProfile } from "@/actions/user";

// Stats Block Component
export function StatsBlock({ propertyCount }: { propertyCount: number }) {
  return (
    <div className="col-sm-6 col-xxl-3">
      <div className="d-flex justify-content-between statistics_funfact">
        <div className="details">
          <div className="text fz25">Total Properties</div>
          <div className="title">{propertyCount}</div>
        </div>
        <div className="icon text-center">
          <i className="flaticon-home" />
        </div>
      </div>
    </div>
  );
}

// Properties List Component
export function PropertiesList({ properties }: { properties: PropertyWithAppraisal[] }) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-4">
        <i className="flaticon-home fz40 text-muted mb-3 d-block" />
        <p className="text-muted mb-3">No properties yet</p>
        <Link href="/dashboard/add-property" className="ud-btn btn-thm" prefetch={true}>
          <i className="fal fa-plus me-2" />
          Add Your First Property
        </Link>
      </div>
    );
  }

  return (
    <>
      {properties.slice(0, 5).map((property) => (
        <Link
          key={property.id}
          href={`/dashboard/my-properties/${property.id}`}
          className="d-flex align-items-center p-3 bgc-white bdrs8 mb15 text-decoration-none hover-bg-light"
          prefetch={true}
        >
          {property.mainImageUrl ? (
            <div
              className="overflow-hidden flex-shrink-0"
              style={{ width: 60, height: 60, borderRadius: 8 }}
            >
              <Image
                src={property.mainImageUrl}
                alt={property.addressCommonName}
                width={60}
                height={60}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>
          ) : (
            <div
              className="flex-shrink-0"
              style={{
                width: 60,
                height: 60,
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
              }}
            >
              <i className="flaticon-home fz24 text-muted" />
            </div>
          )}
          <div className="ms-3 flex-grow-1">
            <h6 className="mb-1 fz14 text-dark">
              {property.addressCommonName.length > 35
                ? `${property.addressCommonName.substring(0, 35)}...`
                : property.addressCommonName}
            </h6>
            <p className="text-muted mb-0 fz12">
              {[
                property.bedroomCount && `${property.bedroomCount} bed`,
                property.bathroomCount && `${property.bathroomCount} bath`,
              ]
                .filter(Boolean)
                .join(" • ") || property.propertyType || "Property"}
            </p>
          </div>
          <div className="flex-shrink-0">
            <span
              className={`badge ${
                property.latestAppraisal?.status === "completed"
                  ? "bg-success"
                  : "bg-warning"
              }`}
            >
              {property.latestAppraisal?.status === "completed"
                ? "Report Ready"
                : "Pending"}
            </span>
          </div>
        </Link>
      ))}
      {properties.length > 5 && (
        <div className="text-center mt-3">
          <Link href="/dashboard/my-properties" className="ud-btn btn-white2" prefetch={true}>
            View All Properties ({properties.length})
            <i className="fal fa-arrow-right-long ms-2" />
          </Link>
        </div>
      )}
    </>
  );
}

// Company Branding Card Component
export function CompanyBrandingCard({ profile }: { profile: UserProfile | null }) {
  // If company branding is already set up, show a summary
  if (profile?.companyName || profile?.companyLogoUrl) {
    return (
      <div
        className="bdrs12 p30 mb30 overflow-hidden position-relative"
        style={{
          background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
          border: "1px solid #a5d6a7",
          boxShadow: "0 4px 15px rgba(76, 175, 80, 0.15)",
        }}
      >
        {/* Decorative sparkle elements */}
        <div
          className="position-absolute"
          style={{
            top: 12,
            right: 50,
            width: 6,
            height: 6,
            backgroundColor: "#66bb6a",
            borderRadius: "50%",
            opacity: 0.6,
          }}
        />
        <div
          className="position-absolute"
          style={{
            top: 24,
            right: 25,
            width: 4,
            height: 4,
            backgroundColor: "#81c784",
            borderRadius: "50%",
            opacity: 0.5,
          }}
        />
        <div
          className="position-absolute"
          style={{
            bottom: 20,
            right: 60,
            width: 5,
            height: 5,
            backgroundColor: "#4caf50",
            borderRadius: "50%",
            opacity: 0.4,
          }}
        />

        <div className="d-flex align-items-center justify-content-between mb15">
          <div className="d-flex align-items-center gap-2">
            <h4 className="title fz17 mb-0" style={{ color: "#2e7d32" }}>
              Company Branding
            </h4>
            <span
              style={{
                backgroundColor: "#43a047",
                color: "#fff",
                fontSize: 9,
                fontWeight: 600,
                padding: "2px 6px",
                borderRadius: 8,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Active
            </span>
          </div>
          <Link
            href="/dashboard/branding"
            className="fz12 text-decoration-none d-flex align-items-center gap-1"
            style={{ color: "#388e3c" }}
            prefetch={true}
          >
            <i className="fas fa-pen" style={{ fontSize: 10 }} />
            Edit
          </Link>
        </div>

        <div className="d-flex align-items-center gap-3">
          {profile.companyLogoUrl ? (
            <div
              className="position-relative flex-shrink-0"
              style={{
                width: 56,
                height: 56,
                borderRadius: 10,
                overflow: "hidden",
                border: "2px solid #a5d6a7",
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(76, 175, 80, 0.2)",
              }}
            >
              <Image
                src={profile.companyLogoUrl}
                alt="Company Logo"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          ) : (
            <div
              className="flex-shrink-0"
              style={{
                width: 56,
                height: 56,
                borderRadius: 10,
                background: "linear-gradient(135deg, #66bb6a 0%, #43a047 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(76, 175, 80, 0.3)",
              }}
            >
              <i className="fas fa-building fz20" style={{ color: "#fff" }} />
            </div>
          )}
          <div className="flex-grow-1">
            {profile.companyName && (
              <p className="mb-1 fw600 fz15" style={{ color: "#2e7d32" }}>
                {profile.companyName}
              </p>
            )}
            <p className="mb-0 fz12" style={{ color: "#388e3c" }}>
              <i className="fas fa-check-circle me-1" style={{ color: "#43a047" }} />
              Branding active on reports
            </p>
          </div>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <i className="fas fa-sparkles" style={{ color: "#43a047", fontSize: 14 }} />
          </div>
        </div>
      </div>
    );
  }

  // Show setup prompt if not configured
  return (
    <div
      className="ps-widget bdrs12 p30 mb30 overflow-hidden position-relative"
      style={{
        background: "linear-gradient(135deg, #1a1f3c 0%, #2d3561 100%)",
        color: "#fff",
      }}
    >
      <div className="d-flex align-items-start gap-3">
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "rgba(235,103,83,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <i className="fas fa-building" style={{ color: "#eb6753", fontSize: 20 }} />
        </div>
        <div className="flex-grow-1">
          <h5 className="fz16 mb-2" style={{ color: "#fff" }}>
            Add Your Company Branding
          </h5>
          <p className="fz13 mb-3" style={{ color: "rgba(255,255,255,0.7)" }}>
            Personalize your appraisal reports with your company logo and name for a professional touch.
          </p>
          <Link
            href="/dashboard/branding"
            className="ud-btn btn-white btn-sm"
            style={{ padding: "8px 16px", fontSize: 13 }}
            prefetch={true}
          >
            <i className="fas fa-plus me-2" />
            Set Up Branding
          </Link>
        </div>
      </div>
    </div>
  );
}

// Appraisal Reports List Component
export function AppraisalReportsList({ reports }: { reports: AppraisalReportData[] }) {
  if (reports.length === 0) {
    return (
      <div className="text-center py-4">
        <i className="fas fa-file-alt fz40 text-muted mb-3 d-block" />
        <p className="text-muted">No appraisal reports yet</p>
        <p className="text-muted fz12">Generate a report from any property to see it here</p>
      </div>
    );
  }

  // Show only the first 5 reports
  const displayReports = reports.slice(0, 5);

  return (
    <>
      {displayReports.map((report, index) => (
        <div
          key={report.id}
          className={`d-flex align-items-start justify-content-between py-3 ${
            index !== displayReports.length - 1 ? "border-bottom" : ""
          }`}
        >
          <div className="flex-grow-1">
            <Link
              href={`/dashboard/my-properties/${report.propertyId}`}
              className="fw600 fz14 text-dark text-decoration-none d-block mb-2"
              prefetch={true}
            >
              {report.addressCommonName}
            </Link>
            <div className="d-flex flex-wrap gap-3 mb-2" style={{ fontSize: 12, color: "#888" }}>
              {report.bedroomCount && (
                <span>Bedrooms <span className="text-dark fw500">{report.bedroomCount}</span></span>
              )}
              {report.bathroomCount && (
                <span>Bathrooms <span className="text-dark fw500">{report.bathroomCount}</span></span>
              )}
              {report.propertyType && (
                <span>Type <span className="text-dark fw500">{report.propertyType}</span></span>
              )}
            </div>
            <div style={{ fontSize: 12, color: "#888" }}>
              Report Creation Date{" "}
              <span className="text-dark">
                {new Date(report.createdAt).toLocaleDateString("en-AU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
          <div className="flex-shrink-0 ms-3">
            {report.pdfUrl ? (
              <a
                href={report.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-dark d-flex align-items-center gap-2"
                style={{ borderRadius: 6, fontSize: 12, padding: "6px 12px" }}
              >
                <i className="fas fa-download" style={{ fontSize: 10 }} />
                Download
              </a>
            ) : (
              <span
                className="badge"
                style={{
                  backgroundColor: report.status === "processing" ? "#e3f2fd" : "#fff8e1",
                  color: report.status === "processing" ? "#1565c0" : "#f57c00",
                  fontSize: 11,
                  padding: "6px 10px",
                }}
              >
                {report.status === "processing" ? "Processing" : "Pending"}
              </span>
            )}
          </div>
        </div>
      ))}
      {reports.length > 5 && (
        <div className="text-center mt-3">
          <Link href="/dashboard/appraisal-reports" className="ud-btn btn-white2 btn-sm" prefetch={true}>
            View All Reports ({reports.length})
            <i className="fal fa-arrow-right-long ms-2" />
          </Link>
        </div>
      )}
    </>
  );
}
