"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useTransition, useRef } from "react";
import {
  getUserProfile,
  updateCompanyName,
  type UserProfile,
} from "@/actions/user";
import { CoverPagePreview } from "@/components/branding/CoverPagePreview";

export default function BrandingPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Form states
  const [companyName, setCompanyName] = useState("");

  // Logo upload states
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Feedback states
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [logoLoadError, setLogoLoadError] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const data = await getUserProfile();
      if (data) {
        setProfile(data);
        setCompanyName(data.companyName || "");
      }
      setIsLoading(false);
    }
    loadProfile();
  }, []);

  const handleCompanyNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await updateCompanyName(companyName || null);
      if (result.success) {
        setMessage({ type: "success", text: "Company name updated successfully" });
        setProfile((prev) => prev ? { ...prev, companyName: companyName || null } : null);
      } else {
        setMessage({ type: "error", text: result.error || "Failed to update company name" });
      }
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/user/company-logo", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Logo uploaded successfully" });
        setLogoLoadError(false); // Reset error state for new logo
        setProfile((prev) => prev ? { ...prev, companyLogoUrl: data.payload.url } : null);
      } else {
        setMessage({ type: "error", text: data.message || "Failed to upload logo" });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to upload logo" });
    } finally {
      setIsUploadingLogo(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleLogoDelete = async () => {
    if (!confirm("Are you sure you want to delete your company logo?")) return;

    setIsUploadingLogo(true);
    setMessage(null);

    try {
      const response = await fetch("/api/user/company-logo", {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Logo deleted successfully" });
        setProfile((prev) => prev ? { ...prev, companyLogoUrl: null } : null);
      } else {
        setMessage({ type: "error", text: data.message || "Failed to delete logo" });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to delete logo" });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // Check if branding is complete
  const isBrandingComplete = profile?.companyName && profile?.companyLogoUrl;

  if (isLoading) {
    return (
      <>
        <div className="row align-items-center pb40">
          <div className="col-lg-12">
            <div className="dashboard_title_area">
              <div className="skeleton-box mb-2" style={{ width: 200, height: 32 }}></div>
              <div className="skeleton-box" style={{ width: 300, height: 16 }}></div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-8">
            <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
              <div className="skeleton-box mb30" style={{ width: 150, height: 24 }}></div>
              <div className="d-flex gap-4 mb30">
                <div className="skeleton-box" style={{ width: 140, height: 140, borderRadius: 12 }}></div>
                <div className="flex-grow-1">
                  <div className="skeleton-box mb15" style={{ width: "60%", height: 16 }}></div>
                  <div className="skeleton-box mb15" style={{ width: "80%", height: 14 }}></div>
                  <div className="skeleton-box" style={{ width: 120, height: 38 }}></div>
                </div>
              </div>
              <div className="skeleton-box mb15" style={{ width: 120, height: 20 }}></div>
              <div className="skeleton-box mb20" style={{ width: "100%", height: 44 }}></div>
              <div className="skeleton-box" style={{ width: 160, height: 44 }}></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="row align-items-center pb40">
        <div className="col-lg-8">
          <div className="dashboard_title_area">
            <h2>Company Branding</h2>
            <p className="text">Personalize your rental appraisal reports with your company identity</p>
          </div>
        </div>
        <div className="col-lg-4 text-lg-end">
          <Link href="/dashboard/profile" className="ud-btn btn-white2">
            <i className="fas fa-arrow-left me-2" />
            Back to Profile
          </Link>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-8">
          {/* Status Banner */}
          {isBrandingComplete ? (
            <div
              className="d-flex align-items-center gap-3 p20 mb30 bdrs12 position-relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
                border: "1px solid #a5d6a7",
                boxShadow: "0 4px 15px rgba(76, 175, 80, 0.15)",
              }}
            >
              {/* Decorative sparkle elements */}
              <div
                className="position-absolute"
                style={{
                  top: 8,
                  right: 60,
                  width: 8,
                  height: 8,
                  backgroundColor: "#66bb6a",
                  borderRadius: "50%",
                  opacity: 0.6,
                }}
              />
              <div
                className="position-absolute"
                style={{
                  top: 20,
                  right: 30,
                  width: 5,
                  height: 5,
                  backgroundColor: "#81c784",
                  borderRadius: "50%",
                  opacity: 0.5,
                }}
              />
              <div
                className="position-absolute"
                style={{
                  bottom: 12,
                  right: 80,
                  width: 6,
                  height: 6,
                  backgroundColor: "#4caf50",
                  borderRadius: "50%",
                  opacity: 0.4,
                }}
              />
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #66bb6a 0%, #43a047 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
                }}
              >
                <i className="fas fa-check-circle" style={{ color: "#fff", fontSize: 24 }} />
              </div>
              <div className="flex-grow-1">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <p className="mb-0 fw600 fz16" style={{ color: "#2e7d32" }}>
                    Branding Complete
                  </p>
                  <span
                    style={{
                      backgroundColor: "#43a047",
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Active
                  </span>
                </div>
                <p className="mb-0 fz13" style={{ color: "#388e3c" }}>
                  Your company logo and name will appear on all generated appraisal reports.
                </p>
              </div>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <i className="fas fa-sparkles" style={{ color: "#43a047", fontSize: 16 }} />
              </div>
            </div>
          ) : (
            <div
              className="d-flex align-items-center gap-3 p20 mb30 bdrs12"
              style={{ backgroundColor: "#fff8e1", border: "1px solid #ffe082" }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: "#ff9800",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <i className="fas fa-exclamation" style={{ color: "#fff", fontSize: 20 }} />
              </div>
              <div>
                <p className="mb-0 fw600 fz15" style={{ color: "#e65100" }}>
                  Complete Your Branding
                </p>
                <p className="mb-0 fz13" style={{ color: "#795548" }}>
                  {!profile?.companyLogoUrl && !profile?.companyName
                    ? "Add your company logo and name to personalize your appraisal reports."
                    : !profile?.companyLogoUrl
                    ? "Add your company logo to complete the setup."
                    : "Add your company name to complete the setup."}
                </p>
              </div>
            </div>
          )}

          {/* Main Branding Form */}
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
            {message && (
              <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} mb25`}>
                {message.text}
              </div>
            )}

            {/* Company Logo Section */}
            <div className="mb30">
              <h5 className="fz16 fw600 mb20">Company Logo</h5>
              <div className="d-flex align-items-start gap-4">
                {profile?.companyLogoUrl && !logoLoadError ? (
                  <div
                    className="position-relative flex-shrink-0"
                    style={{
                      width: 140,
                      height: 140,
                      borderRadius: 12,
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
                      onError={() => {
                        console.error("Failed to load logo:", profile.companyLogoUrl);
                        setLogoLoadError(true);
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className="flex-shrink-0"
                    style={{
                      width: 140,
                      height: 140,
                      borderRadius: 12,
                      backgroundColor: logoLoadError ? "#fff5f5" : "#f8f9fa",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      border: logoLoadError ? "2px dashed #f5c6cb" : "2px dashed #dee2e6",
                    }}
                  >
                    <i className={`fas ${logoLoadError ? "fa-exclamation-triangle" : "fa-image"} fz32 mb-2`} style={{ color: logoLoadError ? "#dc3545" : "#6c757d" }} />
                    <span className="fz12" style={{ color: logoLoadError ? "#dc3545" : "#6c757d" }}>
                      {logoLoadError ? "Load failed" : "No logo"}
                    </span>
                  </div>
                )}
                <div className="flex-grow-1">
                  <p className="fz14 mb15" style={{ color: "#666" }}>
                    Upload your company logo to display on appraisal report headers.
                  </p>
                  <p className="fz13 text-muted mb20">
                    Recommended: Square image (1:1 ratio), at least 200x200 pixels. Supported formats: PNG, JPG, GIF, WebP. Max size: 10MB.
                  </p>
                  <div className="d-flex gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleLogoUpload}
                      className="d-none"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="ud-btn btn-thm"
                      style={{ cursor: isUploadingLogo ? "wait" : "pointer" }}
                    >
                      {isUploadingLogo ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-upload me-2" />
                          {profile?.companyLogoUrl ? "Change Logo" : "Upload Logo"}
                        </>
                      )}
                    </label>
                    {profile?.companyLogoUrl && (
                      <button
                        type="button"
                        onClick={handleLogoDelete}
                        disabled={isUploadingLogo}
                        className="ud-btn btn-white2"
                      >
                        <i className="fas fa-trash me-2" />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <hr className="my-4" style={{ borderColor: "#eee" }} />

            {/* Company Name Section */}
            <div>
              <h5 className="fz16 fw600 mb20">Company Name</h5>
              <form onSubmit={handleCompanyNameSubmit}>
                <div className="mb20">
                  <label className="form-label fw500 fz14 text-muted">
                    This name will appear alongside your logo on reports
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter your company name"
                    style={{ fontSize: 15, padding: "12px 16px" }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isPending || companyName === (profile?.companyName || "")}
                  className="ud-btn btn-thm"
                >
                  {isPending ? "Saving..." : "Save Company Name"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Preview Sidebar */}
        <div className="col-xl-4">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 position-sticky" style={{ top: 100 }}>
            <h5 className="fz16 fw600 mb20">Report Preview</h5>
            <p className="fz13 text-muted mb20">
              Preview how your branding appears on reports:
            </p>

            {/* Cover Page Preview */}
            <CoverPagePreview
              companyName={companyName || profile?.companyName || undefined}
              companyLogoUrl={profile?.companyLogoUrl}
            />

            {!isBrandingComplete && (
              <p className="fz12 text-muted mt15 mb-0">
                <i className="fas fa-info-circle me-1" />
                Add your logo and company name to see the full preview.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
