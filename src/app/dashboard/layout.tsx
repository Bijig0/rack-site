import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import Footer from "@/components/property/dashboard/Footer";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import { getUserProperties, getUserPropertyCount } from "@/actions/properties";

// Preload data at layout level for immediate availability
function preloadData() {
  void getUserProperties();
  void getUserPropertyCount();
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Start preloading immediately when layout renders
  preloadData();

  return (
    <>
      <DashboardHeader />
      <MobileMenu />

      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr30 pr0-xl">
          <SidebarDashboard />

          <div className="dashboard__main pl0-md">
            <div className="dashboard__content bgc-f7">
              <div className="row pb40">
                <div className="col-lg-12">
                  <DboardMobileNavigation />
                </div>
              </div>

              {children}
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
