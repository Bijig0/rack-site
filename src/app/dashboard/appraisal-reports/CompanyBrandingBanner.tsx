"use client";

import Link from "next/link";
import Image from "next/image";
import type { UserProfile } from "@/actions/user";

interface CompanyBrandingBannerProps {
  profile: UserProfile | null;
}

export default function CompanyBrandingBanner({ profile }: CompanyBrandingBannerProps) {
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
            prefetch={true}
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
            prefetch={true}
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
          prefetch={true}
        >
          <i className="fas fa-plus me-2" />
          Set Up Branding
        </Link>
      </div>
    </div>
  );
}
