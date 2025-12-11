import { Suspense } from "react";
import Link from "next/link";
import { getUserProperties, type PropertyWithAppraisal } from "@/actions/properties";
import { preloadPropertyDetails } from "@/lib/preload";
import PropertyList from "./PropertyList";

export const metadata = {
  title: "My Properties | Dashboard",
};

// Skeleton for the property list (grid view)
function PropertyListSkeleton() {
  return (
    <>
      {/* Header with search and add button */}
      <div className="row align-items-center pb30">
        <div className="col-lg-6">
          <div className="dashboard_title_area">
            <h2>My Properties</h2>
            <p className="text">Manage your properties and appraisal reports</p>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="d-flex flex-wrap justify-content-lg-end gap-3">
            <div className="skeleton-box" style={{ width: 200, height: 38, borderRadius: 8 }}></div>
            <div className="skeleton-box" style={{ width: 140, height: 38, borderRadius: 8 }}></div>
          </div>
        </div>
      </div>

      {/* Property cards grid skeleton */}
      <div className="row">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="col-sm-6 col-xl-4">
            <div
              className="ps-widget bgc-white bdrs12 p30 mb30 overflow-hidden position-relative"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
            >
              {/* Thumbnail skeleton */}
              <div
                className="skeleton-box mb20"
                style={{ width: "100%", height: 140, borderRadius: 8 }}
              ></div>
              {/* Title skeleton */}
              <div className="skeleton-box mb15" style={{ width: "80%", height: 20 }}></div>
              {/* Property info skeleton */}
              <div className="d-flex flex-wrap gap-4 mb15">
                <div className="skeleton-box" style={{ width: 80, height: 14 }}></div>
                <div className="skeleton-box" style={{ width: 80, height: 14 }}></div>
                <div className="skeleton-box" style={{ width: 60, height: 14 }}></div>
              </div>
              {/* Last appraisal skeleton */}
              <div className="skeleton-box" style={{ width: 150, height: 14 }}></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// Async server component that fetches properties
async function PropertyListServer() {
  let properties: PropertyWithAppraisal[] | undefined;
  let error: string | null = null;

  try {
    properties = await getUserProperties();
    // Prefetch all property details in parallel (fire and forget for cache warming)
    preloadPropertyDetails(properties.map(p => p.id));
  } catch (e) {
    console.error("Error loading properties:", e);
    error = "Please try refreshing the page.";
  }

  if (error || !properties) {
    return (
      <>
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
              <Link href="/dashboard/add-property" className="ud-btn btn-thm">
                <i className="fal fa-plus me-2" />
                Add Property
              </Link>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 text-center">
              <i className="fas fa-exclamation-triangle fz60 text-warning mb-4 d-block" />
              <h4 className="mb-3">Unable to load properties</h4>
              <p className="text-muted mb-4">{error}</p>
              <Link href="/dashboard" className="ud-btn btn-thm">
                <i className="fal fa-arrow-left me-2" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return <PropertyList properties={properties} />;
}

export default function MyPropertiesPage() {
  return (
    <Suspense fallback={<PropertyListSkeleton />}>
      <PropertyListServer />
    </Suspense>
  );
}
