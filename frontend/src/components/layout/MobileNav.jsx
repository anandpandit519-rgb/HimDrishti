"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNav() {
  const pathname = usePathname();

  const items = [
    {
      label: "Home",
      icon: "⌂",
      path: "/dashboard",
    },
    {
      label: "Map",
      icon: "🗺",
      path: "/risk-map",
    },
    {
      label: "Alerts",
      icon: "🔔",
      path: "/alerts",
    },
    {
      label: "More",
      icon: "☰",
      path: "/settings",
    },
  ];

  return (
    <nav className="mobile-nav">

      {items.map((item) => {

        const active =
          pathname === item.path ||
          (item.path === "/dashboard" && pathname === "/");

        return (
          <Link
            key={item.path}
            href={item.path}
            className={active ? "active" : ""}
            style={{
              textAlign: "center",
            }}
          >
            {item.icon}
            <br />
            {item.label}
          </Link>
        );

      })}

    </nav>
  );
}