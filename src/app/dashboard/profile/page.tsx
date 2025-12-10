"use client";

import Image from "next/image";
import { useState, useEffect, useTransition, useRef } from "react";
import {
  getUserProfile,
  updateUserName,
  updateUserEmail,
  changeUserPassword,
  updateCompanyName,
  type UserProfile,
} from "@/actions/user";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Logo upload states
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Feedback states
  const [nameMessage, setNameMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [emailMessage, setEmailMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [companyMessage, setCompanyMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const data = await getUserProfile();
      if (data) {
        setProfile(data);
        setName(data.name);
        setEmail(data.email);
        setCompanyName(data.companyName || "");
      }
      setIsLoading(false);
    }
    loadProfile();
  }, []);

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameMessage(null);

    startTransition(async () => {
      const result = await updateUserName(name);
      if (result.success) {
        setNameMessage({ type: "success", text: "Name updated successfully" });
        setProfile((prev) => prev ? { ...prev, name } : null);
      } else {
        setNameMessage({ type: "error", text: result.error || "Failed to update name" });
      }
    });
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailMessage(null);

    startTransition(async () => {
      const result = await updateUserEmail(email);
      if (result.success) {
        setEmailMessage({ type: "success", text: "Email updated successfully" });
        setProfile((prev) => prev ? { ...prev, email, emailVerified: false } : null);
      } else {
        setEmailMessage({ type: "error", text: result.error || "Failed to update email" });
      }
    });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMessage({ type: "error", text: "Password must be at least 8 characters" });
      return;
    }

    startTransition(async () => {
      const result = await changeUserPassword(currentPassword, newPassword);
      if (result.success) {
        setPasswordMessage({ type: "success", text: "Password changed successfully" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMessage({ type: "error", text: result.error || "Failed to change password" });
      }
    });
  };

  const handleCompanyNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCompanyMessage(null);

    startTransition(async () => {
      const result = await updateCompanyName(companyName || null);
      if (result.success) {
        setCompanyMessage({ type: "success", text: "Company name updated successfully" });
        setProfile((prev) => prev ? { ...prev, companyName: companyName || null } : null);
      } else {
        setCompanyMessage({ type: "error", text: result.error || "Failed to update company name" });
      }
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    setCompanyMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/user/company-logo", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setCompanyMessage({ type: "success", text: "Logo uploaded successfully" });
        setProfile((prev) => prev ? { ...prev, companyLogoUrl: data.payload.url } : null);
      } else {
        setCompanyMessage({ type: "error", text: data.message || "Failed to upload logo" });
      }
    } catch (error) {
      setCompanyMessage({ type: "error", text: "Failed to upload logo" });
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
    setCompanyMessage(null);

    try {
      const response = await fetch("/api/user/company-logo", {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setCompanyMessage({ type: "success", text: "Logo deleted successfully" });
        setProfile((prev) => prev ? { ...prev, companyLogoUrl: null } : null);
      } else {
        setCompanyMessage({ type: "error", text: data.message || "Failed to delete logo" });
      }
    } catch (error) {
      setCompanyMessage({ type: "error", text: "Failed to delete logo" });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <div className="row align-items-center pb40">
          <div className="col-lg-12">
            <div className="dashboard_title_area">
              <div className="skeleton-box mb-2" style={{ width: 150, height: 32 }}></div>
              <div className="skeleton-box" style={{ width: 200, height: 16 }}></div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-6">
            <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
              <div className="skeleton-box mb30" style={{ width: 150, height: 24 }}></div>
              <div className="skeleton-box mb20" style={{ width: "100%", height: 44 }}></div>
              <div className="skeleton-box" style={{ width: "100%", height: 44 }}></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="row align-items-center pb40">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2>My Profile</h2>
            <p className="text">Manage your account settings</p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-6">
          {/* Name Section */}
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
            <h4 className="title fz17 mb25">Display Name</h4>

            {nameMessage && (
              <div className={`alert ${nameMessage.type === "success" ? "alert-success" : "alert-danger"} mb20`}>
                {nameMessage.text}
              </div>
            )}

            <form onSubmit={handleNameSubmit}>
              <div className="mb20">
                <label className="form-label fw500 fz15">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isPending || name === profile?.name}
                className="ud-btn btn-thm"
              >
                {isPending ? "Saving..." : "Update Name"}
              </button>
            </form>
          </div>

          {/* Email Section */}
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
            <h4 className="title fz17 mb25">Email Address</h4>

            {emailMessage && (
              <div className={`alert ${emailMessage.type === "success" ? "alert-success" : "alert-danger"} mb20`}>
                {emailMessage.text}
              </div>
            )}

            <form onSubmit={handleEmailSubmit}>
              <div className="mb20">
                <label className="form-label fw500 fz15">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
                {profile?.emailVerified === false && (
                  <small className="text-warning mt-1 d-block">
                    <i className="fas fa-exclamation-triangle me-1"></i>
                    Email not verified
                  </small>
                )}
              </div>
              <button
                type="submit"
                disabled={isPending || email === profile?.email}
                className="ud-btn btn-thm"
              >
                {isPending ? "Saving..." : "Update Email"}
              </button>
            </form>
          </div>

          {/* Company Branding Section */}
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
            <h4 className="title fz17 mb25">Company Branding</h4>
            <p className="text-muted fz14 mb20">
              Add your company details to personalize your appraisal reports
            </p>

            {companyMessage && (
              <div className={`alert ${companyMessage.type === "success" ? "alert-success" : "alert-danger"} mb20`}>
                {companyMessage.text}
              </div>
            )}

            {/* Company Logo */}
            <div className="mb25">
              <label className="form-label fw500 fz15">Company Logo</label>
              <div className="d-flex align-items-center gap-3">
                {profile?.companyLogoUrl ? (
                  <div
                    className="position-relative"
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 12,
                      overflow: "hidden",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Image
                      src={profile.companyLogoUrl}
                      alt="Company Logo"
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 12,
                      backgroundColor: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px dashed #ddd",
                    }}
                  >
                    <i className="fas fa-building fz24 text-muted" />
                  </div>
                )}
                <div className="d-flex flex-column gap-2">
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
                    className="ud-btn btn-white2 btn-sm"
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
                      className="btn btn-sm btn-outline-danger"
                    >
                      <i className="fas fa-trash me-2" />
                      Remove
                    </button>
                  )}
                </div>
              </div>
              <small className="text-muted d-block mt-2">
                Recommended: Square image, at least 200x200px. Max 10MB.
              </small>
            </div>

            {/* Company Name */}
            <form onSubmit={handleCompanyNameSubmit}>
              <div className="mb20">
                <label className="form-label fw500 fz15">Company Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter your company name"
                />
              </div>
              <button
                type="submit"
                disabled={isPending || companyName === (profile?.companyName || "")}
                className="ud-btn btn-thm"
              >
                {isPending ? "Saving..." : "Update Company Name"}
              </button>
            </form>
          </div>

          {/* Password Section */}
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
            <h4 className="title fz17 mb25">Change Password</h4>

            {passwordMessage && (
              <div className={`alert ${passwordMessage.type === "success" ? "alert-success" : "alert-danger"} mb20`}>
                {passwordMessage.text}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit}>
              <div className="mb20">
                <label className="form-label fw500 fz15">Current Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div className="mb20">
                <label className="form-label fw500 fz15">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength={8}
                />
                <small className="text-muted">Minimum 8 characters</small>
              </div>
              <div className="mb20">
                <label className="form-label fw500 fz15">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isPending || !currentPassword || !newPassword || !confirmPassword}
                className="ud-btn btn-thm"
              >
                {isPending ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>

        {/* Account Info Sidebar */}
        <div className="col-xl-6">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
            <h4 className="title fz17 mb25">Account Information</h4>
            <ul className="list-unstyled mb-0">
              <li className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">Account ID</span>
                <span className="fw500">{profile?.id}</span>
              </li>
              <li className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">Member Since</span>
                <span className="fw500">
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </span>
              </li>
              <li className="d-flex justify-content-between py-2">
                <span className="text-muted">Email Status</span>
                <span className={`fw500 ${profile?.emailVerified ? "text-success" : "text-warning"}`}>
                  {profile?.emailVerified ? "Verified" : "Not Verified"}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
