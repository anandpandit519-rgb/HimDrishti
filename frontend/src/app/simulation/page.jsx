"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import MobileNav from "../../components/layout/MobileNav";
import "./simulation.css";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const PRESETS = {
  normal: {
    name: "Normal Conditions",
    icon: "🟢",
    description: "Stable environmental conditions",
    rainfall: 35,
    soil_moisture: 45,
    slope: 35,
    terrain: 35,
    recent_events: 10,
  },

  heavy: {
    name: "Heavy Rainfall",
    icon: "🌧️",
    description: "Intense rainfall and rising soil saturation",
    rainfall: 165,
    soil_moisture: 92,
    slope: 70,
    terrain: 75,
    recent_events: 60,
  },

  continuous: {
    name: "Continuous Rain",
    icon: "⛈️",
    description: "Prolonged rainfall over monitored region",
    rainfall: 220,
    soil_moisture: 95,
    slope: 78,
    terrain: 82,
    recent_events: 75,
  },

  slope: {
    name: "Extreme Slope Event",
    icon: "⛰️",
    description: "Highly unstable steep terrain",
    rainfall: 110,
    soil_moisture: 82,
    slope: 95,
    terrain: 90,
    recent_events: 65,
  },
};

const FACTORS = [
  {
    key: "rainfall",
    label: "Rainfall",
    icon: "🌧️",
    unit: "mm",
    max: 300,
    description: "Accumulated rainfall",
  },
  {
    key: "soil_moisture",
    label: "Soil Moisture",
    icon: "💧",
    unit: "%",
    max: 100,
    description: "Ground saturation",
  },
  {
    key: "slope",
    label: "Slope",
    icon: "⛰️",
    unit: "°",
    max: 100,
    description: "Terrain steepness index",
  },
  {
    key: "terrain",
    label: "Terrain Instability",
    icon: "🗺️",
    unit: "%",
    max: 100,
    description: "Terrain susceptibility",
  },
  {
    key: "recent_events",
    label: "Recent Events",
    icon: "📍",
    unit: "%",
    max: 100,
    description: "Recent landslide activity",
  },
];

function calculateLocalRisk(values) {
  const rainfallScore = Math.min(
    (Number(values.rainfall) / 200) * 100,
    100
  );

  const score =
    rainfallScore * 0.35 +
    Number(values.soil_moisture) * 0.25 +
    Number(values.slope) * 0.20 +
    Number(values.terrain) * 0.10 +
    Number(values.recent_events) * 0.10;

  const riskScore = Math.round(score * 100) / 100;

  let riskLevel = "LOW";

  if (riskScore >= 80) {
    riskLevel = "CRITICAL";
  } else if (riskScore >= 60) {
    riskLevel = "HIGH";
  } else if (riskScore >= 40) {
    riskLevel = "MODERATE";
  }

  return {
    risk_score: riskScore,
    risk_level: riskLevel,
    alert_required: riskScore >= 60,
  };
}

export default function SimulationPage() {
  const [values, setValues] = useState(PRESETS.normal);
  const [selectedPreset, setSelectedPreset] = useState("normal");

  const [result, setResult] = useState(
    calculateLocalRisk(PRESETS.normal)
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alertSent, setAlertSent] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);

  const localRisk = useMemo(
    () => calculateLocalRisk(values),
    [values]
  );

  const activeRisk = result || localRisk;

  const riskLevel = (
    activeRisk?.risk_level || "LOW"
  ).toUpperCase();

  const riskScore = Number(
    activeRisk?.risk_score || 0
  );

  const riskClass = riskLevel.toLowerCase();

  const riskColor =
    riskLevel === "CRITICAL"
      ? "#ef4444"
      : riskLevel === "HIGH"
      ? "#ff8a1f"
      : riskLevel === "MODERATE"
      ? "#d5a900"
      : "#159b5b";

  const riskMessage =
    riskLevel === "CRITICAL"
      ? "Immediate attention required. Critical instability detected."
      : riskLevel === "HIGH"
      ? "High landslide risk detected. Alert condition satisfied."
      : riskLevel === "MODERATE"
      ? "Moderate environmental risk. Continue monitoring."
      : "Environmental conditions are currently stable.";

      const previousRiskLevel = useRef("LOW");
const notificationInitialized = useRef(false);

const RISK_ORDER = {
  LOW: 0,
  MODERATE: 1,
  HIGH: 2,
  CRITICAL: 3,
};

const RISK_NOTIFICATIONS = {
  MODERATE: {
    title: "⚠️ HimDrishti Advisory",
    body:
      "Environmental conditions are worsening. Continue monitoring local conditions and avoid unnecessary movement near vulnerable slopes.",
  },

  HIGH: {
    title: "🚨 HimDrishti HIGH RISK",
    body:
      "High landslide risk detected. Residents near vulnerable slopes should move to safer areas and follow local safety advisories.",
  },

  CRITICAL: {
    title: "🛑 HimDrishti CRITICAL ALERT",
    body:
      "CRITICAL landslide risk detected. Vacate high-risk slope areas immediately and move to a safer location. Follow official emergency instructions.",
  },
};

  function applyPreset(key) {
    const preset = PRESETS[key];

    setSelectedPreset(key);
    setValues(preset);
    setResult(calculateLocalRisk(preset));
    setAlertSent(false);
    setError("");
  }

  function updateValue(key, value) {
    const next = {
      ...values,
      [key]: Number(value),
    };

    setSelectedPreset(null);
    setValues(next);
    setResult(calculateLocalRisk(next));
    setAlertSent(false);
  }

  async function runSimulation() {
    setLoading(true);
    setError("");
    setAlertSent(false);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/simulation/scenario`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rainfall: Number(values.rainfall),
            soil_moisture: Number(values.soil_moisture),
            slope: Number(values.slope),
            terrain: Number(values.terrain),
            recent_events: Number(values.recent_events),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Simulation API failed");
      }

      const data = await response.json();

      setResult({
        risk_score:
          data.risk_score ??
          data.riskScore ??
          localRisk.risk_score,

        risk_level:
          data.risk_level ??
          data.riskLevel ??
          localRisk.risk_level,

        alert_required:
          data.alert_required ??
          data.alertRequired ??
          localRisk.alert_required,
      });
    } catch (err) {
      console.error(err);

      /*
       * Backend unavailable? Demo doesn't die.
       * Local risk engine keeps the simulation working.
       */
      setResult(localRisk);
      setError(
        "Backend unavailable. Running local simulation mode."
      );
    } finally {
      setLoading(false);
    }
  }

  async function runDemo() {
    setDemoRunning(true);
    setAlertSent(false);
    setError("");

    const steps = [
      {
        rainfall: 35,
        soil_moisture: 45,
        slope: 35,
        terrain: 35,
        recent_events: 10,
      },
      {
        rainfall: 90,
        soil_moisture: 65,
        slope: 50,
        terrain: 55,
        recent_events: 25,
      },
      {
        rainfall: 150,
        soil_moisture: 82,
        slope: 70,
        terrain: 72,
        recent_events: 50,
      },
      {
        rainfall: 220,
        soil_moisture: 95,
        slope: 85,
        terrain: 90,
        recent_events: 75,
      },
    ];

    for (const step of steps) {
      setValues(step);
      setResult(calculateLocalRisk(step));

      await new Promise((resolve) =>
        setTimeout(resolve, 850)
      );
    }

    setDemoRunning(false);

    const finalRisk = calculateLocalRisk(steps[3]);

    if (finalRisk.alert_required) {
      triggerBrowserNotification(finalRisk);
    }
  }

  async function enableNotifications() {
    setError("");

    if (!("Notification" in window)) {
      setError(
        "This browser does not support notifications."
      );
      return;
    }

    const permission =
      await Notification.requestPermission();

    if (permission === "granted") {
      new Notification("🔔 HimDrishti Alerts Enabled", {
        body:
          "You will receive simulation risk notifications on this device.",
      });
    } else {
      setError(
        "Notification permission was not granted."
      );
    }
  }

  function sendAutomaticRiskNotification(
  level,
  score
) {
  const notification =
    RISK_NOTIFICATIONS[level];

  if (!notification) return;

  /*
   * Browser permission must already be granted.
   * We NEVER request permission automatically here.
   */
  if (
    !("Notification" in window) ||
    Notification.permission !== "granted"
  ) {
    return;
  }

  new Notification(
    notification.title,
    {
      body:
        `${notification.body}\n\n` +
        `Risk Score: ${Number(score).toFixed(1)}/100\n` +
        `Simulation Alert`,
      tag: `himdrishti-${level.toLowerCase()}`,
      renotify: true,
    }
  );

  setAlertSent(true);
}

function triggerBrowserNotification(
  riskData = activeRisk
) {
  if (!("Notification" in window)) {
    setError(
      "Browser notifications are not supported on this device."
    );
    return;
  }

  if (Notification.permission !== "granted") {
    setError(
      "First enable notifications using the button above."
    );
    return;
  }

  const level =
    riskData.risk_level || "HIGH";

  const score = Number(
    riskData.risk_score || 0
  );

  const notification =
    RISK_NOTIFICATIONS[level] ||
    RISK_NOTIFICATIONS.HIGH;

  new Notification(
    notification.title,
    {
      body:
        `${notification.body}\n\n` +
        `Risk Score: ${score.toFixed(1)}/100\n` +
        `Simulation Alert`,
      tag: `himdrishti-${level.toLowerCase()}`,
      renotify: true,
    }
  );

  setAlertSent(true);
}

  useEffect(() => {
  const currentLevel = riskLevel;

  if (!notificationInitialized.current) {
    previousRiskLevel.current = currentLevel;
    notificationInitialized.current = true;
    return;
  }

  const previousLevel = previousRiskLevel.current;

  const currentRank =
    RISK_ORDER[currentLevel] ?? 0;

  const previousRank =
    RISK_ORDER[previousLevel] ?? 0;

  /*
   * Only notify when the risk level actually increases.
   *
   * LOW → MODERATE
   * MODERATE → HIGH
   * HIGH → CRITICAL
   */
  if (
    currentRank > previousRank &&
    RISK_NOTIFICATIONS[currentLevel]
  ) {
    sendAutomaticRiskNotification(
      currentLevel,
      riskScore
    );
  }

  previousRiskLevel.current = currentLevel;
}, [riskLevel, riskScore]);

  const progress = Math.min(
    Math.max(riskScore, 0),
    100
  );

  return (
    <>
      <Sidebar />

      <main className="simulation-page">

        {/* HEADER */}
        <header className="simulation-header">
          <div>
            <span className="page-eyebrow">
              RISK ENGINE LAB
            </span>

            <h1>Simulation</h1>

            <p>
              Test how HimDrishti responds when environmental
              conditions change.
            </p>
          </div>

          <div className="simulation-live">
            <span></span>
            Simulation Engine Online
          </div>
        </header>

        {/* HERO */}
        <section className={`simulation-hero ${riskClass}`}>

          <div className="hero-copy">
            <span>LIVE SCENARIO SIMULATION</span>

            <h2>
              See how changing conditions
              <br />
              change landslide risk.
            </h2>

            <p>
              Modify rainfall, soil moisture and terrain
              conditions to test the HimDrishti risk engine.
            </p>

            <div className="hero-actions">
              <button
                className="demo-button"
                onClick={runDemo}
                disabled={demoRunning}
              >
                {demoRunning
                  ? "⏳ Running Scenario..."
                  : "▶ Run Disaster Scenario"}
              </button>

              <button
                className="notification-button"
                onClick={enableNotifications}
              >
                🔔 Enable Phone Alerts
              </button>
            </div>
          </div>

          <div className="hero-risk">

            <span>CURRENT RISK</span>

            <strong>{riskScore.toFixed(1)}</strong>

            <div
              className="hero-risk-level"
              style={{ color: riskColor }}
            >
              ● {riskLevel}
            </div>

            <div className="hero-risk-bar">
              <div
                style={{
                  width: `${progress}%`,
                  background: riskColor,
                }}
              ></div>
            </div>

            <small>
              Risk threshold:
              <b> 60+</b> triggers alert
            </small>
          </div>

        </section>

        {/* ERROR / STATUS */}
        {error && (
          <div className="simulation-message warning">
            ⚠️ {error}
          </div>
        )}

        {alertSent && (
          <div className="simulation-message success">
            ✓ Simulation alert notification sent to this device.
          </div>
        )}

        {/* PRESETS */}
        <section className="simulation-section">

          <div className="section-heading">
            <div>
              <span>SCENARIO PRESETS</span>
              <h2>Choose a condition</h2>
            </div>

            <small>
              One click changes the complete environment
            </small>
          </div>

          <div className="preset-grid">

            {Object.entries(PRESETS).map(
              ([key, preset]) => (
                <button
                  key={key}
                  className={`preset-card ${
                    selectedPreset === key
                      ? "active"
                      : ""
                  }`}
                  onClick={() => applyPreset(key)}
                >
                  <div className="preset-icon">
                    {preset.icon}
                  </div>

                  <div className="preset-content">
                    <strong>{preset.name}</strong>
                    <span>{preset.description}</span>
                  </div>

                  {selectedPreset === key && (
                    <div className="preset-check">
                      ✓
                    </div>
                  )}
                </button>
              )
            )}

          </div>

        </section>

        {/* MAIN GRID */}
        <section className="simulation-main-grid">

          {/* CONTROLS */}
          <div className="simulation-panel">

            <div className="panel-header">
              <div>
                <span>ENVIRONMENTAL INPUTS</span>
                <h2>Adjust Conditions</h2>
              </div>

              <span className="live-pill">
                LIVE
              </span>
            </div>

            <div className="factor-list">

              {FACTORS.map((factor) => {

                const value = Number(
                  values[factor.key]
                );

                const percentage =
                  (value / factor.max) * 100;

                return (
                  <div
                    className="factor-control"
                    key={factor.key}
                  >

                    <div className="factor-top">

                      <div className="factor-name">

                        <div className="factor-icon">
                          {factor.icon}
                        </div>

                        <div>
                          <strong>
                            {factor.label}
                          </strong>

                          <small>
                            {factor.description}
                          </small>
                        </div>

                      </div>

                      <div className="factor-value">
                        {value}
                        <small>
                          {factor.unit}
                        </small>
                      </div>

                    </div>

                    <input
                      type="range"
                      min="0"
                      max={factor.max}
                      value={value}
                      onChange={(e) =>
                        updateValue(
                          factor.key,
                          e.target.value
                        )
                      }
                      style={{
                        "--progress": `${percentage}%`,
                      }}
                    />

                    <div className="range-labels">
                      <span>Low</span>
                      <span>High</span>
                    </div>

                  </div>
                );
              })}

            </div>

            <button
              className="calculate-button"
              onClick={runSimulation}
              disabled={loading}
            >
              {loading
                ? "⏳ Processing Risk Engine..."
                : "⚡ Run Risk Analysis"}
            </button>

          </div>

          {/* RESULT */}
          <div className="result-column">

            {/* RISK CARD */}
            <div
              className={`risk-result-card ${riskClass}`}
            >

              <div className="result-top">

                <div>
                  <span>RISK ENGINE OUTPUT</span>
                  <h2>
                    {riskLevel} RISK
                  </h2>
                </div>

                <div
                  className="result-score"
                  style={{ color: riskColor }}
                >
                  {riskScore.toFixed(1)}
                  <small>/100</small>
                </div>

              </div>

              <div className="result-bar">
                <div
                  style={{
                    width: `${progress}%`,
                    background: riskColor,
                  }}
                ></div>
              </div>

              <p>
                {riskMessage}
              </p>

            </div>

            {/* DECISION */}
            <div className="decision-card">

              <div className="decision-header">
                <div>
                  <span>SYSTEM DECISION</span>
                  <h3>
                    Response Status
                  </h3>
                </div>

                <div
                  className={`decision-status ${
                    activeRisk.alert_required
                      ? "alert"
                      : "safe"
                  }`}
                >
                  {activeRisk.alert_required
                    ? "🚨 ALERT"
                    : "✓ NORMAL"}
                </div>
              </div>

              <div className="decision-steps">

                <div className="decision-step done">
                  <span>✓</span>
                  <div>
                    <strong>
                      Environmental data received
                    </strong>
                    <small>
                      Simulation inputs processed
                    </small>
                  </div>
                </div>

                <div className="decision-step done">
                  <span>✓</span>
                  <div>
                    <strong>
                      Risk engine evaluated
                    </strong>
                    <small>
                      Multi-factor risk calculation
                    </small>
                  </div>
                </div>

                <div
                  className={`decision-step ${
                    activeRisk.alert_required
                      ? "danger"
                      : "done"
                  }`}
                >
                  <span>
                    {activeRisk.alert_required
                      ? "!"
                      : "✓"}
                  </span>

                  <div>
                    <strong>
                      Alert threshold
                    </strong>

                    <small>
                      {activeRisk.alert_required
                        ? "Risk exceeded alert threshold"
                        : "No alert threshold crossed"}
                    </small>
                  </div>
                </div>

              </div>

              {activeRisk.alert_required && (
                <button
                  className="send-alert-button"
                  onClick={() =>
                    triggerBrowserNotification()
                  }
                >
                  🚨 Send Simulation Alert
                </button>
              )}

            </div>

          </div>

        </section>

        {/* WHY RISK */}
        <section className="why-section">

          <div className="section-heading">
            <div>
              <span>MODEL EXPLAINABILITY</span>
              <h2>Why did the risk change?</h2>
            </div>

            <small>
              Contribution of each simulated factor
            </small>
          </div>

          <div className="factor-analysis-grid">

            {FACTORS.map((factor) => {

              const value = Number(
                values[factor.key]
              );

              const percentage =
                factor.key === "rainfall"
                  ? Math.min(
                      (value / 200) * 100,
                      100
                    )
                  : value;

              return (
                <div
                  className="factor-analysis-card"
                  key={factor.key}
                >

                  <div className="analysis-card-top">

                    <span>
                      {factor.icon}
                    </span>

                    <strong>
                      {value}
                      {factor.unit}
                    </strong>

                  </div>

                  <h3>
                    {factor.label}
                  </h3>

                  <div className="analysis-bar">
                    <div
                      style={{
                        width: `${percentage}%`,
                      }}
                    ></div>
                  </div>

                  <small>
                    {percentage >= 80
                      ? "High contribution"
                      : percentage >= 60
                      ? "Elevated contribution"
                      : percentage >= 40
                      ? "Moderate contribution"
                      : "Low contribution"}
                  </small>

                </div>
              );
            })}

          </div>

        </section>

        {/* RESPONSE */}
        <section
          className={`response-card ${
            riskLevel.toLowerCase()
          }`}
        >

          <div className="response-icon">
            {riskLevel === "CRITICAL"
              ? "🚨"
              : riskLevel === "HIGH"
              ? "⚠️"
              : riskLevel === "MODERATE"
              ? "👀"
              : "✓"}
          </div>

          <div className="response-copy">

            <span>
              SIMULATED RESPONSE
            </span>

            <h2>
              {riskLevel === "CRITICAL"
                ? "Immediate attention required"
                : riskLevel === "HIGH"
                ? "Local warning should be issued"
                : riskLevel === "MODERATE"
                ? "Continue close monitoring"
                : "Normal monitoring continues"}
            </h2>

            <p>
              {riskLevel === "CRITICAL" ||
              riskLevel === "HIGH"
                ? "If this were a real event, subscribed users in the affected area could receive an early warning notification."
                : "No emergency notification is triggered while the simulated risk remains below the alert threshold."}
            </p>

          </div>

          <div className="response-state">
            {activeRisk.alert_required
              ? "ALERT READY"
              : "MONITORING"}
          </div>

        </section>

        {/* FOOTER */}
        <footer className="simulation-footer">

          <span>
            HimDrishti Risk Simulation Engine
          </span>

          <span>
            Simulation data does not modify real monitoring records.
          </span>

          <span>
            ● System Operational
          </span>

        </footer>

      </main>

      <MobileNav />
    </>
  );
}