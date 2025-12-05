import { Suspense } from "react";
import Link from "next/link";
import { getUserProperties, getPropertyById, getAllPropertyIds } from "@/actions/properties";

export const metadata = {
  title: "My Properties | Dashboard",
};

// Revalidate every 30 seconds
export const revalidate = 30;

// Prefetch all property detail pages when this page loads
async function prefetchPropertyPages() {
  const propertyIds = await getAllPropertyIds();
  // Trigger cache population for each property
  await Promise.all(propertyIds.map(id => getPropertyById(id)));
}

// Loading skeleton
function TableSkeleton() {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead>
          <tr className="text-uppercase fz12 fw600">
            <th className="py-3 ps-3 border-bottom text-muted" style={{ minWidth: 280 }}>Property</th>
            <th className="py-3 px-3 border-bottom text-muted" style={{ minWidth: 100 }}>Type</th>
            <th className="py-3 px-3 border-bottom text-muted text-center" style={{ minWidth: 100 }}>Beds / Baths</th>
            <th className="py-3 px-3 border-bottom text-muted text-center" style={{ minWidth: 120 }}>Status</th>
            <th className="py-3 pe-3 border-bottom text-muted text-end" style={{ minWidth: 140 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map((i) => (
            <tr key={i} className="border-bottom">
              <td className="py-3 ps-3">
                <div className="d-flex align-items-center">
                  <div className="skeleton-box" style={{ width: 56, height: 56, borderRadius: 10 }}></div>
                  <div className="ms-3">
                    <div className="skeleton-box mb-2" style={{ width: 180, height: 15 }}></div>
                    <div className="skeleton-box" style={{ width: 100, height: 13 }}></div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-3">
                <div className="skeleton-box" style={{ width: 70, height: 14 }}></div>
              </td>
              <td className="py-3 px-3 text-center">
                <div className="skeleton-box mx-auto" style={{ width: 50, height: 14 }}></div>
              </td>
              <td className="py-3 px-3 text-center">
                <div className="skeleton-box mx-auto rounded-pill" style={{ width: 90, height: 26 }}></div>
              </td>
              <td className="py-3 pe-3 text-end">
                <div className="d-inline-flex gap-2">
                  <div className="skeleton-box rounded-1" style={{ width: 60, height: 34 }}></div>
                  <div className="skeleton-box rounded-1" style={{ width: 60, height: 34 }}></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Property table component
async function PropertyTable() {
  // Fetch properties and prefetch detail pages in parallel
  const [properties] = await Promise.all([
    getUserProperties(),
    prefetchPropertyPages(),
  ]);

  if (properties.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="flaticon-home fz60 text-muted mb-4 d-block" />
        <h4 className="mb-3">No properties yet</h4>
        <p className="text-muted mb-4">
          Add your first property to start generating appraisal reports.
        </p>
        <Link href="/dashboard/add-property" className="ud-btn btn-thm">
          <i className="fal fa-plus me-2" />
          Add Property
        </Link>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead>
          <tr className="text-uppercase fz12 fw600">
            <th className="py-3 ps-3 border-bottom text-muted" style={{ minWidth: 280 }}>Property</th>
            <th className="py-3 px-3 border-bottom text-muted" style={{ minWidth: 100 }}>Type</th>
            <th className="py-3 px-3 border-bottom text-muted text-center" style={{ minWidth: 100 }}>Beds / Baths</th>
            <th className="py-3 px-3 border-bottom text-muted text-center" style={{ minWidth: 120 }}>Status</th>
            <th className="py-3 pe-3 border-bottom text-muted text-end" style={{ minWidth: 140 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property.id} className="border-bottom">
              <td className="py-3 ps-3">
                <div className="d-flex align-items-center">
                  <div
                    className="flex-shrink-0 d-flex align-items-center justify-content-center"
                    style={{
                      width: 56,
                      height: 56,
                      backgroundColor: "#f8f9fa",
                      borderRadius: 10,
                    }}
                  >
                    <i className="flaticon-home fz20" style={{ color: "#6c757d" }} />
                  </div>
                  <div className="ms-3">
                    <Link
                      href={`/dashboard/my-properties/${property.id}`}
                      className="fw600 fz15 text-dark text-decoration-none d-block mb-1"
                      style={{ lineHeight: 1.3 }}
                      prefetch={true}
                    >
                      {property.addressCommonName.length > 35
                        ? `${property.addressCommonName.substring(0, 35)}...`
                        : property.addressCommonName}
                    </Link>
                    <span className="fz13" style={{ color: "#8a8a8a" }}>
                      Added{" "}
                      {new Date(property.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </td>
              <td className="py-3 px-3">
                <span className="fz14" style={{ color: "#555" }}>
                  {property.propertyType || "—"}
                </span>
              </td>
              <td className="py-3 px-3 text-center">
                <span className="fz14" style={{ color: "#555" }}>
                  {property.bedroomCount || "—"} / {property.bathroomCount || "—"}
                </span>
              </td>
              <td className="py-3 px-3 text-center">
                <span
                  className="fz12 fw600 d-inline-block px-3 py-1 rounded-pill"
                  style={{
                    backgroundColor:
                      property.latestAppraisal?.status === "completed"
                        ? "#e8f5e9"
                        : property.latestAppraisal?.status === "processing"
                        ? "#e3f2fd"
                        : "#fff8e1",
                    color:
                      property.latestAppraisal?.status === "completed"
                        ? "#2e7d32"
                        : property.latestAppraisal?.status === "processing"
                        ? "#1565c0"
                        : "#f57c00",
                  }}
                >
                  {property.latestAppraisal?.status === "completed"
                    ? "Report Ready"
                    : property.latestAppraisal?.status === "processing"
                    ? "Processing"
                    : "Pending"}
                </span>
              </td>
              <td className="py-3 pe-3 text-end">
                <div className="d-inline-flex gap-2">
                  <Link
                    href={`/dashboard/my-properties/${property.id}`}
                    className="ud-btn btn-white2 btn-sm fz12 fw600"
                    style={{ padding: "8px 16px" }}
                    prefetch={true}
                  >
                    View
                  </Link>
                  {property.latestAppraisal?.pdfUrl && (
                    <a
                      href={property.latestAppraisal.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ud-btn btn-thm btn-sm fz12 fw600"
                      style={{ padding: "8px 16px" }}
                    >
                      <i className="fas fa-file-pdf fz10 me-1" />
                      PDF
                    </a>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MyPropertiesPage() {
  return (
    <>
      <div className="row align-items-center pb40">
        <div className="col-lg-8">
          <div className="dashboard_title_area">
            <h2>My Properties</h2>
            <p className="text">Manage your properties and appraisal reports</p>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="d-flex justify-content-lg-end">
            <Link href="/dashboard/add-property" className="ud-btn btn-thm">
              <i className="fal fa-plus me-2" />
              Add Property
            </Link>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
            <Suspense fallback={<TableSkeleton />}>
              <PropertyTable />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
