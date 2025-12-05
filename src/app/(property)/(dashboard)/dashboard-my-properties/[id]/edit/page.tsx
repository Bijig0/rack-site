"use client";

import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import Footer from "@/components/property/dashboard/Footer";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import EditPropertyTabContent from "@/components/property/dashboard/dashboard-edit-property";
import Link from "next/link";
import { use, useState } from "react";

const DashboardEditProperty = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [hasChanges, setHasChanges] = useState(false);

  const handleSaveChanges = async () => {
    // TODO: Implement save logic
    console.log("Saving changes for property:", id);
    setHasChanges(false);
  };

  return (
    <>
      {/* Main Header Nav */}
      <DashboardHeader />
      {/* End Main Header Nav */}

      {/* Mobile Nav  */}
      <MobileMenu />
      {/* End Mobile Nav  */}

      {/* dashboard_content_wrapper */}
      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr30 pr0-md">
          <SidebarDashboard />
          {/* End .dashboard__sidebar */}

          <div className="dashboard__main pl0-md">
            <div className="dashboard__content property-page bgc-f7">
              <div className="row pb40 d-block d-lg-none">
                <div className="col-lg-12">
                  <DboardMobileNavigation />
                </div>
              </div>
              {/* End .row */}

              <div className="row align-items-center pb40">
                <div className="col-lg-8">
                  <div className="dashboard_title_area">
                    <h2>Edit Property</h2>
                    <p className="text">
                      <Link href={`/dashboard-my-properties/${id}`} className="text-decoration-underline">
                        ← Back to Property Details
                      </Link>
                    </p>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="d-flex gap-2 justify-content-lg-end">
                    <button
                      className={`ud-btn ${hasChanges ? 'btn-dark' : 'btn-light'}`}
                      onClick={handleSaveChanges}
                      disabled={!hasChanges}
                      style={{
                        backgroundColor: hasChanges ? '#222' : '#e0e0e0',
                        color: hasChanges ? '#fff' : '#999',
                        cursor: hasChanges ? 'pointer' : 'not-allowed',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <i className="fas fa-save me-2"></i>Save Changes
                    </button>
                  </div>
                </div>
              </div>
              {/* End .row */}

              <div className="row">
                <div className="col-xl-12">
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 pt30 mb30 overflow-hidden position-relative">
                    <div className="navtab-style1">
                      <EditPropertyTabContent
                        propertyId={id}
                        onFieldChange={() => setHasChanges(true)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* End .row */}
            </div>
            {/* End dashboard__content */}

            <Footer />
          </div>
          {/* End .dashboard__main */}
        </div>
      </div>
      {/* dashboard_content_wrapper */}
    </>
  );
};

export default DashboardEditProperty;
