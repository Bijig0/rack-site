import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPropertyById } from "@/actions/properties";
import { getPropertyChecklists } from "@/actions/checklist";
import { getPropertyTags } from "@/actions/tags";
import DeletePropertyButton from "@/components/property/DeletePropertyButton";
import ChecklistManagement from "@/components/property/ChecklistManagement";
import PropertyTags from "@/components/property/PropertyTags";
import AppraisalReportsTable from "@/components/property/AppraisalReportsTable";


// Generate metadata
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getPropertyById(id);

  if (!data) {
    return { title: "Property Not Found" };
  }

  return {
    title: `${data.addressCommonName} | Dashboard`,
  };
}

const formatDate = (date: Date | string) => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const PlaceholderImage = ({ size = "large" }: { size?: "small" | "large" }) => {
  const dimensions = size === "large" ? { w: 400, h: 300 } : { w: 110, h: 94 };
  return (
    <div
      style={{
        width: dimensions.w,
        height: dimensions.h,
        backgroundColor: "#f0f0f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
      }}
    >
      <svg
        width={size === "large" ? 80 : 48}
        height={size === "large" ? 80 : 48}
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
};

// Skeleton for the property detail page
function PropertyDetailSkeleton() {
  return (
    <>
      {/* Header skeleton */}
      <div className="row align-items-center pb40">
        <div className="col-xxl-9">
          <div className="dashboard_title_area">
            <h2>Property Details</h2>
            <p className="text">
              <Link href="/dashboard/my-properties" className="text-decoration-underline" prefetch={true}>
                ← Back to My Properties
              </Link>
            </p>
          </div>
        </div>
        <div className="col-xxl-3">
          <div className="d-flex gap-2 justify-content-xxl-end">
            <div className="skeleton-box" style={{ width: 130, height: 44, borderRadius: 8 }}></div>
          </div>
        </div>
      </div>

      {/* Property header skeleton */}
      <div className="row mb30">
        <div className="col-lg-8">
          <div className="single-property-content mb30-md">
            <div className="skeleton-box mb15" style={{ width: "80%", height: 32 }}></div>
            <div className="d-flex gap-3 mb15">
              <div className="skeleton-box" style={{ width: 80, height: 20 }}></div>
              <div className="skeleton-box" style={{ width: 100, height: 20 }}></div>
              <div className="skeleton-box" style={{ width: 120, height: 20 }}></div>
            </div>
            <div className="d-flex gap-3">
              <div className="skeleton-box" style={{ width: 60, height: 18 }}></div>
              <div className="skeleton-box" style={{ width: 60, height: 18 }}></div>
              <div className="skeleton-box" style={{ width: 80, height: 18 }}></div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="d-flex gap-2 justify-content-lg-end">
            <div className="skeleton-box" style={{ width: 120, height: 44, borderRadius: 8 }}></div>
            <div className="skeleton-box" style={{ width: 120, height: 44, borderRadius: 8 }}></div>
          </div>
        </div>
      </div>

      {/* Images skeleton */}
      <div className="row mb30">
        <div className="col-12">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 overflow-hidden position-relative">
            <div className="row">
              <div className="col-md-8">
                <div className="skeleton-box" style={{ width: "100%", height: 400, borderRadius: 12 }}></div>
              </div>
              <div className="col-md-4">
                <div className="row g-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="col-6">
                      <div className="skeleton-box" style={{ width: "100%", height: 120, borderRadius: 8 }}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview skeleton */}
      <div className="row">
        <div className="col-xl-12">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
            <div className="skeleton-box mb30" style={{ width: 100, height: 24 }}></div>
            <div className="row">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="col-sm-6 col-lg-3">
                  <div className="d-flex align-items-center mb25">
                    <div className="skeleton-box me-3" style={{ width: 40, height: 40, borderRadius: 8 }}></div>
                    <div>
                      <div className="skeleton-box mb-2" style={{ width: 70, height: 12 }}></div>
                      <div className="skeleton-box" style={{ width: 40, height: 18 }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Async server component that fetches property data
async function PropertyDetailContent({ id }: { id: string }) {
  const data = await getPropertyById(id);

  if (!data) {
    notFound();
  }

  const { appraisals, images, ...property } = data;

  // Organize images by type
  const mainImage = images?.find((img) => img.type === "main");
  const galleryImages = images?.filter((img) => img.type === "gallery") || [];
  const floorPlanImages = images?.filter((img) => img.type === "floor_plan") || [];
  const streetviewImages = images?.filter((img) => img.type === "streetview") || [];
  const additionalImages = [...galleryImages, ...floorPlanImages, ...streetviewImages];

  // Fetch checklists - wrap in try/catch in case tables don't exist yet
  let initialChecklists = [];
  try {
    initialChecklists = await getPropertyChecklists(id);
  } catch (error) {
    console.log('Checklist tables may not exist yet:', error);
  }

  // Fetch tags
  let initialTags = [];
  try {
    initialTags = await getPropertyTags(id);
  } catch (error) {
    console.log('Tags table may not exist yet:', error);
  }

  const latestAppraisal = appraisals[0];

  return (
    <>
      <div className="row align-items-center pb40">
        <div className="col-xxl-9">
          <div className="dashboard_title_area">
            <h2>Property Details</h2>
            <p className="text">
              <Link
                href="/dashboard/my-properties"
                className="text-decoration-underline"
                prefetch={true}
              >
                ← Back to My Properties
              </Link>
            </p>
          </div>
        </div>
        <div className="col-xxl-3">
          <div className="d-flex gap-2 justify-content-xxl-end">
            <Link
              href={`/dashboard/my-properties/${id}/edit`}
              className="ud-btn btn-dark"
              prefetch={true}
            >
              <i className="fas fa-edit me-2"></i>Edit Details
            </Link>
          </div>
        </div>
      </div>

      {/* Property Header */}
      <div className="row mb30">
        <div className="col-lg-8">
          <div className="single-property-content mb30-md">
            <h2 className="sp-lg-title">{property.addressCommonName}</h2>
            <div className="pd-meta mb15 d-md-flex align-items-center">
              {property.propertyType && (
                <p className="text fz15 mb-0 bdrr1 pr10 bdrrn-sm">
                  {property.propertyType}
                </p>
              )}
              <span
                className="ff-heading fz15 bdrr1 pr10 ml0-sm ml10 bdrrn-sm d-inline-flex align-items-center"
                style={{
                  color:
                    latestAppraisal?.status === "completed"
                      ? "#22c55e"
                      : latestAppraisal?.status === "processing" ||
                        latestAppraisal?.status === "pending"
                      ? "#3b82f6"
                      : "#888",
                }}
              >
                {(latestAppraisal?.status === "processing" ||
                  latestAppraisal?.status === "pending") && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    style={{ width: 12, height: 12, borderWidth: 2 }}
                  />
                )}
                {latestAppraisal?.status !== "processing" &&
                  latestAppraisal?.status !== "pending" && (
                    <i className="fas fa-circle fz10 pe-2" />
                  )}
                {latestAppraisal?.status === "completed"
                  ? "Report Ready"
                  : latestAppraisal?.status === "processing"
                  ? "Generating Report..."
                  : latestAppraisal?.status === "pending"
                  ? "Report Pending"
                  : "No Report"}
              </span>
              <span className="ff-heading fz15 ml10 ml0-sm">
                <i className="far fa-clock pe-2" />
                Added {formatDate(property.createdAt)}
              </span>
            </div>
            <div className="property-meta d-flex align-items-center mb15">
              {property.bedroomCount && (
                <span className="text fz15">
                  <i className="flaticon-bed pe-2 align-text-top" />
                  {property.bedroomCount} bed
                </span>
              )}
              {property.bathroomCount && (
                <span className="text ml20 fz15">
                  <i className="flaticon-shower pe-2 align-text-top" />
                  {property.bathroomCount} bath
                </span>
              )}
              {property.landAreaSqm && (
                <span className="text ml20 fz15">
                  <i className="flaticon-expand pe-2 align-text-top" />
                  {property.landAreaSqm} sqm
                </span>
              )}
            </div>
            {/* Property Tags */}
            <div className="property-tags">
              <PropertyTags propertyId={id} initialTags={initialTags} />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="single-property-content">
            <div className="property-action text-lg-end">
              <div className="d-flex mb20 mb10-md align-items-center justify-content-lg-end">
                <span className="icon mr10">
                  <span className="flaticon-share-1" />
                </span>
                <span className="icon">
                  <span className="flaticon-printer" />
                </span>
              </div>
              <div className="d-flex gap-2 justify-content-lg-end">
                {latestAppraisal?.pdfUrl && (
                  <a
                    href={latestAppraisal.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ud-btn btn-thm"
                  >
                    <i className="fas fa-file-pdf me-2"></i>View Report
                  </a>
                )}
                <Link
                  href={`/dashboard/my-properties/${id}/generate-report`}
                  className="ud-btn btn-dark"
                  prefetch={true}
                >
                  <i className="fas fa-plus me-2"></i>New Report
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Images */}
      <div className="row mb30">
        <div className="col-12">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 overflow-hidden position-relative">
            <div className="row">
              <div className="col-md-8">
                {mainImage ? (
                  <Image
                    src={mainImage.url}
                    alt={property.addressCommonName}
                    width={800}
                    height={500}
                    className="w-100 bdrs12"
                    style={{ objectFit: "cover", maxHeight: 500 }}
                    priority
                  />
                ) : (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: 300 }}
                  >
                    <PlaceholderImage size="large" />
                  </div>
                )}
              </div>
              <div className="col-md-4">
                <div className="row g-2">
                  {additionalImages.length > 0 ? (
                    additionalImages.slice(0, 4).map((img, index) => (
                      <div key={img.id || index} className="col-6">
                        <div className="position-relative">
                          <Image
                            src={img.url}
                            alt={`Property photo ${index + 1}`}
                            width={200}
                            height={150}
                            className="bdrs8 w-100"
                            style={{ objectFit: "cover", height: 120 }}
                          />
                          {/* Type badge */}
                          <span
                            className="position-absolute badge"
                            style={{
                              top: 5,
                              left: 5,
                              fontSize: 9,
                              backgroundColor:
                                img.type === "floor_plan"
                                  ? "#9333ea"
                                  : img.type === "streetview"
                                  ? "#0891b2"
                                  : "#6b7280",
                              color: "#fff",
                            }}
                          >
                            {img.type === "floor_plan"
                              ? "Floor Plan"
                              : img.type === "streetview"
                              ? "Street View"
                              : "Gallery"}
                          </span>
                          {/* Show +N indicator on last image if there are more */}
                          {index === 3 && additionalImages.length > 4 && (
                            <div
                              className="position-absolute top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center"
                              style={{
                                background: "rgba(0,0,0,0.5)",
                                borderRadius: 8,
                              }}
                            >
                              <span className="text-white fw600 fz18">
                                +{additionalImages.length - 4}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    // Show placeholders if no additional images
                    [1, 2, 3, 4].map((i) => (
                      <div key={i} className="col-6">
                        <PlaceholderImage size="small" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            {/* Image count info */}
            {images && images.length > 0 && (
              <div className="mt-3 text-muted fz13">
                <i className="fas fa-images me-1" />
                {images.length} photo{images.length !== 1 ? "s" : ""} uploaded
                {floorPlanImages.length > 0 && (
                  <span className="ms-2">
                    • {floorPlanImages.length} floor plan
                    {floorPlanImages.length !== 1 ? "s" : ""}
                  </span>
                )}
                {streetviewImages.length > 0 && (
                  <span className="ms-2">
                    • {streetviewImages.length} street view
                    {streetviewImages.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-12">
          {/* Overview */}
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
            <h4 className="title fz17 mb30">Overview</h4>
            <div className="row">
              <div className="col-sm-6 col-lg-3">
                <div className="overview-element mb25 d-flex align-items-center">
                  <span className="icon mr15 flaticon-bed" />
                  <div className="details">
                    <p className="text mb-0">Bedrooms</p>
                    <h6 className="mb-0">{property.bedroomCount || "—"}</h6>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="overview-element mb25 d-flex align-items-center">
                  <span className="icon mr15 flaticon-shower" />
                  <div className="details">
                    <p className="text mb-0">Bathrooms</p>
                    <h6 className="mb-0">{property.bathroomCount || "—"}</h6>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="overview-element mb25 d-flex align-items-center">
                  <span className="icon mr15 flaticon-home-1" />
                  <div className="details">
                    <p className="text mb-0">Property Type</p>
                    <h6 className="mb-0">{property.propertyType || "—"}</h6>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="overview-element mb25 d-flex align-items-center">
                  <span className="icon mr15 flaticon-expand" />
                  <div className="details">
                    <p className="text mb-0">Land Area</p>
                    <h6 className="mb-0">
                      {property.landAreaSqm ? `${property.landAreaSqm} sqm` : "—"}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Appraisal Reports */}
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
            <h4 className="title fz17 mb30">Appraisal Reports</h4>
            <AppraisalReportsTable appraisals={appraisals} propertyId={id} />
          </div>

          {/* Checklist Management */}
          <ChecklistManagement
            propertyId={id}
            initialGroups={initialChecklists}
          />

          {/* Danger Zone */}
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
            <h4 className="title fz17 mb20 text-danger">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Danger Zone
            </h4>
            <p className="text-muted mb20">
              Once you delete a property, there is no going back. All associated
              appraisal reports will also be permanently deleted.
            </p>
            <DeletePropertyButton
              propertyId={id}
              propertyName={property.addressCommonName}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<PropertyDetailSkeleton />}>
      <PropertyDetailContent id={id} />
    </Suspense>
  );
}
