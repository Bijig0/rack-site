"use client";

import SidebarPanel from "@/components/common/sidebar-panel";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";

const DashboardHeader = () => {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const handleLogout = async () => {
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

  const menuItems = [
    {
      title: "MAIN",
      items: [
        {
          icon: "flaticon-discovery",
          text: "Dashboard",
          href: "/dashboard",
        },
      ],
    },
    {
      title: "MANAGE LISTINGS",
      items: [
        {
          icon: "flaticon-home",
          text: "My Properties",
          href: "/dashboard/my-properties",
        },
        {
          icon: "flaticon-new-tab",
          text: "Add Property",
          href: "/dashboard/add-property",
        },
        {
          icon: "fas fa-file-alt",
          text: "Appraisal Reports",
          href: "/dashboard/appraisal-reports",
        },
      ],
    },
    {
      title: "MANAGE ACCOUNT",
      items: [
        {
          icon: "flaticon-user",
          text: "My Profile",
          href: "/dashboard/profile",
        },
        {
          icon: "fas fa-crown",
          text: "Subscription Plans",
          href: "/dashboard/subscription",
        },
      ],
    },
  ];

  return (
    <>
      <header className="header-nav nav-homepage-style light-header position-fixed menu-home4 main-menu">
        <nav className="posr">
          <div className="container-fluid pr30 pr15-xs pl30 posr menu_bdrt1">
            <div className="row align-items-center justify-content-between">
              <div className="col-6 col-lg-auto">
                <div className="text-center text-lg-start d-flex align-items-center">
                  <div
                    className="dashboard_header_logo position-relative me-2 me-xl-5"
                    style={{
                      width: isCollapsed ? 44 : undefined,
                      overflow: "hidden",
                    }}
                  >
                    <Link className="logo" href="/">
                      <Image
                        width={138}
                        height={44}
                        src="/images/header-logo2.svg"
                        alt="Header Logo"
                        style={{ minWidth: 138 }}
                      />
                    </Link>
                  </div>

                  {/* Desktop: Toggle sidebar collapse */}
                  <button
                    className="dashboard_sidebar_toggle_icon text-thm1 vam d-none d-lg-block btn p-0 border-0 bg-transparent"
                    onClick={toggleSidebar}
                    style={{ cursor: "pointer" }}
                  >
                    <Image
                      width={25}
                      height={9}
                      className="img-1"
                      src="/images/dark-nav-icon.svg"
                      alt="menu"
                    />
                  </button>

                  {/* Mobile: Open offcanvas sidebar */}
                  <a
                    className="dashboard_sidebar_toggle_icon text-thm1 vam d-lg-none"
                    href="#"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#SidebarPanel"
                    aria-controls="SidebarPanelLabel"
                  >
                    <Image
                      width={25}
                      height={9}
                      className="img-1"
                      src="/images/dark-nav-icon.svg"
                      alt="menu"
                    />
                  </a>
                </div>
              </div>

              <div className="col-6 col-lg-auto">
                <div className="text-center text-lg-end header_right_widgets">
                  <ul className="mb0 d-flex justify-content-center justify-content-sm-end align-items-center p-0">
                    <li className="user_setting">
                      <div className="dropdown">
                        <a
                          className="btn d-flex align-items-center gap-2 p-0"
                          href="#"
                          data-bs-toggle="dropdown"
                        >
                          {/* User icon */}
                          <div
                            className="d-flex align-items-center justify-content-center"
                            style={{
                              width: 44,
                              height: 44,
                              backgroundColor: "#f0f0f0",
                              borderRadius: "50%",
                            }}
                          >
                            <i
                              className="fas fa-user"
                              style={{ fontSize: 18, color: "#666" }}
                            />
                          </div>
                          <span className="d-none d-sm-inline fw500 fz14">
                            My Account
                          </span>
                          <i
                            className="fas fa-chevron-down d-none d-sm-inline"
                            style={{ fontSize: 10, color: "#666" }}
                          />
                        </a>
                        <div className="dropdown-menu dropdown-menu-end">
                          <div className="user_setting_content">
                            {menuItems.map((section, sectionIndex) => (
                              <div key={sectionIndex}>
                                <p
                                  className={`fz15 fw400 ff-heading ${
                                    sectionIndex === 0 ? "mb20" : "mt30"
                                  }`}
                                >
                                  {section.title}
                                </p>
                                {section.items.map((item, itemIndex) => {
                                  const isActive = item.href === "/dashboard"
                                    ? pathname === "/dashboard"
                                    : pathname === item.href || pathname.startsWith(item.href + "/");
                                  return (
                                    <Link
                                      key={itemIndex}
                                      className="dropdown-item"
                                      href={item.href}
                                      style={isActive ? {
                                        backgroundColor: "#222",
                                        color: "#fff",
                                        borderRadius: 8,
                                      } : undefined}
                                    >
                                      <i className={`${item.icon} mr10`} style={isActive ? { color: "#fff" } : undefined} />
                                      {item.text}
                                    </Link>
                                  );
                                })}
                              </div>
                            ))}
                            {/* Logout */}
                            <div className="mt30 pt20 border-top">
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleLogout();
                                }}
                                className="dropdown-item text-danger"
                              >
                                <i className="flaticon-exit mr10" />
                                Logout
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Sidebar Panel for mobile */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex={-1}
        id="SidebarPanel"
        aria-labelledby="SidebarPanelLabel"
      >
        <SidebarPanel />
      </div>
    </>
  );
};

export default DashboardHeader;
