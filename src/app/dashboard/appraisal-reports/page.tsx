import { Suspense } from "react";
import Link from "next/link";
import { getUserAppraisalReports } from "@/actions/appraisals";
import ReportList from "./ReportList";

export const metadata = {
  title: "Appraisal Reports | Dashboard",
};

export const dynamic = 'force-dynamic';

// Report card skeleton
function CardSkeleton() {
  return (
    <div className="col-sm-6 col-xl-4">
      <div
        className="ps-widget bgc-white bdrs12 p30 mb30 overflow-hidden position-relative"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
      >
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="skeleton-box" style={{ width: "70%", height: 20 }}></div>
          <div className="skeleton-box" style={{ width: 90, height: 34, borderRadius: 6 }}></div>
        </div>
        <div className="skeleton-box mb-2" style={{ width: "40%", height: 16 }}></div>
        <div className="d-flex gap-4 mb-3">
          <div className="skeleton-box" style={{ width: 100, height: 16 }}></div>
          <div className="skeleton-box" style={{ width: 100, height: 16 }}></div>
        </div>
        <div className="skeleton-box" style={{ width: "50%", height: 16 }}></div>
      </div>
    </div>
  );
}

function PageSkeleton() {
  return (
    <>
      {/* Header skeleton */}
      <div className="row align-items-center pb30">
        <div className="col-lg-6">
          <div className="dashboard_title_area">
            <div className="skeleton-box mb-2" style={{ width: 200, height: 32 }}></div>
            <div className="skeleton-box" style={{ width: 320, height: 16 }}></div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="d-flex flex-wrap justify-content-lg-end gap-3">
            <div className="skeleton-box" style={{ width: 220, height: 44, borderRadius: 8 }}></div>
          </div>
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="row">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}

// Error component
function ErrorMessage({ error }: { error: string }) {
  return (
    <>
      {/* Header */}
      <div className="row align-items-center pb30">
        <div className="col-lg-6">
          <div className="dashboard_title_area">
            <h2>Appraisal Reports</h2>
            <p className="text">View and download your rental appraisal reports</p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 text-center">
            <i className="fas fa-exclamation-triangle fz60 text-warning mb-4 d-block" />
            <h4 className="mb-3">Unable to load reports</h4>
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

// Report list with data
async function ReportListWithData() {
  try {
    const reports = await getUserAppraisalReports();
    return <ReportList reports={reports} />;
  } catch (error) {
    console.error("Error loading reports:", error);
    return <ErrorMessage error="Please try refreshing the page." />;
  }
}

export default function AppraisalReportsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ReportListWithData />
    </Suspense>
  );
}
