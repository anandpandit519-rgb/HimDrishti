"use client";

import Sidebar from "../../components/layout/Sidebar";
import MobileNav from "../../components/layout/MobileNav";

const capabilities = [
  {
    icon: "🗺️",
    title: "Risk Mapping",
    text: "Visualize landslide risk across monitored geographic regions.",
  },
  {
    icon: "🌧️",
    title: "Weather Monitoring",
    text: "Track rainfall and environmental conditions linked with slope instability.",
  },
  {
    icon: "⚠️",
    title: "Early Alerts",
    text: "Generate risk notifications when monitored conditions cross defined thresholds.",
  },
  {
    icon: "📍",
    title: "Location Analysis",
    text: "Check the current risk profile and environmental conditions of a location.",
  },
  {
    icon: "👥",
    title: "Citizen Reports",
    text: "Allow communities to report ground-level hazards and observations.",
  },
  {
    icon: "📊",
    title: "Risk Intelligence",
    text: "Combine environmental and geographic signals into a unified risk assessment.",
  },
];

const riskLevels = [
  {
    level: "LOW",
    score: "0–39",
    description: "Normal monitoring conditions.",
    className: "low",
  },
  {
    level: "MODERATE",
    score: "40–59",
    description: "Increased monitoring recommended.",
    className: "moderate",
  },
  {
    level: "HIGH",
    score: "60–79",
    description: "Elevated risk. Stay alert.",
    className: "high",
  },
  {
    level: "CRITICAL",
    score: "80–100",
    description: "Immediate attention recommended.",
    className: "critical",
  },
];

export default function AboutPage() {
  return (
    <>
      <Sidebar />

      <main className="about-page">

        {/* HEADER */}
        <header className="about-header">

          <div>
            <span className="page-eyebrow">
              ABOUT THE SYSTEM
            </span>

            <h1>HimDrishti</h1>

            <p>
              Landslide Early Warning & Risk Monitoring System
            </p>
          </div>

          <div className="about-system-status">
            <span></span>
            System Architecture
          </div>

        </header>

        {/* HERO */}
        <section className="about-hero">

          <div className="about-hero-content">

            <span className="about-label">
              THE IDEA
            </span>

            <h2>
              Turning environmental data into
              <strong> actionable risk intelligence.</strong>
            </h2>

            <p>
              HimDrishti is designed to help communities and
              authorities monitor landslide-prone regions by
              bringing together weather, terrain, geographic
              and field observations in one platform.
            </p>

            <div className="about-hero-tags">

              <span>🌧️ Weather</span>
              <span>🗺️ GIS</span>
              <span>🤖 Risk Engine</span>
              <span>🚨 Alerts</span>

            </div>

          </div>

          <div className="about-hero-visual">

            <div className="hero-circle outer"></div>
            <div className="hero-circle middle"></div>
            <div className="hero-circle inner">
              <span>HD</span>
            </div>

            <div className="hero-node node-one">
              🌧️
            </div>

            <div className="hero-node node-two">
              🗺️
            </div>

            <div className="hero-node node-three">
              ⚠️
            </div>

          </div>

        </section>

        {/* HOW IT WORKS */}
        <section className="about-section">

          <div className="section-heading">

            <span>
              HOW IT WORKS
            </span>

            <h2>
              From data to early warning
            </h2>

            <p>
              HimDrishti connects multiple information layers
              to provide a clearer picture of changing landslide risk.
            </p>

          </div>

          <div className="workflow">

            <div className="workflow-step">

              <div className="workflow-number">
                01
              </div>

              <div className="workflow-icon">
                📡
              </div>

              <h3>
                Collect
              </h3>

              <p>
                Gather weather, terrain and environmental observations.
              </p>

            </div>

            <div className="workflow-line"></div>

            <div className="workflow-step">

              <div className="workflow-number">
                02
              </div>

              <div className="workflow-icon">
                ⚙️
              </div>

              <h3>
                Analyze
              </h3>

              <p>
                Process multiple risk indicators through the risk engine.
              </p>

            </div>

            <div className="workflow-line"></div>

            <div className="workflow-step">

              <div className="workflow-number">
                03
              </div>

              <div className="workflow-icon">
                🧠
              </div>

              <h3>
                Assess
              </h3>

              <p>
                Convert environmental signals into a risk level and score.
              </p>

            </div>

            <div className="workflow-line"></div>

            <div className="workflow-step">

              <div className="workflow-number">
                04
              </div>

              <div className="workflow-icon">
                🚨
              </div>

              <h3>
                Alert
              </h3>

              <p>
                Surface warnings and recommended actions to users.
              </p>

            </div>

          </div>

        </section>

        {/* CAPABILITIES */}
        <section className="about-section">

          <div className="section-heading">

            <span>
              PLATFORM CAPABILITIES
            </span>

            <h2>
              What HimDrishti brings together
            </h2>

          </div>

          <div className="capabilities-grid">

            {capabilities.map((item) => (
              <div
                className="capability-card"
                key={item.title}
              >

                <div className="capability-icon">
                  {item.icon}
                </div>

                <h3>
                  {item.title}
                </h3>

                <p>
                  {item.text}
                </p>

              </div>
            ))}

          </div>

        </section>

        {/* RISK LEVELS */}
        <section className="about-section">

          <div className="section-heading">

            <span>
              RISK CLASSIFICATION
            </span>

            <h2>
              Understanding risk levels
            </h2>

          </div>

          <div className="risk-levels">

            {riskLevels.map((item) => (
              <div
                className={`about-risk-level ${item.className}`}
                key={item.level}
              >

                <div className="risk-level-top">

                  <span className="risk-level-dot"></span>

                  <strong>
                    {item.level}
                  </strong>

                  <b>
                    {item.score}
                  </b>

                </div>

                <p>
                  {item.description}
                </p>

              </div>
            ))}

          </div>

        </section>

        {/* DATA SOURCES */}
        <section className="about-data-section">

          <div>

            <span className="about-label">
              DATA LAYERS
            </span>

            <h2>
              Built to combine multiple sources
            </h2>

            <p>
              The production version of HimDrishti can connect
              external weather, geographic, terrain and monitoring
              datasets to continuously update risk information.
            </p>

          </div>

          <div className="data-source-grid">

            <div>
              <span>01</span>
              <strong>Weather Data</strong>
              <small>
                Rainfall, humidity, temperature and forecasts
              </small>
            </div>

            <div>
              <span>02</span>
              <strong>GIS Data</strong>
              <small>
                Geographic boundaries and risk locations
              </small>
            </div>

            <div>
              <span>03</span>
              <strong>Terrain Data</strong>
              <small>
                Elevation, slope and terrain characteristics
              </small>
            </div>

            <div>
              <span>04</span>
              <strong>Citizen Reports</strong>
              <small>
                Ground-level observations and hazard reports
              </small>
            </div>

          </div>

        </section>

        {/* FOOTER */}
        <footer className="about-footer">

          <div>
            <strong>HimDrishti</strong>
            <span>
              Landslide Early Warning & Risk Monitoring System
            </span>
          </div>

          <span>
            VISTA · HimDrishti
          </span>

        </footer>

      </main>

      <MobileNav />
    </>
  );
}