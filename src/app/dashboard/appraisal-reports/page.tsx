import { getUserAppraisalReports } from "@/actions/appraisals";
import { getUserProfile } from "@/actions/user";
import ReportList from "./ReportList";
import CompanyBrandingBanner from "./CompanyBrandingBanner";

export const metadata = {
  title: "Appraisal Reports | Dashboard",
};

// Fetch all data in parallel on the server
async function getAppraisalReportsData() {
  const [reports, profile] = await Promise.all([
    getUserAppraisalReports(),
    getUserProfile(),
  ]);

  return { reports, profile };
}

export default async function AppraisalReportsPage() {
  const { reports, profile } = await getAppraisalReportsData();

  return (
    <>
      {/* Company Branding Banner */}
      <CompanyBrandingBanner profile={profile} />

      {/* Reports List */}
      <ReportList reports={reports} />
    </>
  );
}
