"use client";

import { useEffect, useState } from "react";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import MobileNav from "../../components/layout/MobileNav";

import StatsCard from "../../components/dashboard/StatsCard";
import LatestAlerts from "../../components/dashboard/LatestAlerts";
import WeatherCard from "../../components/dashboard/WeatherCard";
import RiskTrend from "../../components/dashboard/RiskTrend";
import QuickActions from "../../components/dashboard/QuickActions";

import RiskMap from "../../components/map/RiskMap";

import { fetchLocations } from "../../services/location.service";

export default function DashboardPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState(false);

  useEffect(() => {
    async function loadLocations() {
      try {
        const data = await fetchLocations();

        setLocations(data);
        setBackendError(false);
      } catch (error) {
        console.error("Failed to load HimDrishti locations:", error);
        setBackendError(true);
      } finally {
        setLoading(false);
      }
    }

    loadLocations();
  }, []);

  const criticalZones = locations.filter(
    (location) => location.risk_level === "CRITICAL"
  ).length;

  const highRiskZones = locations.filter(
    (location) => location.risk_level === "HIGH"
  ).length;

  return (
    <div className="app">

      <Sidebar />

      <main className="main">

        <Navbar />

        {/* Backend connection status */}
        <div
          style={{
            marginBottom: "12px",
            fontSize: "12px",
            color: backendError ? "#c0392b" : "#4d8061",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>
            {backendError ? "●" : "●"}
          </span>

          {loading
            ? "Connecting to HimDrishti backend..."
            : backendError
              ? "Backend connection unavailable"
              : "Live backend data connected"}
        </div>

        <section className="stats">

          <StatsCard
            icon="📍"
            value={loading ? "..." : locations.length}
            label="Locations Monitored"
            variant="blue"
          />

          <StatsCard
            icon="⚠️"
            value={loading ? "..." : criticalZones}
            label="Critical Zones"
            variant="pink"
          />

          <StatsCard
            icon="!"
            value={loading ? "..." : highRiskZones}
            label="High Risk Zones"
            variant="orange"
          />

          <StatsCard
            icon="👥"
            value="36"
            label="Affected Villages"
            variant="mint"
          />

        </section>

        <section className="dashboard-grid">

          <RiskMap locations={locations} />

          <LatestAlerts />

        </section>

        <section className="dashboard-bottom">

          <WeatherCard />

          <RiskTrend />

          <QuickActions />

        </section>

      </main>

      <MobileNav />

    </div>
  );
}