"use client";

import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import Pagination from "@/components/property/Pagination";
import Footer from "@/components/property/dashboard/Footer";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import FilterHeader from "../../../../components/property/dashboard/dashboard-my-properties/FilterHeader";
import PropertyDataTable from "@/components/property/dashboard/dashboard-my-properties/PropertyDataTable";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import AddPropertyModal from "@/components/property/dashboard/AddPropertyModal";
import { useState } from "react";

const DashboardMyProperties = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddPropertySuccess = () => {
    // Refresh the properties list
    // The modal will handle queryClient.invalidateQueries
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
        <div className="dashboard dashboard_wrapper pr30 pr0-xl">
          <SidebarDashboard />
          {/* End .dashboard__sidebar */}

          <div className="dashboard__main pl0-md">
            <div className="dashboard__content bgc-f7">
              <div className="row pb40">
                <div className="col-lg-12">
                  <DboardMobileNavigation />
                </div>
                {/* End .col-12 */}
              </div>
              {/* End .row */}

              <div className="row align-items-center pb40">
                <div className="col-xxl-3 col-xl-4 col-lg-5">
                  <div className="dashboard_title_area">
                    <h2>My Properties</h2>
                    <p className="text">We are glad to see you again!</p>
                  </div>
                </div>
                <div className="col-xxl-9 col-xl-8 col-lg-7">
                  <div className="d-flex flex-wrap gap-2 justify-content-lg-end align-items-center">
                    <button
                      className="ud-btn btn-dark"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <i className="fas fa-plus me-2"></i>Add New Property
                    </button>
                    <FilterHeader />
                  </div>
                </div>
              </div>
              {/* End .row */}

              <div className="row">
                <div className="col-xl-12">
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <div className="packages_table table-responsive">
                      <PropertyDataTable />

                      <div className="mt30">
                        <Pagination />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* End .row */}
            </div>
            {/* End .dashboard__content */}

            <Footer />
          </div>
          {/* End .dashboard__main */}
        </div>
      </div>
      {/* dashboard_content_wrapper */}

      {/* Add Property Modal */}
      <AddPropertyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddPropertySuccess}
      />
    </>
  );
};

export default DashboardMyProperties;
