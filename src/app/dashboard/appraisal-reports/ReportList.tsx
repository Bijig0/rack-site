"use client";

import { useState } from "react";
import Link from "next/link";

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

function ReportCard({ report }: { report: Report }) {
  const reportDate = new Date(report.createdAt).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="col-sm-6 col-xl-4">
      <div
        className="ps-widget bgc-white bdrs12 p30 mb30 overflow-hidden position-relative"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
      >
        {/* Header with address and download button */}
        <div className="d-flex justify-content-between align-items-start mb20">
          <Link
            href={`/dashboard/my-properties/${report.propertyId}`}
            className="text-decoration-none flex-grow-1"
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
              className="badge flex-shrink-0 fz12"
              style={{
                backgroundColor: report.status === "processing" ? "#e3f2fd" : "#fff8e1",
                color: report.status === "processing" ? "#1565c0" : "#f57c00",
                padding: "8px 12px",
              }}
            >
              {report.status === "processing" ? "Processing" : "Pending"}
            </span>
          )}
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

        {/* Report Creation Date */}
        <div className="fz14">
          <span style={{ color: "#888" }}>Report Creation Date</span>
          <span className="ms-3" style={{ color: "#222" }}>
            {reportDate}
          </span>
        </div>
      </div>
    </div>
  );
}

interface ReportListProps {
  reports: Report[];
}

export default function ReportList({ reports }: ReportListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReports = reports.filter((report) =>
    report.addressCommonName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  <Link href="/dashboard/my-properties" className="ud-btn btn-thm">
                    <i className="fal fa-home me-2" />
                    View Properties
                  </Link>
                </>
              )}
            </div>
          </div>
        ) : (
          filteredReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))
        )}
      </div>
    </>
  );
}
