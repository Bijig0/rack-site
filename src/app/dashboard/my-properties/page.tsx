import Link from "next/link";
import { getUserProperties, type PropertyWithAppraisal } from "@/actions/properties";
import { preloadPropertyDetails } from "@/lib/preload";
import PropertyList from "./PropertyList";

export const metadata = {
  title: "My Properties | Dashboard",
};

export default async function MyPropertiesPage() {
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
