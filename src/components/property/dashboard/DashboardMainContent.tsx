"use client";

import { ReactNode } from "react";
import { useSidebar } from "@/context/SidebarContext";

interface DashboardMainContentProps {
  children: ReactNode;
}

export default function DashboardMainContent({ children }: DashboardMainContentProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className="dashboard__main pl0-md"
      style={{
        flex: 1,
        marginLeft: isCollapsed ? -170 : 0,
        width: isCollapsed ? "calc(100% + 170px)" : "100%",
        transition: "all 0.6s cubic-bezier(0.215, 0.61, 0.355, 1)",
      }}
    >
      <div className="dashboard__content bgc-f7">
        {children}
      </div>
    </div>
  );
}
