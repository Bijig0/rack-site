"use client";

import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import Footer from "@/components/property/dashboard/Footer";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import Link from "next/link";
import { use } from "react";

// Property detail components from single-v1
import EnergyClass from "@/components/property/property-single-style/common/EnergyClass";
import FloorPlans from "@/components/property/property-single-style/common/FloorPlans";
import HomeValueChart from "@/components/property/property-single-style/common/HomeValueChart";
import OverView from "@/components/property/property-single-style/common/OverView";
import PropertyAddress from "@/components/property/property-single-style/common/PropertyAddress";
import PropertyDetails from "@/components/property/property-single-style/common/PropertyDetails";
import PropertyFeaturesAminites from "@/components/property/property-single-style/common/PropertyFeaturesAminites";
import PropertyHeader from "@/components/property/property-single-style/common/PropertyHeader";
import PropertyVideo from "@/components/property/property-single-style/common/PropertyVideo";
import ProperytyDescriptions from "@/components/property/property-single-style/common/ProperytyDescriptions";
import VirtualTour360 from "@/components/property/property-single-style/common/VirtualTour360";
import PropertyGallery from "@/components/property/property-single-style/single-v1/PropertyGallery";
import MortgageCalculator from "@/components/property/property-single-style/common/MortgageCalculator";
import WalkScore from "@/components/property/property-single-style/common/WalkScore";

const DashboardPropertyDetail = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

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
              </div>
              {/* End .row */}

              <div className="row align-items-center pb40">
                <div className="col-xxl-9">
                  <div className="dashboard_title_area">
                    <h2>Property Details</h2>
                    <p className="text">
                      <Link href="/dashboard-my-properties" className="text-decoration-underline">
                        ← Back to My Properties
                      </Link>
                    </p>
                  </div>
                </div>
                <div className="col-xxl-3">
                  <div className="d-flex gap-2 justify-content-xxl-end">
                    <Link href={`/dashboard-my-properties/${id}/edit`} className="ud-btn btn-dark">
                      <i className="fas fa-edit me-2"></i>Edit Details
                    </Link>
                  </div>
                </div>
              </div>
              {/* End .row */}

              {/* Property Header */}
              <div className="row mb30">
                <PropertyHeader id={id} />
              </div>
              {/* End .row */}

              {/* Property Gallery */}
              <div className="row mb30">
                <PropertyGallery id={id} />
              </div>
              {/* End .row */}

              <div className="row">
                <div className="col-xl-12">
                  {/* Overview */}
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <h4 className="title fz17 mb30">Overview</h4>
                    <div className="row">
                      <OverView />
                    </div>
                  </div>
                  {/* End .ps-widget */}

                  {/* Property Description */}
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <h4 className="title fz17 mb30">Property Description</h4>
                    <ProperytyDescriptions />

                    <h4 className="title fz17 mb30 mt50">Property Details</h4>
                    <div className="row">
                      <PropertyDetails />
                    </div>
                  </div>
                  {/* End .ps-widget */}

                  {/* Address */}
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <h4 className="title fz17 mb30 mt30">Address</h4>
                    <div className="row">
                      <PropertyAddress />
                    </div>
                  </div>
                  {/* End .ps-widget */}

                  {/* Features & Amenities */}
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <h4 className="title fz17 mb30">Features &amp; Amenities</h4>
                    <div className="row">
                      <PropertyFeaturesAminites />
                    </div>
                  </div>
                  {/* End .ps-widget */}

                  {/* Energy Class */}
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <h4 className="title fz17 mb30">Energy Class</h4>
                    <div className="row">
                      <EnergyClass />
                    </div>
                  </div>
                  {/* End .ps-widget */}

                  {/* Floor Plans */}
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <h4 className="title fz17 mb30">Floor Plans</h4>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="accordion-style1 style2">
                          <FloorPlans />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* End .ps-widget */}

                  {/* Video */}
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
                    <h4 className="title fz17 mb30">Video</h4>
                    <div className="row">
                      <PropertyVideo />
                    </div>
                  </div>
                  {/* End .ps-widget */}

                  {/* Virtual Tour */}
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <h4 className="title fz17 mb30">360° Virtual Tour</h4>
                    <div className="row">
                      <VirtualTour360 />
                    </div>
                  </div>
                  {/* End .ps-widget */}

                  {/* Walkscore */}
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <h4 className="title fz17 mb30">Walkscore</h4>
                    <div className="row">
                      <div className="col-md-12">
                        <h4 className="fw400 mb20">
                          10425 Tabor St Los Angeles CA 90034 USA
                        </h4>
                        <WalkScore />
                      </div>
                    </div>
                  </div>
                  {/* End .ps-widget */}

                  {/* Mortgage Calculator */}
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <h4 className="title fz17 mb30">Mortgage Calculator</h4>
                    <div className="row">
                      <MortgageCalculator />
                    </div>
                  </div>
                  {/* End .ps-widget */}

                  {/* Home Value */}
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <h4 className="title fz17 mb30">Home Value</h4>
                    <div className="row">
                      <HomeValueChart />
                    </div>
                  </div>
                  {/* End .ps-widget */}
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
    </>
  );
};

export default DashboardPropertyDetail;
