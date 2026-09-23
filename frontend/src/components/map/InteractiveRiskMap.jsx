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

const locations = [
  {
    name: "Aizawl",
    state: "Mizoram",
    lat: 23.7271,
    lng: 92.7176,
    risk: 89,
    level: "CRITICAL",
    rainfall: 142,
    soil: 91,
  },
  {
    name: "Lunglei",
    state: "Mizoram",
    lat: 22.8897,
    lng: 92.746,
    risk: 78,
    level: "HIGH",
    rainfall: 118,
    soil: 84,
  },
  {
    name: "Champhai",
    state: "Mizoram",
    lat: 23.4653,
    lng: 93.3284,
    risk: 71,
    level: "HIGH",
    rainfall: 104,
    soil: 79,
  },
  {
    name: "Serchhip",
    state: "Mizoram",
    lat: 23.305,
    lng: 92.85,
    risk: 63,
    level: "MODERATE",
    rainfall: 87,
    soil: 68,
  },
];

const riskColors = {
  CRITICAL: "#d94747",
  HIGH: "#ec8b3b",
  MODERATE: "#e1b83e",
  LOW: "#48a96b",
};

export default function InteractiveRiskMap() {
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

        {locations.map((location) => {
          const color = riskColors[location.level];

          return (
            <div key={location.name}>

              {/* RISK AREA */}
              <Circle
                center={[location.lat, location.lng]}
                radius={location.risk >= 80 ? 18000 : 13000}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.13,
                  weight: 2,
                  opacity: 0.55,
                }}
              />

              {/* LOCATION */}
              <CircleMarker
                center={[location.lat, location.lng]}
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
                        <strong>{location.name}</strong>
                        <span>{location.state}</span>
                      </div>

                      <div
                        className="popup-score"
                        style={{
                          color,
                          background: `${color}18`,
                        }}
                      >
                        {location.risk}
                      </div>
                    </div>

                    <div
                      className="popup-status"
                      style={{ color }}
                    >
                      ● {location.level}
                    </div>

                    <div className="popup-data">

                      <div>
                        <span>Rainfall</span>
                        <b>{location.rainfall} mm</b>
                      </div>

                      <div>
                        <span>Soil Moisture</span>
                        <b>{location.soil}%</b>
                      </div>

                    </div>

                  </div>
                </Popup>
              </CircleMarker>

            </div>
          );
        })}

      </MapContainer>

      {/* ONLY ONE LEGEND */}
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