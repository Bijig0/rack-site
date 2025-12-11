import { Suspense } from "react";
import { getUserAppraisalReports } from "@/actions/appraisals";
import { getUserProfile } from "@/actions/user";
import ReportList from "./ReportList";
import CompanyBrandingBanner from "./CompanyBrandingBanner";

export const metadata = {
  title: "Appraisal Reports | Dashboard",
};

// Skeleton for the appraisal reports page
function AppraisalReportsSkeleton() {
  return (
    <>
      {/* Banner skeleton */}
      <div className="skeleton-box mb30" style={{ width: "100%", height: 80, borderRadius: 12 }}></div>

      {/* Header skeleton */}
      <div className="row align-items-center pb30">
        <div className="col-lg-6">
          <div className="dashboard_title_area">
            <div className="skeleton-box mb-2" style={{ width: 200, height: 32 }}></div>
            <div className="skeleton-box" style={{ width: 280, height: 16 }}></div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="d-flex justify-content-lg-end">
            <div className="skeleton-box" style={{ width: 200, height: 38, borderRadius: 8 }}></div>
          </div>
        </div>
      </div>

      {/* Reports list skeleton */}
      <div className="row">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="col-sm-6 col-xl-4">
            <div
              className="ps-widget bgc-white bdrs12 p30 mb30 overflow-hidden"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
            >
              <div className="skeleton-box mb15" style={{ width: "90%", height: 20 }}></div>
              <div className="d-flex flex-wrap gap-3 mb15">
                <div className="skeleton-box" style={{ width: 70, height: 14 }}></div>
                <div className="skeleton-box" style={{ width: 70, height: 14 }}></div>
                <div className="skeleton-box" style={{ width: 80, height: 14 }}></div>
              </div>
              <div className="skeleton-box mb15" style={{ width: 140, height: 14 }}></div>
              <div className="skeleton-box" style={{ width: 100, height: 32, borderRadius: 6 }}></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// Async server component that fetches data
async function AppraisalReportsContent() {
  const [reports, profile] = await Promise.all([
    getUserAppraisalReports(),
    getUserProfile(),
  ]);

  return (
    <>
      {/* Company Branding Banner */}
      <CompanyBrandingBanner profile={profile} />

      {/* Reports List */}
      <ReportList reports={reports} />
    </>
  );
}

export default function AppraisalReportsPage() {
  return (
    <Suspense fallback={<AppraisalReportsSkeleton />}>
      <AppraisalReportsContent />
    </Suspense>
  );
}
