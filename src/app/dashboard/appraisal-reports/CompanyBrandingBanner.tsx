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
          className="d-flex align-items-center gap-3 p20 bdrs12 position-relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
            border: "1px solid #a5d6a7",
            boxShadow: "0 2px 10px rgba(76, 175, 80, 0.12)",
          }}
        >
          {/* Decorative dots */}
          <div
            className="position-absolute"
            style={{
              top: 8,
              right: 120,
              width: 5,
              height: 5,
              backgroundColor: "#66bb6a",
              borderRadius: "50%",
              opacity: 0.5,
            }}
          />
          <div
            className="position-absolute"
            style={{
              bottom: 10,
              right: 150,
              width: 4,
              height: 4,
              backgroundColor: "#81c784",
              borderRadius: "50%",
              opacity: 0.4,
            }}
          />

          <div
            className="position-relative flex-shrink-0"
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              overflow: "hidden",
              border: "2px solid #a5d6a7",
              backgroundColor: "#fff",
              boxShadow: "0 2px 6px rgba(76, 175, 80, 0.2)",
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
            <div className="d-flex align-items-center gap-2 mb-1">
              <p className="mb-0 fw600 fz14" style={{ color: "#2e7d32" }}>
                {profile.companyName}
              </p>
              <span
                style={{
                  backgroundColor: "#43a047",
                  color: "#fff",
                  fontSize: 9,
                  fontWeight: 600,
                  padding: "2px 6px",
                  borderRadius: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Active
              </span>
            </div>
            <p className="mb-0 fz12" style={{ color: "#388e3c" }}>
              <i className="fas fa-check-circle me-1" style={{ color: "#43a047" }} />
              Your branding will appear on all generated reports
            </p>
          </div>
          <Link
            href="/dashboard/branding"
            className="ud-btn btn-sm flex-shrink-0 d-flex align-items-center gap-1"
            style={{
              padding: "8px 16px",
              fontSize: 13,
              backgroundColor: "rgba(255,255,255,0.8)",
              color: "#388e3c",
              border: "1px solid #a5d6a7",
            }}
            prefetch={true}
          >
            <i className="fas fa-pen" style={{ fontSize: 10 }} />
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
