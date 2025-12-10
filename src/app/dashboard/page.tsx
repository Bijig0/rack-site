import Link from "next/link";
import { getUserProperties, getUserPropertyCount } from "@/actions/properties";
import { getUserAppraisalReports } from "@/actions/appraisals";
import { getUserProfile } from "@/actions/user";
import {
  StatsBlock,
  PropertiesList,
  CompanyBrandingCard,
  AppraisalReportsList,
} from "./components/DashboardContent";

export const metadata = {
  title: "Dashboard | Homez",
};

// Fetch all data in parallel on the server
async function getDashboardData() {
  const [properties, propertyCount, reports, profile] = await Promise.all([
    getUserProperties(),
    getUserPropertyCount(),
    getUserAppraisalReports(),
    getUserProfile(),
  ]);

  return { properties, propertyCount, reports, profile };
}

export default async function DashboardPage() {
  const { properties, propertyCount, reports, profile } = await getDashboardData();

  return (
    <>
      <div className="row pb40">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2>Dashboard</h2>
            <p className="text">Welcome back!</p>
          </div>
        </div>
      </div>

      <div className="row">
        <StatsBlock propertyCount={propertyCount} />
      </div>

      <div className="row">
        <div className="col-xl-8">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h4 className="title fz17 mb-0">My Properties</h4>
              <Link href="/dashboard/add-property" className="ud-btn btn-thm btn-sm" prefetch={true}>
                <i className="fal fa-plus me-2" />
                Add Property
              </Link>
            </div>
            <PropertiesList properties={properties} />
          </div>
        </div>

        <div className="col-xl-4">
          {/* Company Branding Card */}
          <CompanyBrandingCard profile={profile} />

          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
            <div className="d-flex align-items-center justify-content-between mb25">
              <h4 className="title fz17 mb-0">Rental Appraisal Reports</h4>
              <Link
                href="/dashboard/appraisal-reports"
                className="fz12 text-decoration-none"
                style={{ color: "#666" }}
                prefetch={true}
              >
                View All
              </Link>
            </div>
            <AppraisalReportsList reports={reports} />
          </div>
        </div>
      </div>
    </>
  );
}
