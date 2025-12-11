import Link from "next/link";
import { getUserProfile } from "@/actions/user";
import ProfileForm from "./ProfileForm";

export const metadata = {
  title: "My Profile | Dashboard",
};

export default async function ProfilePage() {
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
