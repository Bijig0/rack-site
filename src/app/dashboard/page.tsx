import { Suspense } from "react";
import Link from "next/link";
import {
  StatsBlockServer,
  PropertiesListServer,
  CompanyBrandingCardServer,
  AppraisalReportsListServer,
} from "./components/DashboardServerComponents";
import {
  StatsBlockSkeleton,
  PropertiesListSkeleton,
  CompanyBrandingCardSkeleton,
  AppraisalReportsListSkeleton,
} from "./components/DashboardSkeletons";

export const metadata = {
  title: "Dashboard | Homez",
};

export default function DashboardPage() {
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
        <Suspense fallback={<StatsBlockSkeleton />}>
          <StatsBlockServer />
        </Suspense>
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
            <Suspense fallback={<PropertiesListSkeleton />}>
              <PropertiesListServer />
            </Suspense>
          </div>
        </div>

        <div className="col-xl-4">
          {/* Company Branding Card */}
          <Suspense fallback={<CompanyBrandingCardSkeleton />}>
            <CompanyBrandingCardServer />
          </Suspense>

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
            <Suspense fallback={<AppraisalReportsListSkeleton />}>
              <AppraisalReportsListServer />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
