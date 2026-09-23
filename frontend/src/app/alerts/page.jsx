"use client";

import { useEffect, useMemo, useState } from "react";

import Sidebar from "../../components/layout/Sidebar";
import MobileNav from "../../components/layout/MobileNav";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

function getCurrentTime() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function normalizeAlert(alert, index) {
  return {
    id: alert.id || `ALT-${index + 1}`,
    level: alert.risk_level || "LOW",
    title: alert.title || "Landslide Risk Alert",
    location: alert.location || "Unknown Location",
    state: alert.state || "Unknown State",

    time: getCurrentTime(),
    date: "Today",

    description:
      alert.message ||
      "Environmental conditions indicate elevated landslide risk.",

    rainfall:
      alert.rainfall !== undefined
        ? `${alert.rainfall} mm`
        : "N/A",

    soil:
      alert.soil_moisture !== undefined
        ? `${alert.soil_moisture}%`
        : "N/A",

    risk: Number(alert.risk_score) || 0,

    status: alert.status || "ACTIVE",

    unread: true,

    source: "Weather + GIS + Risk Engine",

    action:
      alert.recommended_action ||
      "Monitor local conditions and follow local authority instructions.",
  };
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedAlert, setSelectedAlert] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load alerts from backend
  useEffect(() => {
    async function loadAlerts() {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_BASE_URL}/api/v1/alerts`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch alerts");
        }

        const data = await response.json();

        const normalizedAlerts = data.map(
          normalizeAlert
        );

        setAlerts(normalizedAlerts);

        if (normalizedAlerts.length > 0) {
          setSelectedAlert(normalizedAlerts[0]);
        } else {
          setSelectedAlert(null);
        }

        setError("");
      } catch (err) {
        console.error(
          "Failed to load HimDrishti alerts:",
          err
        );

        setError(
          "Unable to connect to the HimDrishti alert system."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAlerts();
  }, []);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesFilter =
        filter === "ALL" ||
        (filter === "UNREAD" && alert.unread) ||
        alert.level === filter ||
        alert.status === filter;

      const query = search.toLowerCase().trim();

      const matchesSearch =
        alert.title.toLowerCase().includes(query) ||
        alert.location.toLowerCase().includes(query) ||
        alert.level.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [alerts, filter, search]);

  const unreadCount = alerts.filter(
    (alert) => alert.unread
  ).length;

  const criticalCount = alerts.filter(
    (alert) =>
      alert.level === "CRITICAL" &&
      alert.status === "ACTIVE"
  ).length;

  const activeCount = alerts.filter(
    (alert) => alert.status === "ACTIVE"
  ).length;

  const resolvedCount = alerts.filter(
    (alert) => alert.status === "RESOLVED"
  ).length;

  const acknowledgeAlert = (id) => {
    setAlerts((current) =>
      current.map((alert) =>
        alert.id === id
          ? {
              ...alert,
              unread: false,
              status: "ACKNOWLEDGED",
            }
          : alert
      )
    );

    setSelectedAlert((current) =>
      current && current.id === id
        ? {
            ...current,
            unread: false,
            status: "ACKNOWLEDGED",
          }
        : current
    );
  };

  return (
    <>
      <Sidebar />

      <main className="alerts-page">

        {/* HEADER */}
        <header className="alerts-header">

          <div>
            <span className="page-eyebrow">
              SAFETY MONITORING
            </span>

            <h1>Alerts</h1>

            <p>
              Monitor warnings and risk notifications
              across monitored areas.
            </p>
          </div>

          <div className="alerts-live-status">
            <span></span>
            Alert System Online
          </div>

        </header>

        {/* SUMMARY */}
        <section className="alert-summary">

          <div className="alert-summary-card">
            <div className="summary-icon total">
              🔔
            </div>

            <div>
              <strong>
                {loading ? "..." : activeCount}
              </strong>

              <span>Active Alerts</span>
            </div>
          </div>

          <div className="alert-summary-card">
            <div className="summary-icon critical">
              !
            </div>

            <div>
              <strong>
                {loading ? "..." : criticalCount}
              </strong>

              <span>Critical Alerts</span>
            </div>
          </div>

          <div className="alert-summary-card">
            <div className="summary-icon unread">
              ●
            </div>

            <div>
              <strong>
                {loading ? "..." : unreadCount}
              </strong>

              <span>Unread Alerts</span>
            </div>
          </div>

          <div className="alert-summary-card">
            <div className="summary-icon resolved">
              ✓
            </div>

            <div>
              <strong>
                {loading ? "..." : resolvedCount}
              </strong>

              <span>Resolved</span>
            </div>
          </div>

        </section>

        {/* TOOLBAR */}
        <section className="alerts-toolbar">

          <div className="alert-filters">

            {[
              "ALL",
              "UNREAD",
              "CRITICAL",
              "HIGH",
              "MODERATE",
            ].map((item) => (
              <button
                key={item}
                className={
                  filter === item ? "active" : ""
                }
                onClick={() => setFilter(item)}
              >
                {item === "ALL"
                  ? "All Alerts"
                  : item === "UNREAD"
                    ? "Unread"
                    : item}
              </button>
            ))}

          </div>

          <div className="alerts-search">

            <span>⌕</span>

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search alerts..."
            />

          </div>

        </section>

        {/* CONTENT */}
        <section className="alerts-content">

          {/* ALERT LIST */}
          <div className="alerts-list-panel">

            <div className="alerts-list-header">

              <div>

                <span className="panel-label">
                  NOTIFICATIONS
                </span>

                <h2>
                  Recent Alerts
                </h2>

              </div>

              <span className="alerts-count">
                {loading
                  ? "..."
                  : filteredAlerts.length}
              </span>

            </div>

            <div className="alerts-list">

              {loading ? (
                <div className="alerts-empty">

                  <span>🔄</span>

                  <strong>
                    Loading alerts...
                  </strong>

                  <small>
                    Connecting to the HimDrishti
                    alert engine.
                  </small>

                </div>
              ) : error ? (
                <div className="alerts-empty">

                  <span>⚠️</span>

                  <strong>
                    Alert system unavailable
                  </strong>

                  <small>
                    {error}
                  </small>

                </div>
              ) : filteredAlerts.length === 0 ? (
                <div className="alerts-empty">

                  <span>🔔</span>

                  <strong>
                    No alerts found
                  </strong>

                  <small>
                    Try changing the filter or
                    search term.
                  </small>

                </div>
              ) : (
                filteredAlerts.map((alert) => (
                  <button
                    key={alert.id}
                    className={`alert-list-item ${
                      selectedAlert?.id === alert.id
                        ? "selected"
                        : ""
                    } ${
                      alert.unread
                        ? "unread"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedAlert(alert)
                    }
                  >

                    <div
                      className={`alert-severity-dot ${alert.level.toLowerCase()}`}
                    ></div>

                    <div className="alert-list-main">

                      <div className="alert-list-top">

                        <span
                          className={`alert-level ${alert.level.toLowerCase()}`}
                        >
                          {alert.level}
                        </span>

                        {alert.unread && (
                          <span className="unread-label">
                            NEW
                          </span>
                        )}

                      </div>

                      <strong>
                        {alert.title}
                      </strong>

                      <span className="alert-location">
                        📍 {alert.location},{" "}
                        {alert.state}
                      </span>

                      <small>
                        {alert.time} · {alert.date}
                      </small>

                    </div>

                    <span className="alert-arrow">
                      →
                    </span>

                  </button>
                ))
              )}

            </div>

          </div>

          {/* DETAIL */}
          {selectedAlert && (
            <div className="alert-detail-panel">

              <div className="detail-header">

                <div>

                  <span
                    className={`detail-level ${selectedAlert.level.toLowerCase()}`}
                  >
                    ● {selectedAlert.level} RISK
                  </span>

                  <h2>
                    {selectedAlert.title}
                  </h2>

                </div>

                <span
                  className={`detail-status ${selectedAlert.status.toLowerCase()}`}
                >
                  {selectedAlert.status}
                </span>

              </div>

              <div className="detail-location">

                <div className="detail-location-icon">
                  📍
                </div>

                <div>

                  <span>LOCATION</span>

                  <strong>
                    {selectedAlert.location}
                  </strong>

                  <small>
                    {selectedAlert.state}
                  </small>

                </div>

              </div>

              <div className="detail-description">

                <span>
                  ALERT DESCRIPTION
                </span>

                <p>
                  {selectedAlert.description}
                </p>

              </div>

              {/* RISK SCORE */}
              <div className="detail-risk-score">

                <div className="risk-score-heading">

                  <span>
                    RISK SCORE
                  </span>

                  <strong>
                    {selectedAlert.risk}/100
                  </strong>

                </div>

                <div className="risk-progress">

                  <div
                    className={`risk-progress-fill ${selectedAlert.level.toLowerCase()}`}
                    style={{
                      width: `${selectedAlert.risk}%`,
                    }}
                  ></div>

                </div>

              </div>

              {/* DATA */}
              <div className="detail-data">

                <div>

                  <span>
                    Rainfall
                  </span>

                  <strong>
                    {selectedAlert.rainfall}
                  </strong>

                  <small>
                    Last 24 hours
                  </small>

                </div>

                <div>

                  <span>
                    Soil Moisture
                  </span>

                  <strong>
                    {selectedAlert.soil}
                  </strong>

                  <small>
                    Current level
                  </small>

                </div>

                <div>

                  <span>
                    Source
                  </span>

                  <strong>
                    GIS + Data
                  </strong>

                  <small>
                    {selectedAlert.source}
                  </small>

                </div>

              </div>

              {/* ACTION */}
              <div className="alert-action-box">

                <span>
                  RECOMMENDED ACTION
                </span>

                <p>
                  {selectedAlert.action}
                </p>

              </div>

              <div className="detail-meta">

                <span>
                  Detected {selectedAlert.time}
                </span>

                <span>
                  Automated Risk Engine
                </span>

              </div>

              {selectedAlert.status !== "RESOLVED" &&
                selectedAlert.status !== "ACKNOWLEDGED" && (
                  <button
                    className="acknowledge-btn"
                    onClick={() =>
                      acknowledgeAlert(
                        selectedAlert.id
                      )
                    }
                  >
                    ✓ Acknowledge Alert
                  </button>
                )}

            </div>
          )}

        </section>

      </main>

      <MobileNav />
    </>
  );
}