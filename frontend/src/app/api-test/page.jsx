"use client";

import { useEffect, useState } from "react";
import { getLocations } from "../../services/api";

export default function ApiTestPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getLocations();
        setLocations(data);
      } catch (err) {
        console.error(err);
        setError("Backend se data nahi aa raha.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <main
      style={{
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <h1>HimDrishti API Test</h1>

      {loading && <p>Loading locations...</p>}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        locations.map((location) => (
          <div
            key={location.id}
            style={{
              padding: "20px",
              marginTop: "15px",
              border: "1px solid #ddd",
              borderRadius: "12px",
            }}
          >
            <h2>{location.name}</h2>

            <p>
              State: {location.state}
            </p>

            <p>
              Risk Score:{" "}
              <strong>{location.risk_score}</strong>
            </p>

            <p>
              Risk Level:{" "}
              <strong>{location.risk_level}</strong>
            </p>

            <p>
              Rainfall: {location.rainfall} mm
            </p>

            <p>
              Soil Moisture: {location.soil_moisture}%
            </p>
          </div>
        ))}
    </main>
  );
}