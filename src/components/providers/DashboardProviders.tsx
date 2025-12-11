"use client";

import { ReactNode } from "react";
import { PropertyJobsProvider, usePropertyJobs } from "@/context/PropertyJobsContext";
import { ReportJobsProvider } from "@/context/ReportJobsContext";
import { SidebarProvider } from "@/context/SidebarContext";

// Inner component that has access to PropertyJobsContext
function ReportJobsWithToast({ children }: { children: ReactNode }) {
  const { showToast } = usePropertyJobs();
  return <ReportJobsProvider showToast={showToast}>{children}</ReportJobsProvider>;
}

export default function DashboardProviders({ children }: { children: ReactNode }) {
  return (
    <PropertyJobsProvider>
      <ReportJobsWithToast>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </ReportJobsWithToast>
    </PropertyJobsProvider>
  );
}
