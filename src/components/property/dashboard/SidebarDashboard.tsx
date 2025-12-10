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
          icon: "flaticon-add-new",
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
      className="dashboard__sidebar d-none d-lg-block"
      style={{
        width: isCollapsed ? 80 : undefined,
        minWidth: isCollapsed ? 80 : undefined,
        transition: "all 0.3s ease",
        overflow: isCollapsed ? "visible" : undefined,
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
            {isCollapsed && sectionIndex > 0 && (
              <div style={{ height: 20 }} />
            )}
            {section.items.map((item, itemIndex) => (
              <div key={itemIndex} className="sidebar_list_item">
                <Link
                  href={item.href}
                  className={`items-center ${isActive(item.href) ? "-is-active" : ""}`}
                  prefetch={true}
                  title={isCollapsed ? item.text : undefined}
                  style={{
                    justifyContent: isCollapsed ? "center" : undefined,
                    padding: isCollapsed ? "15px 10px" : undefined,
                  }}
                >
                  <i
                    className={`${item.icon} ${isCollapsed ? "" : "mr15"}`}
                    style={{
                      fontSize: isCollapsed ? 20 : undefined,
                    }}
                  />
                  {!isCollapsed && item.text}
                </Link>
              </div>
            ))}
          </div>
        ))}

        {/* Logout button */}
        <div className="sidebar_list_item" style={{ marginTop: isCollapsed ? 20 : undefined }}>
          <a
            href="#"
            onClick={handleLogout}
            className="items-center"
            title={isCollapsed ? "Logout" : undefined}
            style={{
              cursor: "pointer",
              justifyContent: isCollapsed ? "center" : undefined,
              padding: isCollapsed ? "15px 10px" : undefined,
            }}
          >
            <i
              className={`flaticon-logout ${isCollapsed ? "" : "mr15"}`}
              style={{
                fontSize: isCollapsed ? 20 : undefined,
              }}
            />
            {!isCollapsed && "Logout"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default SidebarDashboard;
