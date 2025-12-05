import { Suspense } from "react";
import Link from "next/link";
import { getUserProperties, getUserPropertyCount } from "@/actions/properties";

export const metadata = {
  title: "Dashboard | Homez",
};

// Revalidate every 30 seconds
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
          <div
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

// Favourites component
async function FavouritesList() {
  const properties = await getUserProperties();

  if (properties.length === 0) {
    return (
      <div className="text-center py-4">
        <i className="flaticon-like fz40 text-muted mb-3 d-block" />
        <p className="text-muted">No favourites yet</p>
      </div>
    );
  }

  // Show first 5 as "favourites" for now
  const favourites = properties.slice(0, 5);

  return (
    <>
      {favourites.map((property) => (
        <div
          key={property.id}
          className="recent-activity d-flex align-items-center mb20"
        >
          <div className="flex-shrink-0 me-3">
            <div
              style={{
                width: 60,
                height: 60,
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 4,
              }}
            >
              <i className="flaticon-home fz20 text-muted" />
            </div>
          </div>
          <div className="flex-grow-1">
            <h6 className="mb-1 fz14">
              <Link
                href={`/dashboard/my-properties/${property.id}`}
                className="text-dark"
                prefetch={true}
              >
                {property.addressCommonName.length > 30
                  ? `${property.addressCommonName.substring(0, 30)}...`
                  : property.addressCommonName}
              </Link>
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
            <i className="flaticon-like text-danger" />
          </div>
        </div>
      ))}
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
            <h4 className="title fz17 mb25">My Favourites</h4>
            <Suspense fallback={<PropertiesSkeleton />}>
              <FavouritesList />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
