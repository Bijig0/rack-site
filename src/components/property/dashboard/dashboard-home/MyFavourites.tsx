import Link from "next/link";
import { getUserProperties } from "@/actions/properties";

const PlaceholderImage = () => (
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
    <svg
      width="24"
      height="24"
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

const MyFavourites = async () => {
  // For now, using the same properties - will be replaced with actual favourites later
  const properties = await getUserProperties();

  if (properties.length === 0) {
    return (
      <div className="text-center py-4">
        <i className="flaticon-like fz40 text-muted mb-3 d-block" />
        <p className="text-muted">No favourites yet</p>
      </div>
    );
  }

  // Show only first 5 as "favourites"
  const favourites = properties.slice(0, 5);

  return (
    <>
      {favourites.map((property) => (
        <div
          key={property.id}
          className="recent-activity d-flex align-items-center mb20"
        >
          <div className="flex-shrink-0 me-3">
            <PlaceholderImage />
          </div>
          <div className="flex-grow-1">
            <h6 className="mb-1 fz14">
              <Link href={`/dashboard-my-properties/${property.id}`} className="text-dark">
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
      <div className="d-grid">
        <Link href="/dashboard-my-favourites" className="ud-btn btn-white2">
          View All Favourites
          <i className="fal fa-arrow-right-long" />
        </Link>
      </div>
    </>
  );
};

export default MyFavourites;
