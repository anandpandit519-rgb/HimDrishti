"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

import Sidebar from "../../components/layout/Sidebar";
import MobileNav from "../../components/layout/MobileNav";

const InteractiveRiskMap = dynamic(
  () => import("../../components/map/InteractiveRiskMap"),
  {
    ssr: false,
    loading: () => (
      <div className="risk-map-loading">
        <div className="loading-spinner"></div>
        <p>Loading risk map...</p>
      </div>
    ),
  }
);

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function RiskMapPage() {
  const [search, setSearch] = useState("");

  const [showRisk, setShowRisk] = useState(true);
  const [showRainfall, setShowRainfall] = useState(false);
  const [showStations, setShowStations] = useState(true);

  const [selectedRisk, setSelectedRisk] = useState("ALL");

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState(false);

  // ---------------------------------------------------------
  // FETCH BACKEND LOCATIONS
  // ---------------------------------------------------------

  useEffect(() => {
    async function loadLocations() {
      try {
        setLoading(true);
        setBackendError(false);

        const response = await fetch(
          `${API_BASE_URL}/api/v1/locations`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch risk locations");
        }

        const data = await response.json();

        setLocations(data);
      } catch (error) {
        console.error(
          "Risk Map backend error:",
          error
        );

        setBackendError(true);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    }

    loadLocations();
  }, []);

  // ---------------------------------------------------------
  // FILTER LOCATIONS
  // ---------------------------------------------------------

  const filteredLocations = useMemo(() => {
    return locations.filter((location) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        location.name
          .toLowerCase()
          .includes(query) ||
        location.state
          .toLowerCase()
          .includes(query);

      const matchesRisk =
        selectedRisk === "ALL" ||
        location.risk_level === selectedRisk;

      return matchesSearch && matchesRisk;
    });
  }, [locations, search, selectedRisk]);

  return (
    <>
      <Sidebar />

      <main className="risk-map-page">

        {/* TOP BAR */}
        <header className="risk-map-header">

          <div className="risk-map-title">

            <div>
              <span className="page-eyebrow">
                GIS MONITORING
              </span>

              <h1>Risk Map</h1>

              <p>
                Real-time landslide risk visualization
              </p>
            </div>

          </div>

          <div className="map-header-actions">

            <div className="map-live-status">

              <span className="live-dot"></span>

              {loading
                ? "Connecting..."
                : backendError
                  ? "Backend Offline"
                  : "Live Data"}

            </div>

            <div className="map-search">

              <span>⌕</span>

              <input
                type="text"
                placeholder="Search location..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

          </div>

        </header>

        {/* BACKEND ERROR */}
        {backendError && (
          <div
            style={{
              marginBottom: "12px",
              padding: "10px 14px",
              borderRadius: "10px",
              background: "#fff1f1",
              color: "#b42318",
              fontSize: "13px",
            }}
          >
            ⚠️ Unable to connect to HimDrishti backend.
          </div>
        )}

        {/* MAP WORKSPACE */}
        <section className="risk-map-workspace">

          {/* MAP */}
          <div className="full-risk-map">

            <InteractiveRiskMap
              locations={locations}
              showRisk={showRisk}
              showRainfall={showRainfall}
              showStations={showStations}
            />

            {/* MAP LAYER PANEL */}
            <div className="map-layer-panel">

              <div className="layer-panel-header">

                <div>
                  <span className="panel-label">
                    MAP
                  </span>

                  <h3>Layers</h3>
                </div>

                <span className="layer-icon">
                  ◈
                </span>

              </div>

              <div className="layer-list">

                <label className="layer-item">

                  <input
                    type="checkbox"
                    checked={showRisk}
                    onChange={(e) =>
                      setShowRisk(
                        e.target.checked
                      )
                    }
                  />

                  <span className="custom-checkbox"></span>

                  <span className="layer-color risk-layer"></span>

                  <span>Risk Zones</span>

                </label>

                <label className="layer-item">

                  <input
                    type="checkbox"
                    checked={showRainfall}
                    onChange={(e) =>
                      setShowRainfall(
                        e.target.checked
                      )
                    }
                  />

                  <span className="custom-checkbox"></span>

                  <span className="layer-color rainfall-layer"></span>

                  <span>Rainfall</span>

                </label>

                <label className="layer-item">

                  <input
                    type="checkbox"
                    checked={showStations}
                    onChange={(e) =>
                      setShowStations(
                        e.target.checked
                      )
                    }
                  />

                  <span className="custom-checkbox"></span>

                  <span className="layer-color station-layer"></span>

                  <span>Monitoring Stations</span>

                </label>

              </div>

              <div className="layer-divider"></div>

              <div className="map-filter-title">
                Risk Level
              </div>

              <div className="risk-filter-buttons">

                {[
                  "ALL",
                  "CRITICAL",
                  "HIGH",
                  "MODERATE",
                  "LOW",
                ].map((level) => (

                  <button
                    key={level}
                    className={
                      selectedRisk === level
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setSelectedRisk(level)
                    }
                  >
                    {level === "ALL"
                      ? "All"
                      : level}
                  </button>

                ))}

              </div>

            </div>

            {/* MAP LEGEND */}
            <div className="map-legend-box">

              <div className="legend-title">
                Risk Level
              </div>

              <div className="legend-row">
                <span className="legend-dot critical"></span>
                Critical
              </div>

              <div className="legend-row">
                <span className="legend-dot high"></span>
                High
              </div>

              <div className="legend-row">
                <span className="legend-dot moderate"></span>
                Moderate
              </div>

              <div className="legend-row">
                <span className="legend-dot low"></span>
                Low
              </div>

            </div>

          </div>

          {/* LOCATION SIDEBAR */}
          <aside className="risk-location-panel">

            <div className="location-panel-header">

              <div>
                <span className="panel-label">
                  MONITORING
                </span>

                <h2>
                  Risk Locations
                </h2>
              </div>

              <span className="location-count">
                {loading
                  ? "..."
                  : filteredLocations.length}
              </span>

            </div>

            <p className="location-description">
              Currently monitored locations and their latest risk readings.
            </p>

            <div className="location-list">

              {loading ? (

                <div className="no-location">

                  <div>⟳</div>

                  <strong>
                    Loading locations
                  </strong>

                  <span>
                    Fetching live risk data...
                  </span>

                </div>

              ) : filteredLocations.length === 0 ? (

                <div className="no-location">

                  <div>⌕</div>

                  <strong>
                    No locations found
                  </strong>

                  <span>
                    Try another search or risk level.
                  </span>

                </div>

              ) : (

                filteredLocations.map(
                  (location) => (

                    <div
                      className="risk-location-card"
                      key={location.id}
                    >

                      <div className="location-card-top">

                        <div>

                          <h3>
                            {location.name}
                          </h3>

                          <span>
                            {location.state}
                          </span>

                        </div>

                        <div
                          className={`risk-score ${location.risk_level.toLowerCase()}`}
                        >
                          {location.risk_score}
                        </div>

                      </div>

                      <div className="location-risk-label">

                        <span
                          className={`status-dot ${location.risk_level.toLowerCase()}`}
                        ></span>

                        {location.risk_level}

                        <span className="risk-percent">
                          Risk Score
                        </span>

                      </div>

                      <div className="location-metrics">

                        <div>

                          <span>
                            Rainfall
                          </span>

                          <strong>
                            {location.rainfall} mm
                          </strong>

                        </div>

                        <div>

                          <span>
                            Soil Moisture
                          </span>

                          <strong>
                            {location.soil_moisture}%
                          </strong>

                        </div>

                      </div>

                      <button
                        className="location-details-btn"
                        onClick={() => {
                          setSearch(
                            location.name
                          );
                        }}
                      >
                        View Details →
                      </button>

                    </div>

                  )
                )

              )}

            </div>

          </aside>

        </section>

        {/* BOTTOM INFORMATION BAR */}
        <section className="map-information-bar">

          <div className="map-info-item">

            <span className="info-icon">
              ◉
            </span>

            <div>

              <span>
                Last Updated
              </span>

              <strong>
                {loading
                  ? "Loading..."
                  : "Live from backend"}
              </strong>

            </div>

          </div>

          <div className="map-info-divider"></div>

          <div className="map-info-item">

            <span className="info-icon">
              ◈
            </span>

            <div>

              <span>
                Data Sources
              </span>

              <strong>
                Weather · GIS · Risk Engine
              </strong>

            </div>

          </div>

          <div className="map-info-divider"></div>

          <div className="map-info-item">

            <span className="info-icon">
              ⌁
            </span>

            <div>

              <span>
                Monitored Areas
              </span>

              <strong>
                {loading
                  ? "..."
                  : `${locations.length} Active Locations`}
              </strong>

            </div>

          </div>

          <div className="map-info-divider"></div>

          <div className="map-info-item system-status">

            <span className="system-status-dot"></span>

            <div>

              <span>
                System Status
              </span>

              <strong>
                {backendError
                  ? "Backend Offline"
                  : "Operational"}
              </strong>

            </div>

          </div>

        </section>

      </main>

      <MobileNav />
    </>
  );
}