"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MainMenu = () => {
  const pathname = usePathname();

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Contact Us", href: "/contact" },
  ];

  // Check if the current path matches the menu item
  const isActive = (href: string) => {
    if (href === "/") {
      // Home is only active on exact match
      return pathname === "/";
    }
    // Other items are active if pathname starts with their href
    return pathname.startsWith(href);
  };

  return (
    <ul className="ace-responsive-menu">
      {menuItems.map((item, index) => (
        <li key={index} className="visible_list">
          <Link className="list-item" href={item.href}>
            <span
              className={`title ${isActive(item.href) ? "menuActive" : ""}`}
              style={isActive(item.href) ? { color: "#eb6753" } : undefined}
            >
              {item.label}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default MainMenu;
