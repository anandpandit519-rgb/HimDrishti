"use client";

import { useEffect, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

function getAlertClass(level) {
  switch (level) {
    case "CRITICAL":
      return {
        levelClass: "critical",
        className: "",
      };

    case "HIGH":
      return {
        levelClass: "high-b",
        className: "high",
      };

    case "MODERATE":
      return {
        levelClass: "mod-b",
        className: "mod",
      };

    default:
      return {
        levelClass: "low-b",
        className: "low",
      };
  }
}

function getCurrentTime() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function LatestAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAlerts() {
      try {
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

        setAlerts(data);
        setError("");
      } catch (err) {
        console.error("Failed to load alerts:", err);
        setError("Unable to load alerts.");
      } finally {
        setLoading(false);
      }
    }

    loadAlerts();
  }, []);

  return (
    <div className="card alerts">

      <div className="card-head">

        <h3>🔔 Latest Alerts</h3>

        <a
          href="/alerts"
          style={{
            color: "#1685e5",
            fontSize: "13px",
          }}
        >
          View All →
        </a>

      </div>

      {loading && (
        <div
          style={{
            padding: "24px",
            textAlign: "center",
            color: "#8791a0",
          }}
        >
          Loading alerts...
        </div>
      )}

      {!loading && error && (
        <div
          style={{
            padding: "24px",
            textAlign: "center",
            color: "#c0392b",
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && alerts.length === 0 && (
        <div
          style={{
            padding: "24px",
            textAlign: "center",
            color: "#8791a0",
          }}
        >
          No active alerts.
        </div>
      )}

      {!loading &&
        !error &&
        alerts.map((alert) => {
          const styles = getAlertClass(alert.risk_level);

          return (
            <div
              className={`alert ${styles.className}`}
              key={alert.id}
            >

              <span
                className={`badge ${styles.levelClass}`}
              >
                {alert.risk_level}
              </span>

              <strong>
                {alert.location} District

                <small
                  style={{
                    float: "right",
                    color: "#8791a0",
                  }}
                >
                  {getCurrentTime()}
                </small>
              </strong>

              <p>
                {alert.message}
              </p>

            </div>
          );
        })}

    </div>
  );
}