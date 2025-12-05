"use client";

import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import Footer from "@/components/property/dashboard/Footer";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import Link from "next/link";
import { use, useState } from "react";
import { useRouter } from "next/navigation";

const GenerateReportPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/appraisals/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ propertyId: id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to generate report");
      }

      // Redirect back to property detail page
      router.push(`/dashboard-my-properties/${id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsGenerating(false);
    }
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
              </div>
              {/* End .row */}

              <div className="row align-items-center pb40">
                <div className="col-lg-12">
                  <div className="dashboard_title_area">
                    <h2>Generate New Report</h2>
                    <p className="text">
                      <Link href={`/dashboard-my-properties/${id}`} className="text-decoration-underline">
                        ← Back to Property
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
              {/* End .row */}

              <div className="row">
                <div className="col-xl-8">
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <h4 className="title fz17 mb30">Generate Appraisal Report</h4>

                    <p className="text mb20">
                      Click the button below to generate a new appraisal report for this property.
                      The report will analyze market data and comparable properties to provide
                      an estimated value range.
                    </p>

                    <div className="alert alert-info mb30">
                      <i className="fas fa-info-circle me-2"></i>
                      Report generation typically takes 1-2 minutes. You will be redirected
                      back to the property page once the report is ready.
                    </div>

                    {error && (
                      <div className="alert alert-danger mb30">
                        <i className="fas fa-exclamation-circle me-2"></i>
                        {error}
                      </div>
                    )}

                    <div className="d-flex gap-3">
                      <button
                        onClick={handleGenerateReport}
                        disabled={isGenerating}
                        className="ud-btn btn-thm"
                      >
                        {isGenerating ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Generating Report...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-file-alt me-2"></i>
                            Generate Report
                          </>
                        )}
                      </button>
                      <Link href={`/dashboard-my-properties/${id}`} className="ud-btn btn-white2">
                        Cancel
                      </Link>
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
    </>
  );
};

export default GenerateReportPage;
