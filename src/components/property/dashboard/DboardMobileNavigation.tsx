"use client";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

const DboardMobileNavigation = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        // Hard redirect to ensure cookie removal is recognized
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

  return (
    <div className="dashboard_navigationbar d-block d-lg-none">
      <div className="dropdown">
        <button
          className="dropbtn"
          onClick={() => setIsDropdownOpen((prevOpen) => !prevOpen)}
        >
          <i className="fa fa-bars pr10" /> Dashboard Navigation
        </button>
        <ul className={`dropdown-content ${isDropdownOpen ? "show" : ""}`}>
          {sidebarItems.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <p
                className={`fz15 fw400 ff-heading mt30 pl30 ${
                  sectionIndex === 0 ? "mt-0" : "mt30"
                }`}
              >
                {section.title}
              </p>
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="sidebar_list_item">
                  <Link
                    href={item.href}
                    className={`items-center ${
                      pathname == item.href ? "-is-active" : ""
                    }`}
                  >
                    <i className={`${item.icon} mr15`} />
                    {item.text}
                  </Link>
                </div>
              ))}
            </div>
          ))}

          {/* Logout button */}
          <div className="sidebar_list_item">
            <a
              href="#"
              onClick={handleLogout}
              className="items-center"
              style={{ cursor: "pointer" }}
            >
              <i className="flaticon-logout mr15" />
              Logout
            </a>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default DboardMobileNavigation;
