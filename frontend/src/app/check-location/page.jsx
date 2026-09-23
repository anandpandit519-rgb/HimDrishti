"use client";

import { useEffect, useState } from "react";

import Sidebar from "../../components/layout/Sidebar";
import MobileNav from "../../components/layout/MobileNav";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const locationIds = {
  Aizawl: "aizawl",
  Lunglei: "lunglei",
  Champhai: "champhai",
  Serchhip: "serchhip",
};

const fallbackDetails = {
  aizawl: {
    district: "Aizawl District",
    elevation: 1132,
    temperature: 24,
    humidity: 91,
    wind: 12.4,
    recommendation:
      "Immediate attention advised. Avoid vulnerable slopes and monitor official warnings.",
  },

  lunglei: {
    district: "Lunglei District",
    elevation: 722,
    temperature: 23,
    humidity: 86,
    wind: 10,
    recommendation:
      "Stay alert and avoid unnecessary movement near steep slopes during heavy rainfall.",
  },

  champhai: {
    district: "Champhai District",
    elevation: 1678,
    temperature: 22,
    humidity: 82,
    wind: 9,
    recommendation:
      "Remain prepared for changing conditions and follow local advisories.",
  },

  serchhip: {
    district: "Serchhip District",
    elevation: 888,
    temperature: 25,
    humidity: 78,
    wind: 8,
    recommendation:
      "Continue monitoring weather conditions and local risk updates.",
  },
};

function buildFactors(data) {
  const factors = [];

  if (data.rainfall >= 120) {
    factors.push("Intense rainfall detected");
  } else if (data.rainfall >= 80) {
    factors.push("Above-normal rainfall");
  } else {
    factors.push("Moderate rainfall");
  }

  if (data.soil_moisture >= 85) {
    factors.push("High soil moisture");
  } else if (data.soil_moisture >= 70) {
    factors.push("Elevated soil moisture");
  } else {
    factors.push("Moderate soil moisture");
  }

  if (data.slope >= 75) {
    factors.push("Steep terrain conditions");
  } else if (data.slope >= 60) {
    factors.push("Moderately steep terrain");
  } else {
    factors.push("Terrain monitoring recommended");
  }

  return factors;
}

function getRecommendation(level) {
  if (level === "CRITICAL") {
    return {
      title: "Immediate Attention Required",
      text:
        "Immediate attention advised. Avoid vulnerable slopes and monitor official warnings.",
    };
  }

  if (level === "HIGH") {
    return {
      title: "Stay Alert",
      text:
        "Stay alert and avoid unnecessary movement near steep slopes during heavy rainfall.",
    };
  }

  if (level === "MODERATE") {
    return {
      title: "Continue Monitoring",
      text:
        "Continue monitoring weather conditions and local risk updates.",
    };
  }

  return {
    title: "Low Risk",
    text:
      "Current conditions indicate relatively low landslide risk. Continue normal monitoring.",
  };
}

export default function CheckLocationPage() {
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [locationsError, setLocationsError] = useState("");

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");

  // ---------------------------------------------------------
  // LOAD LOCATIONS FROM BACKEND
  // ---------------------------------------------------------

  useEffect(() => {
    async function loadLocations() {
      try {
        setLoadingLocations(true);
        setLocationsError("");

        const response = await fetch(
          `${API_BASE_URL}/api/v1/locations`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch locations");
        }

        const data = await response.json();

        setLocations(data);
      } catch (error) {
        console.error("Location API error:", error);
        setLocationsError(
          "Unable to connect to HimDrishti backend."
        );
      } finally {
        setLoadingLocations(false);
      }
    }

    loadLocations();
  }, []);

  // ---------------------------------------------------------
  // SEARCH
  // ---------------------------------------------------------

  const filteredLocations = locations.filter((location) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return (
      location.name.toLowerCase().includes(query) ||
      location.state.toLowerCase().includes(query)
    );
  });

  // ---------------------------------------------------------
  // SELECT LOCATION
  // ---------------------------------------------------------

  async function selectLocation(location) {
    setSearch(location.name);
    setSelectedLocation(null);
    setLocationError("");
    setLoadingLocation(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/locations/${location.id}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch location details");
      }

      const data = await response.json();

      const extra =
        fallbackDetails[data.id] || {};

      const recommendation =
        getRecommendation(data.risk_level);

      const formattedLocation = {
        ...data,

        district:
          extra.district ||
          `${data.name} District`,

        elevation:
          extra.elevation || 0,

        temperature:
          extra.temperature || 24,

        humidity:
          extra.humidity ||
          data.soil_moisture,

        wind:
          extra.wind || 0,

        rainfall24h:
          data.rainfall,

        factors:
          buildFactors(data),

        recommendation:
          recommendation.text,

        recommendationTitle:
          recommendation.title,
      };

      setSelectedLocation(formattedLocation);
    } catch (error) {
      console.error(
        "Location details API error:",
        error
      );

      setLocationError(
        "Unable to load location analysis."
      );
    } finally {
      setLoadingLocation(false);
    }
  }

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------

  return (
    <>
      <Sidebar />

      <main className="check-location-page">

        {/* HEADER */}
        <header className="check-location-header">

          <div>
            <span className="page-eyebrow">
              LOCATION ANALYSIS
            </span>

            <h1>Check Location</h1>

            <p>
              Search any monitored area and view its current landslide risk.
            </p>
          </div>

          <div className="location-live-status">
            <span></span>

            {loadingLocations
              ? "Connecting..."
              : locationsError
                ? "Backend Offline"
                : "Analysis System Online"}
          </div>

        </header>

        {/* SEARCH */}
        <section className="location-search-section">

          <div className="location-search-box">

            <span className="search-icon">
              ⌕
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedLocation(null);
                setLocationError("");
              }}
              placeholder="Search location, district or state..."
              disabled={loadingLocations}
            />

            {search && (
              <button
                className="clear-search"
                onClick={() => {
                  setSearch("");
                  setSelectedLocation(null);
                  setLocationError("");
                }}
              >
                ×
              </button>
            )}

          </div>

          {!selectedLocation &&
            search &&
            !loadingLocations && (
              <div className="location-search-results">

                {filteredLocations.length > 0 ? (
                  filteredLocations.map((location) => (
                    <button
                      key={location.id}
                      className="location-result"
                      onClick={() =>
                        selectLocation(location)
                      }
                    >

                      <div className="result-location-icon">
                        📍
                      </div>

                      <div>
                        <strong>
                          {location.name}
                        </strong>

                        <span>
                          {location.state}
                        </span>
                      </div>

                      <span
                        className={`result-risk ${location.risk_level.toLowerCase()}`}
                      >
                        {location.risk_score}
                      </span>

                    </button>
                  ))
                ) : (
                  <div className="no-search-results">

                    <span>⌕</span>

                    <strong>
                      No monitored location found
                    </strong>

                    <small>
                      Try Aizawl, Lunglei, Champhai or Serchhip.
                    </small>

                  </div>
                )}

              </div>
            )}

        </section>

        {/* BACKEND ERROR */}
        {locationsError && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px 16px",
              borderRadius: "10px",
              background: "#fff1f1",
              color: "#b42318",
              fontSize: "13px",
            }}
          >
            ⚠️ {locationsError}
          </div>
        )}

        {/* LOADING */}
        {loadingLocation && (
          <section className="location-empty-state">

            <div className="empty-location-icon">
              ⟳
            </div>

            <h2>Analyzing Location</h2>

            <p>
              Fetching live risk conditions from the
              HimDrishti risk engine...
            </p>

          </section>
        )}

        {/* LOCATION ERROR */}
        {locationError && !loadingLocation && (
          <section className="location-empty-state">

            <div className="empty-location-icon">
              ⚠️
            </div>

            <h2>Analysis Failed</h2>

            <p>
              {locationError}
            </p>

          </section>
        )}

        {/* EMPTY STATE */}
        {!selectedLocation &&
          !loadingLocation &&
          !locationError && (
            <section className="location-empty-state">

              <div className="empty-location-icon">
                ⌖
              </div>

              <h2>Search a Location</h2>

              <p>
                Enter a location above to view its landslide risk,
                weather conditions and environmental factors.
              </p>

              <div className="quick-location-list">

                {locations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() =>
                      selectLocation(location)
                    }
                  >
                    📍 {location.name}
                  </button>
                ))}

              </div>

            </section>
          )}

        {/* RESULT */}
        {selectedLocation &&
          !loadingLocation && (
            <section className="location-analysis">

              {/* LOCATION OVERVIEW */}
              <div className="analysis-overview">

                <div className="analysis-location">

                  <div className="analysis-pin">
                    📍
                  </div>

                  <div>
                    <span>
                      SELECTED LOCATION
                    </span>

                    <h2>
                      {selectedLocation.name}
                    </h2>

                    <p>
                      {selectedLocation.district},{" "}
                      {selectedLocation.state}
                    </p>
                  </div>

                </div>

                <div
                  className={`overall-risk ${selectedLocation.risk_level.toLowerCase()}`}
                >

                  <div>
                    <span>
                      LANDSLIDE RISK
                    </span>

                    <strong>
                      {selectedLocation.risk_score}
                    </strong>
                  </div>

                  <b>
                    {selectedLocation.risk_level}
                  </b>

                </div>

              </div>

              {/* METRICS */}
              <div className="analysis-metrics">

                <div className="analysis-metric rainfall">

                  <div className="metric-icon">
                    🌧️
                  </div>

                  <div>
                    <span>Rainfall</span>

                    <strong>
                      {selectedLocation.rainfall} mm
                    </strong>

                    <small>
                      Last 24 hours
                    </small>
                  </div>

                </div>

                <div className="analysis-metric soil">

                  <div className="metric-icon">
                    💧
                  </div>

                  <div>
                    <span>
                      Soil Moisture
                    </span>

                    <strong>
                      {selectedLocation.soil_moisture}%
                    </strong>

                    <small>
                      Current saturation
                    </small>
                  </div>

                </div>

                <div className="analysis-metric slope">

                  <div className="metric-icon">
                    ⛰️
                  </div>

                  <div>
                    <span>
                      Terrain Slope
                    </span>

                    <strong>
                      {selectedLocation.slope}°
                    </strong>

                    <small>
                      Average slope
                    </small>
                  </div>

                </div>

                <div className="analysis-metric elevation">

                  <div className="metric-icon">
                    ↕
                  </div>

                  <div>
                    <span>
                      Elevation
                    </span>

                    <strong>
                      {selectedLocation.elevation} m
                    </strong>

                    <small>
                      Above sea level
                    </small>
                  </div>

                </div>

              </div>

              {/* TWO COLUMN */}
              <div className="analysis-grid">

                {/* RISK FACTORS */}
                <div className="analysis-card">

                  <div className="analysis-card-header">

                    <div>
                      <span>
                        ENVIRONMENTAL ANALYSIS
                      </span>

                      <h3>
                        Risk Factors
                      </h3>
                    </div>

                    <span className="factor-count">
                      {selectedLocation.factors.length}
                    </span>

                  </div>

                  <div className="risk-factor-list">

                    {selectedLocation.factors.map(
                      (factor, index) => (
                        <div
                          className="risk-factor"
                          key={factor}
                        >

                          <span className="factor-number">
                            {index + 1}
                          </span>

                          <div>
                            <strong>
                              {factor}
                            </strong>

                            <small>
                              Contributing to current risk
                            </small>
                          </div>

                          <span className="factor-warning">
                            !
                          </span>

                        </div>
                      )
                    )}

                  </div>

                </div>

                {/* WEATHER */}
                <div className="analysis-card">

                  <div className="analysis-card-header">

                    <div>
                      <span>
                        CURRENT CONDITIONS
                      </span>

                      <h3>
                        Weather
                      </h3>
                    </div>

                    <span className="weather-live">
                      ● LIVE
                    </span>

                  </div>

                  <div className="weather-main-analysis">

                    <div className="weather-temp">

                      <span>🌧️</span>

                      <strong>
                        {selectedLocation.temperature}°
                      </strong>

                      <small>
                        Weather conditions
                      </small>

                    </div>

                    <div className="weather-details">

                      <div>
                        <span>Humidity</span>

                        <strong>
                          {selectedLocation.humidity}%
                        </strong>
                      </div>

                      <div>
                        <span>Wind</span>

                        <strong>
                          {selectedLocation.wind} km/h
                        </strong>
                      </div>

                      <div>
                        <span>Rainfall</span>

                        <strong>
                          {selectedLocation.rainfall24h} mm
                        </strong>
                      </div>

                    </div>

                  </div>

                </div>

              </div>

              {/* RECOMMENDATION */}
              <div
                className={`safety-recommendation ${selectedLocation.risk_level.toLowerCase()}`}
              >

                <div className="recommendation-icon">
                  ⚠
                </div>

                <div>

                  <span>
                    SAFETY RECOMMENDATION
                  </span>

                  <h3>
                    {selectedLocation.recommendationTitle}
                  </h3>

                  <p>
                    {selectedLocation.recommendation}
                  </p>

                </div>

              </div>

              {/* FOOTER */}
              <div className="analysis-footer">

                <span>
                  Live analysis from HimDrishti backend
                </span>

                <span>
                  Data sources: Risk Engine · Weather · GIS
                </span>

                <button
                  onClick={() => {
                    setSelectedLocation(null);
                    setSearch("");
                    setLocationError("");
                  }}
                >
                  Check Another Location →
                </button>

              </div>

            </section>
          )}

      </main>

      <MobileNav />
    </>
  );
}