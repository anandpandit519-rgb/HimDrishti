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

const fallbackForecast = {
  Aizawl: [
    ["Today", "🌧️", "24°", "18°", "80%"],
    ["Thu", "🌧️", "25°", "18°", "72%"],
    ["Fri", "☁️", "26°", "19°", "48%"],
    ["Sat", "⛅", "26°", "19°", "35%"],
    ["Sun", "🌧️", "25°", "18°", "68%"],
  ],
  Lunglei: [
    ["Today", "🌧️", "23°", "18°", "76%"],
    ["Thu", "🌧️", "24°", "18°", "69%"],
    ["Fri", "☁️", "25°", "19°", "45%"],
    ["Sat", "⛅", "26°", "19°", "32%"],
    ["Sun", "🌧️", "24°", "18°", "61%"],
  ],
  Champhai: [
    ["Today", "☁️", "22°", "17°", "58%"],
    ["Thu", "🌧️", "23°", "17°", "63%"],
    ["Fri", "☁️", "24°", "18°", "42%"],
    ["Sat", "⛅", "25°", "18°", "31%"],
    ["Sun", "🌧️", "23°", "17°", "57%"],
  ],
  Serchhip: [
    ["Today", "⛅", "25°", "18°", "42%"],
    ["Thu", "🌧️", "25°", "18°", "55%"],
    ["Fri", "☁️", "26°", "19°", "38%"],
    ["Sat", "⛅", "27°", "19°", "25%"],
    ["Sun", "🌧️", "25°", "18°", "51%"],
  ],
};

function getWeatherIcon(condition = "") {
  const value = condition.toLowerCase();

  if (value.includes("heavy rain")) return "🌧️";
  if (value.includes("rain")) return "🌧️";
  if (value.includes("cloud")) return "☁️";
  return "⛅";
}

function getInsight(riskLevel) {
  if (riskLevel === "CRITICAL") {
    return "Weather conditions are contributing significantly to current landslide risk.";
  }

  if (riskLevel === "HIGH") {
    return "Current rainfall and environmental conditions require continued monitoring.";
  }

  return "Current weather conditions indicate a moderate environmental risk.";
}

export default function WeatherPage() {
  const [selectedCity, setSelectedCity] = useState("Aizawl");

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadWeather(city) {
    try {
      setLoading(true);
      setError("");

      const locationId = locationIds[city];

      const response = await fetch(
        `${API_BASE_URL}/api/v1/weather/${locationId}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const data = await response.json();

      setWeather({
        ...data,
        forecast: fallbackForecast[city] || fallbackForecast.Aizawl,
      });
    } catch (err) {
      console.error("Weather API error:", err);
      setError("Unable to connect to weather backend.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWeather(selectedCity);
  }, [selectedCity]);

  return (
    <>
      <Sidebar />

      <main className="weather-page">

        {/* HEADER */}
        <header className="weather-header">
          <div>
            <span className="page-eyebrow">
              WEATHER MONITORING
            </span>

            <h1>Weather</h1>

            <p>
              Live weather conditions and rainfall patterns across monitored areas.
            </p>
          </div>

          <div className="weather-live-status">
            <span></span>

            {loading
              ? "Connecting..."
              : error
                ? "Backend Offline"
                : "Weather Data Live"}
          </div>
        </header>

        {/* BACKEND STATUS */}
        {error && (
          <div
            style={{
              marginBottom: "14px",
              padding: "10px 14px",
              borderRadius: "10px",
              background: "#fff1f1",
              color: "#b42318",
              fontSize: "13px",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* LOCATION SELECTOR */}
        <section className="weather-location-bar">

          <div className="weather-location-info">
            <span className="location-pin">📍</span>

            <div>
              <span>MONITORING LOCATION</span>

              <strong>
                {selectedCity}, {weather?.state || "Mizoram"}
              </strong>
            </div>
          </div>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={loading}
          >
            {Object.keys(locationIds).map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

        </section>

        {loading && (
          <div
            style={{
              padding: "50px",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            🌦️ Loading live weather data...
          </div>
        )}

        {!loading && weather && (
          <>
            {/* CURRENT WEATHER */}
            <section className="current-weather-grid">

              <div className="current-weather-card">

                <div className="current-weather-main">

                  <div className="weather-big-icon">
                    {getWeatherIcon(weather.weather_condition)}
                  </div>

                  <div>
                    <span>RIGHT NOW</span>

                    <div className="current-temperature">
                      {weather.temperature}°
                    </div>

                    <strong>
                      {weather.weather_condition}
                    </strong>

                    <p>
                      Feels like {weather.feels_like}°C
                    </p>
                  </div>

                </div>

                <div className="current-weather-time">
                  Live from HimDrishti backend
                </div>

              </div>

              {/* RISK CONNECTION */}
              <div
                className={`weather-risk-card ${weather.risk_level.toLowerCase()}`}
              >

                <div className="weather-risk-top">

                  <div>
                    <span>LANDSLIDE RISK</span>

                    <strong>
                      {weather.risk_score}
                    </strong>
                  </div>

                  <b>
                    {weather.risk_level}
                  </b>

                </div>

                <p>
                  Weather conditions are being evaluated by the
                  HimDrishti risk engine.
                </p>

                <div className="weather-risk-bar">
                  <div
                    style={{
                      width: `${weather.risk_score}%`,
                    }}
                  ></div>
                </div>

              </div>

            </section>

            {/* WEATHER METRICS */}
            <section className="weather-metrics">

              <div className="weather-metric-card">
                <div className="weather-metric-icon rain">
                  🌧️
                </div>

                <div>
                  <span>Rainfall</span>
                  <strong>{weather.rainfall} mm</strong>
                  <small>Last 24 hours</small>
                </div>
              </div>

              <div className="weather-metric-card">
                <div className="weather-metric-icon humidity">
                  💧
                </div>

                <div>
                  <span>Humidity</span>
                  <strong>{weather.humidity}%</strong>
                  <small>Current humidity</small>
                </div>
              </div>

              <div className="weather-metric-card">
                <div className="weather-metric-icon wind">
                  💨
                </div>

                <div>
                  <span>Wind Speed</span>
                  <strong>{weather.wind_speed} km/h</strong>
                  <small>Current wind</small>
                </div>
              </div>

              <div className="weather-metric-card">
                <div className="weather-metric-icon pressure">
                  ◉
                </div>

                <div>
                  <span>Pressure</span>
                  <strong>{weather.pressure} hPa</strong>
                  <small>Atmospheric pressure</small>
                </div>
              </div>

              <div className="weather-metric-card">
                <div className="weather-metric-icon visibility">
                  ◌
                </div>

                <div>
                  <span>Visibility</span>
                  <strong>{weather.visibility} km</strong>
                  <small>Current visibility</small>
                </div>
              </div>

            </section>

            {/* MAIN GRID */}
            <section className="weather-main-grid">

              {/* FORECAST */}
              <div className="weather-panel forecast-panel">

                <div className="weather-panel-header">

                  <div>
                    <span>FORECAST</span>
                    <h2>5-Day Weather</h2>
                  </div>

                  <span className="forecast-updated">
                    Demo forecast
                  </span>

                </div>

                <div className="forecast-list">

                  {weather.forecast.map((day) => (
                    <div
                      className="forecast-day"
                      key={day[0]}
                    >

                      <strong>{day[0]}</strong>

                      <span className="forecast-icon">
                        {day[1]}
                      </span>

                      <div className="forecast-temp">
                        <b>{day[2]}</b>
                        <span>{day[3]}</span>
                      </div>

                      <div className="rain-probability">
                        <span>💧</span>
                        {day[4]}
                      </div>

                    </div>
                  ))}

                </div>

              </div>

              {/* RAINFALL */}
              <div className="weather-panel rainfall-panel">

                <div className="weather-panel-header">

                  <div>
                    <span>RAINFALL MONITORING</span>
                    <h2>Rainfall Trend</h2>
                  </div>

                  <span className="rainfall-period">
                    24 Hours
                  </span>

                </div>

                <div className="rainfall-chart">

                  <div className="chart-grid-line line-1"></div>
                  <div className="chart-grid-line line-2"></div>
                  <div className="chart-grid-line line-3"></div>

                  <div className="rain-bars">

                    {[32, 46, 28, 62, 48, 76, 91, 68, 82, 100, 87, 72].map(
                      (height, index) => (
                        <div
                          className="rain-bar-wrapper"
                          key={index}
                        >
                          <div
                            className="rain-bar"
                            style={{
                              height: `${height}%`,
                            }}
                          ></div>

                          <span>
                            {index * 2}:00
                          </span>
                        </div>
                      )
                    )}

                  </div>

                </div>

                <div className="rainfall-total">

                  <div>
                    <span>Total Rainfall</span>
                    <strong>{weather.rainfall} mm</strong>
                  </div>

                  <div>
                    <span>Peak Period</span>
                    <strong>14:00 - 18:00</strong>
                  </div>

                </div>

              </div>

            </section>

            {/* WEATHER + RISK EXPLANATION */}
            <section className="weather-insight">

              <div className="insight-icon">
                ⚠
              </div>

              <div>

                <span>
                  HIMDRISHTI WEATHER INSIGHT
                </span>

                <h3>
                  {getInsight(weather.risk_level)}
                </h3>

                <p>
                  Rainfall, humidity and other environmental variables
                  are continuously evaluated by the risk monitoring system.
                </p>

              </div>

            </section>

            {/* FOOTER */}
            <div className="weather-footer">

              <span>
                Live backend data
              </span>

              <span>
                Data sources: HimDrishti Weather Service · GIS
              </span>

              <span className="weather-footer-status">
                ● System Operational
              </span>

            </div>

          </>
        )}

      </main>

      <MobileNav />
    </>
  );
}