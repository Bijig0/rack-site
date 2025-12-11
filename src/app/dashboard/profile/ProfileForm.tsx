"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import {
  updateUserName,
  updateUserEmail,
  changeUserPassword,
  type UserProfile,
} from "@/actions/user";

interface ProfileFormProps {
  initialProfile: UserProfile;
}

export default function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isPending, startTransition] = useTransition();

  // Form states
  const [name, setName] = useState(initialProfile.name);
  const [email, setEmail] = useState(initialProfile.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Feedback states
  const [nameMessage, setNameMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [emailMessage, setEmailMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameMessage(null);

    startTransition(async () => {
      const result = await updateUserName(name);
      if (result.success) {
        setNameMessage({ type: "success", text: "Name updated successfully" });
        setProfile((prev) => ({ ...prev, name }));
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
        setProfile((prev) => ({ ...prev, email, emailVerified: false }));
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
                disabled={isPending || name === profile.name}
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
                {profile.emailVerified === false && (
                  <small className="text-warning mt-1 d-block">
                    <i className="fas fa-exclamation-triangle me-1"></i>
                    Email not verified
                  </small>
                )}
              </div>
              <button
                type="submit"
                disabled={isPending || email === profile.email}
                className="ud-btn btn-thm"
              >
                {isPending ? "Saving..." : "Update Email"}
              </button>
            </form>
          </div>

          {/* Company Branding Section - Link Card */}
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
            <div className="d-flex align-items-center justify-content-between mb15">
              <h4 className="title fz17 mb-0">Company Branding</h4>
              {(profile.companyName && profile.companyLogoUrl) && (
                <span className="badge bg-success fz11">
                  <i className="fas fa-check me-1" />
                  Complete
                </span>
              )}
            </div>
            <p className="text-muted fz14 mb20">
              Personalize your rental appraisal reports with your company logo and name.
            </p>

            <div className="d-flex align-items-center gap-3 mb20">
              {profile.companyLogoUrl ? (
                <div
                  className="position-relative flex-shrink-0"
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 10,
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
              ) : (
                <div
                  className="flex-shrink-0"
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 10,
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px dashed #ddd",
                  }}
                >
                  <i className="fas fa-building fz20 text-muted" />
                </div>
              )}
              <div>
                {profile.companyName ? (
                  <p className="mb-1 fw500 fz15">{profile.companyName}</p>
                ) : (
                  <p className="mb-1 fz14 text-muted">No company name set</p>
                )}
                {!profile.companyLogoUrl && (
                  <p className="mb-0 fz12 text-muted">No logo uploaded</p>
                )}
              </div>
            </div>

            <Link href="/dashboard/branding" className="ud-btn btn-thm" prefetch={true}>
              <i className="fas fa-edit me-2" />
              {(profile.companyName || profile.companyLogoUrl) ? "Edit Branding" : "Set Up Branding"}
            </Link>
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
                <span className="fw500">{profile.id}</span>
              </li>
              <li className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">Member Since</span>
                <span className="fw500">
                  {profile.createdAt
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
                <span className={`fw500 ${profile.emailVerified ? "text-success" : "text-warning"}`}>
                  {profile.emailVerified ? "Verified" : "Not Verified"}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
