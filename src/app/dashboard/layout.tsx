import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import Footer from "@/components/property/dashboard/Footer";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import DashboardMainContent from "@/components/property/dashboard/DashboardMainContent";
import ScrollToTop from "@/components/common/ScrollToTop";
import { preloadDashboardData } from "@/lib/preload";
import { PropertyJobsProvider } from "@/context/PropertyJobsContext";
import { ReportJobsProvider } from "@/context/ReportJobsContext";
import { SidebarProvider } from "@/context/SidebarContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Preload data at layout level - warms the cache for child pages
  // This prefetches properties, property count, and appraisal reports
  preloadDashboardData();

  return (
    <PropertyJobsProvider>
      <ReportJobsProvider>
        <SidebarProvider>
        <ScrollToTop />
        <DashboardHeader />
        <MobileMenu />

        <div className="dashboard_content_wrapper">
          <div className="dashboard dashboard_wrapper pr30 pr0-xl">
            <SidebarDashboard />

            <DashboardMainContent>
              <div className="row pb40">
                <div className="col-lg-12">
                  <DboardMobileNavigation />
                </div>
              </div>

              {children}

              <Footer />
            </DashboardMainContent>
          </div>
        </div>
      </SidebarProvider>
      </ReportJobsProvider>
    </PropertyJobsProvider>
  );
}
