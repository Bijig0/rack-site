import { Suspense } from "react";
import Link from "next/link";
import { getUserProfile } from "@/actions/user";
import ProfileForm from "./ProfileForm";

export const metadata = {
  title: "My Profile | Dashboard",
};

// Skeleton for the profile page
function ProfileSkeleton() {
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
        <div className="col-xl-8">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
            <h4 className="title fz17 mb30">Personal Information</h4>
            <div className="row">
              <div className="col-md-6 mb25">
                <div className="skeleton-box mb-2" style={{ width: 80, height: 14 }}></div>
                <div className="skeleton-box" style={{ width: "100%", height: 46, borderRadius: 8 }}></div>
              </div>
              <div className="col-md-6 mb25">
                <div className="skeleton-box mb-2" style={{ width: 60, height: 14 }}></div>
                <div className="skeleton-box" style={{ width: "100%", height: 46, borderRadius: 8 }}></div>
              </div>
            </div>
            <div className="skeleton-box mt-3" style={{ width: 120, height: 44, borderRadius: 8 }}></div>
          </div>

          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
            <h4 className="title fz17 mb30">Change Password</h4>
            <div className="row">
              <div className="col-md-6 mb25">
                <div className="skeleton-box mb-2" style={{ width: 120, height: 14 }}></div>
                <div className="skeleton-box" style={{ width: "100%", height: 46, borderRadius: 8 }}></div>
              </div>
              <div className="col-md-6 mb25">
                <div className="skeleton-box mb-2" style={{ width: 100, height: 14 }}></div>
                <div className="skeleton-box" style={{ width: "100%", height: 46, borderRadius: 8 }}></div>
              </div>
            </div>
            <div className="skeleton-box mt-3" style={{ width: 140, height: 44, borderRadius: 8 }}></div>
          </div>
        </div>

        <div className="col-xl-4">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30">
            <div className="skeleton-box mb20" style={{ width: 120, height: 20 }}></div>
            <div className="skeleton-box mb-2" style={{ width: "60%", height: 16 }}></div>
            <div className="skeleton-box" style={{ width: "40%", height: 14 }}></div>
          </div>
        </div>
      </div>
    </>
  );
}

// Async server component that fetches profile
async function ProfileContent() {
  const profile = await getUserProfile();

  if (!profile) {
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
          <div className="col-12">
            <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 text-center">
              <i className="fas fa-exclamation-triangle fz60 text-warning mb-4 d-block" />
              <h4 className="mb-3">Unable to load profile</h4>
              <p className="text-muted mb-4">Please try refreshing the page.</p>
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

  return <ProfileForm initialProfile={profile} />;
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </Suspense>
  );
}
