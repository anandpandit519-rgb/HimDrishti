"use client";

import {
  MapContainer,
  TileLayer,
  Circle,
  CircleMarker,
  Popup,
  ZoomControl,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

const fallbackLocations = [
  {
    id: "aizawl",
    name: "Aizawl",
    state: "Mizoram",
    latitude: 23.7271,
    longitude: 92.7176,
    risk_score: 79,
    risk_level: "HIGH",
    rainfall: 142,
    soil_moisture: 91,
  },
  {
    id: "lunglei",
    name: "Lunglei",
    state: "Mizoram",
    latitude: 22.8897,
    longitude: 92.746,
    risk_score: 72,
    risk_level: "HIGH",
    rainfall: 118,
    soil_moisture: 84,
  },
  {
    id: "champhai",
    name: "Champhai",
    state: "Mizoram",
    latitude: 23.4653,
    longitude: 93.3284,
    risk_score: 65,
    risk_level: "HIGH",
    rainfall: 104,
    soil_moisture: 79,
  },
  {
    id: "serchhip",
    name: "Serchhip",
    state: "Mizoram",
    latitude: 23.305,
    longitude: 92.85,
    risk_score: 55,
    risk_level: "MODERATE",
    rainfall: 87,
    soil_moisture: 68,
  },
];

const riskColors = {
  CRITICAL: "#d94747",
  HIGH: "#ec8b3b",
  MODERATE: "#e1b83e",
  LOW: "#48a96b",
};

export default function InteractiveRiskMap({
  region = "Mizoram",
  locations = [],
}) {
  /*
   * Backend data is preferred.
   * Fallback data keeps the map usable while the API is unavailable.
   */
  const mapLocations =
    locations.length > 0 ? locations : fallbackLocations;

  const filteredLocations = mapLocations.filter(
    (location) =>
      !location.state ||
      location.state.toLowerCase() === region.toLowerCase()
  );

  return (
    <div className="risk-map-container">

      <MapContainer
        center={[23.25, 92.8]}
        zoom={7}
        minZoom={5}
        maxZoom={14}
        zoomControl={false}
        scrollWheelZoom={true}
        className="leaflet-risk-map"
      >

        <ZoomControl position="topleft" />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredLocations.map((location) => {

          const riskLevel =
            location.risk_level || "LOW";

          const color =
            riskColors[riskLevel] || riskColors.LOW;

          const riskScore =
            Number(location.risk_score) || 0;

          return (
            <div key={location.id || location.name}>

              <Circle
                center={[
                  location.latitude,
                  location.longitude,
                ]}
                radius={
                  riskScore >= 80
                    ? 18000
                    : riskScore >= 60
                      ? 15000
                      : 12000
                }
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.13,
                  weight: 2,
                  opacity: 0.55,
                }}
              />

              <CircleMarker
                center={[
                  location.latitude,
                  location.longitude,
                ]}
                radius={8}
                pathOptions={{
                  color: "#ffffff",
                  weight: 3,
                  fillColor: color,
                  fillOpacity: 1,
                }}
              >

                <Popup>

                  <div className="risk-popup">

                    <div className="popup-top">

                      <div>
                        <strong>
                          {location.name}
                        </strong>

                        <span>
                          {location.state}
                        </span>
                      </div>

                      <div
                        className="popup-score"
                        style={{
                          color,
                          background: `${color}18`,
                        }}
                      >
                        {riskScore}
                      </div>

                    </div>

                    <div
                      className="popup-status"
                      style={{ color }}
                    >
                      ● {riskLevel}
                    </div>

                    <div className="popup-data">

                      <div>
                        <span>Rainfall</span>
                        <b>
                          {location.rainfall} mm
                        </b>
                      </div>

                      <div>
                        <span>Soil Moisture</span>
                        <b>
                          {location.soil_moisture}%
                        </b>
                      </div>

                    </div>

                  </div>

                </Popup>

              </CircleMarker>

            </div>
          );
        })}

      </MapContainer>

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
  );
}