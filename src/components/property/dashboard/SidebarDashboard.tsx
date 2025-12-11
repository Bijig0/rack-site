"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";

const SidebarDashboard = () => {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const sidebarItems = [
    {
      title: "MAIN",
      items: [
        {
          href: "/dashboard",
          icon: "flaticon-discovery",
          text: "Dashboard",
        },
      ],
    },
    {
      title: "MANAGE LISTINGS",
      items: [
        {
          href: "/dashboard/my-properties",
          icon: "flaticon-home",
          text: "My Properties",
        },
        {
          href: "/dashboard/add-property",
          icon: "fas fa-plus-circle",
          text: "Add Property",
        },
        {
          href: "/dashboard/appraisal-reports",
          icon: "fas fa-file-invoice",
          text: "Appraisal Reports",
        },
      ],
    },
    {
      title: "MANAGE ACCOUNT",
      items: [
        {
          href: "/dashboard/profile",
          icon: "flaticon-user",
          text: "My Profile",
        },
        {
          href: "/dashboard/subscription",
          icon: "fas fa-crown",
          text: "Subscription Plans",
        },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div
      className={`dashboard__sidebar d-none d-lg-block ${isCollapsed ? "sidebar-collapsed" : ""}`}
      style={{
        width: isCollapsed ? 80 : undefined,
        minWidth: isCollapsed ? 80 : undefined,
        overflow: isCollapsed ? "visible" : undefined,
        transition: "all 0.6s cubic-bezier(0.215, 0.61, 0.355, 1)",
      }}
    >
      <div
        className="dashboard_sidebar_list"
        style={{
          padding: isCollapsed ? "0 10px" : undefined,
        }}
      >
        {sidebarItems.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {!isCollapsed && (
              <p
                className={`fz15 fw400 ff-heading ${
                  sectionIndex === 0 ? "mt-0" : "mt30"
                }`}
              >
                {section.title}
              </p>
            )}
            {sectionIndex > 0 && (
              <div className="sidebar-divider" />
            )}
            {section.items.map((item, itemIndex) => (
              <div key={itemIndex} className="sidebar_list_item">
                <Link
                  href={item.href}
                  className={`items-center ${isActive(item.href) ? "-is-active" : ""}`}
                  prefetch={true}
                  title={isCollapsed ? item.text : undefined}
                >
                  <i className={`${item.icon} ${isCollapsed ? "" : "mr15"}`} />
                  {!isCollapsed && item.text}
                </Link>
              </div>
            ))}
          </div>
        ))}

        {/* Logout button */}
        <div className="sidebar-divider" />
        <div className="sidebar_list_item" style={{ marginTop: isCollapsed ? 0 : undefined }}>
          <a
            href="#"
            onClick={handleLogout}
            className="items-center"
            title={isCollapsed ? "Logout" : undefined}
            style={{ cursor: "pointer" }}
          >
            <i className={`flaticon-logout ${isCollapsed ? "" : "mr15"}`} />
            {!isCollapsed && "Logout"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default SidebarDashboard;
