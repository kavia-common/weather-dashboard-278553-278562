import React, { useState, useEffect } from "react";
import "./App.css";
import "./index.css";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import { getWeatherByCity, getWeatherRuntimeInfo } from "./api/weatherService";

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Apply theme to document root for CSS variables to work
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Check config on mount
  useEffect(() => {
    const info = getWeatherRuntimeInfo();
    if (!info.hasKey) {
      setError(
        "API key missing. Create .env with VITE_WEATHER_API_KEY=your_key and restart the dev server."
      );
    }
  }, []);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleSearch = async (city) => {
    setQuery(city);
    setLoading(true);
    setError("");
    try {
      const data = await getWeatherByCity(city);
      setWeather(data);
    } catch (e) {
      if (e?.code === "CITY_NOT_FOUND") {
        setError("City not found. Please try a different name.");
      } else if (e?.code === "CONFIG_ERROR") {
        setError("API key missing. Create .env with VITE_WEATHER_API_KEY and restart the app.");
      } else if (e?.code === "INVALID_API_KEY") {
        setError("Invalid API key. Please verify VITE_WEATHER_API_KEY and restart the app.");
      } else if (e?.code === "VALIDATION_ERROR") {
        setError(e.message || "Please enter a valid city name.");
      } else if (e?.code === "NETWORK_ERROR") {
        setError("Network error while fetching weather. Please check your connection.");
      } else if (e?.code === "RATE_LIMITED") {
        setError("Rate limit reached. Please wait and try again.");
      } else {
        setError("Unable to fetch weather. Please try again.");
      }
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="wd-header">
        <div className="wd-header-inner">
          <h1 className="wd-title">Weather Dashboard</h1>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
      </header>

      <main className="wd-main">
        <section className="wd-search-section">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </section>

        <section className="wd-status" aria-live="polite">
          {loading && (
            <div className="spinner" role="status" aria-label="Loading">
              <div className="dot dot1" />
              <div className="dot dot2" />
              <div className="dot dot3" />
            </div>
          )}
          {!!error && <div className="alert error">{error}</div>}
        </section>

        {!loading && !error && weather && (
          <section className="wd-result">
            <WeatherCard data={weather} />
          </section>
        )}

        {!loading && !error && !weather && (
          <section className="wd-placeholder" aria-label="No results">
            <p className="placeholder-text">
              Search for a city to see the current weather.
            </p>
          </section>
        )}
      </main>

      <footer className="wd-footer">
        <p>
          Powered by{" "}
          <a
            href="https://openweathermap.org/"
            target="_blank"
            rel="noreferrer noopener"
            className="wd-link"
          >
            OpenWeatherMap
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
