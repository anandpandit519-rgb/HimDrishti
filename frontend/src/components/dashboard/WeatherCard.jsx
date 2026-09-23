const forecast = [
  { day: "Mon", icon: "🌧️", temp: "24°/18°" },
  { day: "Tue", icon: "🌧️", temp: "25°/18°" },
  { day: "Wed", icon: "☁️", temp: "26°/19°" },
  { day: "Thu", icon: "⛅", temp: "26°/19°" },
  { day: "Fri", icon: "🌧️", temp: "25°/18°" },
];

export default function WeatherCard() {
  return (
    <div className="card">

      <div className="card-head">
        <h3>☁️ Weather & Forecast</h3>

        <span
          style={{
            fontSize: "11px",
            color: "#159b5b",
            fontWeight: 800,
          }}
        >
          ● LIVE
        </span>
      </div>

      <b>📍 Aizawl, Mizoram</b>

      <div className="weather-main">

        <div className="weather-icon">
          🌧️
        </div>

        <div>
          <div className="temp">24°C</div>
          <div>Heavy Rain</div>
        </div>

        <div className="weather-meta">
          Humidity <b>91%</b>
          <br />
          Wind <b>12 km/h</b>
          <br />
          Rainfall <b>142 mm</b>
        </div>

      </div>

      <div className="forecast">

        {forecast.map((item) => (
          <div
            className="day"
            key={item.day}
          >
            <b>{item.day}</b>

            {item.icon}

            <br />

            {item.temp}
          </div>
        ))}

      </div>

    </div>
  );
}