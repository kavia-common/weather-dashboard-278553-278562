import React from "react";

/**
 * WeatherCard Component
 * Displays current weather details.
 *
 * Props:
 *  - data: {
 *      city, country, temperature, condition, humidity, windSpeed, icon, description
 *    }
 */
// PUBLIC_INTERFACE
export default function WeatherCard({ data }) {
  if (!data) return null;

  const { city, country, temperature, condition, humidity, windSpeed, icon, description } = data;

  const iconUrl = icon
    ? `https://openweathermap.org/img/wn/${icon}@2x.png`
    : "";

  return (
    <section className="weather-card" aria-label="Current weather">
      <div className="weather-header">
        <h2 className="weather-location">
          {city}
          {country ? `, ${country}` : ""}
        </h2>
        {iconUrl && (
          <img
            src={iconUrl}
            alt={description ? `Weather icon: ${description}` : "Weather icon"}
            className="weather-icon"
            width="100"
            height="100"
          />
        )}
      </div>
      <div className="weather-main">
        <div className="temp">
          {typeof temperature === "number" ? `${temperature}°C` : "—"}
        </div>
        <div className="condition">{condition || "—"}</div>
        {description ? <div className="description">{description}</div> : null}
      </div>
      <div className="weather-stats">
        <div className="stat">
          <span className="label">Humidity</span>
          <span className="value">
            {typeof humidity === "number" ? `${humidity}%` : "—"}
          </span>
        </div>
        <div className="stat">
          <span className="label">Wind</span>
          <span className="value">
            {typeof windSpeed === "number" ? `${windSpeed} m/s` : "—"}
          </span>
        </div>
      </div>
    </section>
  );
}
