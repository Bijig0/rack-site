import { getUserProperties, getUserPropertyCount } from "@/actions/properties";
import { getUserAppraisalReports } from "@/actions/appraisals";
import { getUserProfile } from "@/actions/user";
import {
  StatsBlock,
  PropertiesList,
  CompanyBrandingCard,
  AppraisalReportsList,
} from "./DashboardContent";

// Async server component that fetches stats
export async function StatsBlockServer() {
  const propertyCount = await getUserPropertyCount();
  return <StatsBlock propertyCount={propertyCount} />;
}

// Async server component that fetches properties
export async function PropertiesListServer() {
  const properties = await getUserProperties();
  return <PropertiesList properties={properties} />;
}

// Async server component that fetches user profile for branding
export async function CompanyBrandingCardServer() {
  const profile = await getUserProfile();
  return <CompanyBrandingCard profile={profile} />;
}

// Async server component that fetches appraisal reports
export async function AppraisalReportsListServer() {
  const reports = await getUserAppraisalReports();
  return <AppraisalReportsList reports={reports} />;
}
