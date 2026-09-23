"use client";

import { useState } from "react";

export default function RiskTrend() {
  const [location, setLocation] = useState("Aizawl");

  return (
    <div className="card">

      <div className="card-head">

        <h3>📈 Risk Trend</h3>

        <select
          className="select"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option>Aizawl</option>
          <option>Lunglei</option>
          <option>Champhai</option>
          <option>Serchhip</option>
        </select>

      </div>

      <div className="chart">

        <svg
          viewBox="0 0 500 190"
          preserveAspectRatio="none"
        >

          <defs>

            <linearGradient
              id="riskFill"
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop
                offset="0"
                stopColor="#ef4444"
                stopOpacity=".22"
              />

              <stop
                offset="1"
                stopColor="#ef4444"
                stopOpacity="0"
              />
            </linearGradient>

          </defs>

          <path
            d="
              M15 160
              L85 135
              L155 130
              L225 105
              L295 95
              L365 70
              L435 57
              L485 25
              L485 175
              L15 175
              Z
            "
            fill="url(#riskFill)"
          />

          <polyline
            points="
              15,160
              85,135
              155,130
              225,105
              295,95
              365,70
              435,57
              485,25
            "
            fill="none"
            stroke="#ef4a46"
            strokeWidth="4"
          />

          <g fill="#ef4a46">

            <circle cx="15" cy="160" r="4" />
            <circle cx="85" cy="135" r="4" />
            <circle cx="155" cy="130" r="4" />
            <circle cx="225" cy="105" r="4" />
            <circle cx="295" cy="95" r="4" />
            <circle cx="365" cy="70" r="4" />
            <circle cx="435" cy="57" r="4" />
            <circle cx="485" cy="25" r="5" />

          </g>

          <text
            x="442"
            y="17"
            fill="#d22f2f"
            fontWeight="800"
          >
            89%
          </text>

          <text
            x="8"
            y="187"
            fill="#8490a0"
            fontSize="11"
          >
            Sep 10
          </text>

          <text
            x="445"
            y="187"
            fill="#8490a0"
            fontSize="11"
          >
            Sep 15
          </text>

        </svg>

      </div>

      <div
        style={{
          fontSize: "11px",
          color: "#687386",
          marginTop: "4px",
        }}
      >
        Current location: <b>{location}</b>
      </div>

    </div>
  );
}