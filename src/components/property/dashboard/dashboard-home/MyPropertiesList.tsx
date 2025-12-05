import Link from "next/link";
import { getUserProperties } from "@/actions/properties";

const PlaceholderImage = () => (
  <div
    style={{
      width: 80,
      height: 60,
      backgroundColor: "#f0f0f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 4,
    }}
  >
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 21H21M5 21V7L12 3L19 7V21M9 21V13H15V21"
        stroke="#999"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const getStatusStyle = (status: string | null) => {
  switch (status) {
    case "pending":
      return "pending-style style1";
    case "completed":
      return "pending-style style2";
    case "processing":
      return "pending-style style3";
    case "failed":
      return "pending-style style4";
    default:
      return "pending-style style1";
  }
};

const getStatusLabel = (status: string | null) => {
  switch (status) {
    case "pending":
      return "Pending";
    case "completed":
      return "Completed";
    case "processing":
      return "Processing";
    case "failed":
      return "Failed";
    default:
      return "No Report";
  }
};

const MyPropertiesList = async () => {
  const properties = await getUserProperties();

  if (properties.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted mb-3">No properties yet</p>
        <Link href="/dashboard-add-property" className="ud-btn btn-thm">
          Add Your First Property
        </Link>
      </div>
    );
  }

  return (
    <div className="property-list-wrapper" style={{ maxHeight: "400px", overflowY: "auto" }}>
      {properties.map((property) => (
        <div
          key={property.id}
          className="d-flex align-items-center border-bottom pb-3 mb-3"
        >
          <div className="flex-shrink-0">
            <PlaceholderImage />
          </div>
          <div className="flex-grow-1 ms-3">
            <h6 className="mb-1">
              <Link href={`/dashboard-my-properties/${property.id}`} className="text-dark">
                {property.addressCommonName}
              </Link>
            </h6>
            <p className="mb-1 text-muted small">
              {[
                property.bedroomCount && `${property.bedroomCount} bed`,
                property.bathroomCount && `${property.bathroomCount} bath`,
                property.propertyType,
              ]
                .filter(Boolean)
                .join(" • ") || "Details pending"}
            </p>
            <span className={getStatusStyle(property.latestAppraisal?.status || null)}>
              {getStatusLabel(property.latestAppraisal?.status || null)}
            </span>
          </div>
          <div className="flex-shrink-0">
            <Link
              href={`/dashboard-my-properties/${property.id}`}
              className="btn btn-sm btn-outline-primary"
            >
              View
            </Link>
          </div>
        </div>
      ))}
      <div className="text-center mt-3">
        <Link href="/dashboard-my-properties" className="ud-btn btn-white2">
          View All Properties
          <i className="fal fa-arrow-right-long" />
        </Link>
      </div>
    </div>
  );
};

export default MyPropertiesList;
