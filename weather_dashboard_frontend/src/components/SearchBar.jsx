import React, { useState } from "react";

/**
 * SearchBar Component
 * Accessible input with submit for searching city weather.
 *
 * Props:
 *  - onSearch: (city: string) => void
 *  - loading: boolean
 */
// PUBLIC_INTERFACE
export default function SearchBar({ onSearch, loading = false }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = value.trim();
    if (v.length >= 2) {
      onSearch(v);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Search city weather"
      className="search-form"
    >
      <label htmlFor="city-input" className="sr-only">
        City name
      </label>
      <div className="search-input-wrapper">
        <input
          id="city-input"
          type="text"
          inputMode="text"
          autoCapitalize="words"
          autoComplete="off"
          placeholder="Search city (e.g., London)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-required="true"
          aria-label="City name"
          className="search-input"
        />
        <button
          type="submit"
          className="btn-search"
          aria-label="Search"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      <p className="helper-text" aria-live="polite">
        Tip: enter at least 2 characters.
      </p>
    </form>
  );
}
