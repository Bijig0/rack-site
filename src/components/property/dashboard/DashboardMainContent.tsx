"use client";

import { ReactNode } from "react";

interface DashboardMainContentProps {
  children: ReactNode;
}

export default function DashboardMainContent({ children }: DashboardMainContentProps) {
  return (
    <div className="dashboard__main pl0-md">
      <div className="dashboard__content bgc-f7">
        {children}
      </div>
    </div>
  );
}
