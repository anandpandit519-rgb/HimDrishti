"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", icon: "⌂", path: "/dashboard" },
  { name: "Risk Map", icon: "🗺", path: "/risk-map" },
  { name: "Check Location", icon: "⌖", path: "/check-location" },
  { name: "Alerts", icon: "♟", path: "/alerts" },
  { name: "Weather", icon: "☁", path: "/weather" },
  { name: "Reports", icon: "▤", path: "/reports" },
  { name: "About", icon: "ⓘ", path: "/about" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">

      <div className="brand">

        <div className="logo">
          ▲
        </div>

        <div>
          <h1>HimDrishti</h1>
          <p>Landslide Early Warning System</p>
        </div>

      </div>

      <nav className="nav">

        {navigation.map((item) => {

          const active =
            pathname === item.path ||
            (item.path === "/dashboard" && pathname === "/");

          return (
            <Link
              key={item.path}
              href={item.path}
              className={active ? "active" : ""}
            >
              <span>{item.icon}</span>
              <b>{item.name}</b>
            </Link>
          );

        })}

      </nav>

      <div className="sidebar-bottom">
        <b>
          People Prepared.
          <br />
          Hills Safer.
        </b>

        <br />
        <br />

        Safer Northeast • Stronger Communities 🌿
      </div>

    </aside>
  );
}