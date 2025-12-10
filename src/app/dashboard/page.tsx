import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { getUserProperties, getUserPropertyCount } from "@/actions/properties";
import { getUserAppraisalReports } from "@/actions/appraisals";

export const metadata = {
  title: "Dashboard | Homez",
};

export const revalidate = 30;

// Loading skeleton for stats
function StatsSkeleton() {
  return (
    <div className="col-sm-6 col-xxl-3">
      <div className="d-flex justify-content-between statistics_funfact">
        <div className="details">
          <div className="text fz25">Total Properties</div>
          <div className="title skeleton-box" style={{ width: 40, height: 32 }}></div>
        </div>
        <div className="icon text-center">
          <i className="flaticon-home" />
        </div>
      </div>
    </div>
  );
}

// Loading skeleton for property list
function PropertiesSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="d-flex align-items-center p-3 bgc-white bdrs8 mb15">
          <div className="skeleton-box" style={{ width: 60, height: 60, borderRadius: 8 }}></div>
          <div className="ms-3 flex-grow-1">
            <div className="skeleton-box mb-2" style={{ width: "60%", height: 16 }}></div>
            <div className="skeleton-box" style={{ width: "40%", height: 12 }}></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Loading skeleton for reports
function ReportsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="d-flex align-items-center justify-content-between p-3 border-bottom">
          <div className="flex-grow-1">
            <div className="skeleton-box mb-2" style={{ width: "70%", height: 16 }}></div>
            <div className="d-flex gap-3 mb-2">
              <div className="skeleton-box" style={{ width: 80, height: 12 }}></div>
              <div className="skeleton-box" style={{ width: 80, height: 12 }}></div>
            </div>
            <div className="skeleton-box" style={{ width: "40%", height: 12 }}></div>
          </div>
          <div className="skeleton-box" style={{ width: 80, height: 32, borderRadius: 6 }}></div>
        </div>
      ))}
    </div>
  );
}

// Stats component with async data fetching
async function StatsBlock() {
  const propertyCount = await getUserPropertyCount();

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

// Properties list component with async data fetching
async function PropertiesList() {
  const properties = await getUserProperties();

  if (properties.length === 0) {
    return (
      <div className="text-center py-4">
        <i className="flaticon-home fz40 text-muted mb-3 d-block" />
        <p className="text-muted mb-3">No properties yet</p>
        <Link href="/dashboard/add-property" className="ud-btn btn-thm">
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

// Rental Appraisal Reports component
async function AppraisalReportsList() {
  const reports = await getUserAppraisalReports();

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

export default function DashboardPage() {
  return (
    <>
      <div className="row pb40">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2>Dashboard</h2>
            <p className="text">Welcome back!</p>
          </div>
        </div>
      </div>

      <div className="row">
        <Suspense fallback={<StatsSkeleton />}>
          <StatsBlock />
        </Suspense>
      </div>

      <div className="row">
        <div className="col-xl-8">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h4 className="title fz17 mb-0">My Properties</h4>
              <Link href="/dashboard/add-property" className="ud-btn btn-thm btn-sm">
                <i className="fal fa-plus me-2" />
                Add Property
              </Link>
            </div>
            <Suspense fallback={<PropertiesSkeleton />}>
              <PropertiesList />
            </Suspense>
          </div>
        </div>

        <div className="col-xl-4">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
            <div className="d-flex align-items-center justify-content-between mb25">
              <h4 className="title fz17 mb-0">Rental Appraisal Reports</h4>
              <Link
                href="/dashboard/appraisal-reports"
                className="fz12 text-decoration-none"
                style={{ color: "#666" }}
              >
                View All
              </Link>
            </div>
            <Suspense fallback={<ReportsSkeleton />}>
              <AppraisalReportsList />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
