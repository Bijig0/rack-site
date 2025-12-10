import { usePathname } from "next/navigation";
import Link from "next/link";

import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";

const ProSidebarContent = () => {
  const pathname = usePathname();

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Contact Us", href: "/contact" },
  ];

  // Check if the current path matches the menu item
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <Sidebar width="100%" backgroundColor="#fff" className="my-custom-class">
      <Menu>
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            component={
              <Link
                className={isActive(item.href) ? "active" : ""}
                href={item.href}
                style={isActive(item.href) ? { color: "#eb6753" } : undefined}
              />
            }
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </Sidebar>
  );
};

export default ProSidebarContent;
