"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MainMenu = () => {
  const pathname = usePathname();

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <ul className="ace-responsive-menu">
      {menuItems.map((item, index) => (
        <li key={index} className="visible_list">
          <Link className="list-item" href={item.href}>
            <span className={pathname === item.href ? "title menuActive" : "title"}>
              {item.label}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default MainMenu;
