import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { getUserAppraisalReports } from "@/actions/appraisals";
import { getUserProfile } from "@/actions/user";
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

// Skeleton for branding banner
function BrandingBannerSkeleton() {
  return (
    <div className="mb30">
      <div
        className="d-flex align-items-center gap-3 p20 bgc-white bdrs12"
        style={{ border: "1px solid #e0e0e0" }}
      >
        <div className="skeleton-box flex-shrink-0" style={{ width: 48, height: 48, borderRadius: 8 }}></div>
        <div className="flex-grow-1">
          <div className="skeleton-box mb-2" style={{ width: "50%", height: 16 }}></div>
          <div className="skeleton-box" style={{ width: "70%", height: 12 }}></div>
        </div>
        <div className="skeleton-box flex-shrink-0" style={{ width: 80, height: 36, borderRadius: 6 }}></div>
      </div>
    </div>
  );
}

// Company Branding Banner - urges user to add branding if not set
async function CompanyBrandingBanner() {
  const profile = await getUserProfile();

  // If branding is complete, show a small confirmation
  if (profile?.companyName && profile?.companyLogoUrl) {
    return (
      <div className="mb30">
        <div
          className="d-flex align-items-center gap-3 p20 bgc-white bdrs12"
          style={{ border: "1px solid #e8f5e9" }}
        >
          <div
            className="position-relative flex-shrink-0"
            style={{
              width: 48,
              height: 48,
              borderRadius: 8,
              overflow: "hidden",
              border: "1px solid #e0e0e0",
              backgroundColor: "#fff",
            }}
          >
            <Image
              src={profile.companyLogoUrl}
              alt="Company Logo"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="flex-grow-1">
            <p className="mb-0 fw500 fz14">{profile.companyName}</p>
            <p className="mb-0 fz12 text-muted">
              <i className="fas fa-check-circle text-success me-1" />
              Your branding will appear on all generated reports
            </p>
          </div>
          <Link
            href="/dashboard/branding"
            className="ud-btn btn-white2 btn-sm flex-shrink-0"
            style={{ padding: "8px 16px", fontSize: 13 }}
          >
            <i className="fas fa-edit me-2" />
            Edit
          </Link>
        </div>
      </div>
    );
  }

  // If partially set up, show a prompt to complete
  if (profile?.companyName || profile?.companyLogoUrl) {
    return (
      <div className="mb30">
        <div
          className="d-flex align-items-center gap-3 p20 bdrs12"
          style={{
            background: "linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)",
            border: "1px solid #ffe082",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "rgba(255,152,0,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <i className="fas fa-exclamation-circle" style={{ color: "#f57c00", fontSize: 20 }} />
          </div>
          <div className="flex-grow-1">
            <p className="mb-1 fw600 fz14" style={{ color: "#e65100" }}>
              Complete Your Company Branding
            </p>
            <p className="mb-0 fz13" style={{ color: "#795548" }}>
              {!profile?.companyLogoUrl
                ? "Add your company logo to make your reports look more professional."
                : "Add your company name to complete your branding setup."}
            </p>
          </div>
          <Link
            href="/dashboard/branding"
            className="ud-btn btn-thm btn-sm flex-shrink-0"
            style={{ padding: "8px 16px", fontSize: 13 }}
          >
            <i className="fas fa-plus me-2" />
            Complete Setup
          </Link>
        </div>
      </div>
    );
  }

  // Not set up at all - show prominent CTA
  return (
    <div className="mb30">
      <div
        className="d-flex align-items-center gap-3 p25 bdrs12"
        style={{
          background: "linear-gradient(135deg, #1a1f3c 0%, #2d3561 100%)",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: "rgba(235,103,83,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <i className="fas fa-building" style={{ color: "#eb6753", fontSize: 24 }} />
        </div>
        <div className="flex-grow-1">
          <h5 className="mb-1 fz16" style={{ color: "#fff" }}>
            Add Your Company Branding
          </h5>
          <p className="mb-0 fz13" style={{ color: "rgba(255,255,255,0.7)" }}>
            Your company logo and name will appear on all generated rental appraisal PDFs for a professional look.
          </p>
        </div>
        <Link
          href="/dashboard/branding"
          className="ud-btn btn-white btn-sm flex-shrink-0"
          style={{ padding: "10px 20px", fontSize: 13 }}
        >
          <i className="fas fa-plus me-2" />
          Set Up Branding
        </Link>
      </div>
    </div>
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
    <>
      {/* Company Branding Banner */}
      <Suspense fallback={<BrandingBannerSkeleton />}>
        <CompanyBrandingBanner />
      </Suspense>

      {/* Reports List */}
      <Suspense fallback={<PageSkeleton />}>
        <ReportListWithData />
      </Suspense>
    </>
  );
}
