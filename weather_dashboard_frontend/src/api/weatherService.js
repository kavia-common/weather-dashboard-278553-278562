//
//
// Weather API Service Module
// Handles communication with OpenWeatherMap Current Weather API using env variables.
// Adds robust error differentiation for configuration vs. city-not-found,
// supports configurable units and clearer error messages.
//

/**
 * Read runtime configuration using Vite-style env (import.meta.env).
 * This function centralizes env lookups and defaults.
 */
// PUBLIC_INTERFACE
function getRuntimeConfig() {
  // Access Vite-style env safely; in CRA builds this will be undefined at build time,
  // but our code targets Vite-style usage as required by the task.
  const env = (typeof import.meta !== "undefined" && import.meta && import.meta.env) ? import.meta.env : {};
  const base =
    env.VITE_WEATHER_API_BASE ||
    env.VITE_OPENWEATHER_API_BASE ||
    "https://api.openweathermap.org/data/2.5";

  // Allowed: "standard", "metric", "imperial"
  const unitsRaw = String(env.VITE_WEATHER_UNITS || "metric").trim().toLowerCase();
  const allowedUnits = new Set(["standard", "metric", "imperial"]);
  const units = allowedUnits.has(unitsRaw) ? unitsRaw : "metric";

  const key = env.VITE_WEATHER_API_KEY;

  return { base, key, units };
}

/**
 * Parse OpenWeatherMap error payload to produce better error codes/messages.
 * When possible, convert known error 'cod' values to informative codes.
 */
async function parseOwmError(resp) {
  let body;
  try {
    body = await resp.json();
  } catch (_) {
    // noop, keep body undefined if not JSON
  }

  // OWM error format may include 'cod' and 'message'
  const cod = body?.cod;
  const message = typeof body?.message === "string" ? body.message : "";

  if (resp.status === 401 || cod === 401) {
    const err = new Error(message || "Invalid API key. Please verify VITE_WEATHER_API_KEY.");
    err.code = "INVALID_API_KEY";
    err.status = 401;
    return err;
  }

  if (resp.status === 404 || cod === "404" || cod === 404) {
    const err = new Error(message || "City not found. Please try another search.");
    err.code = "CITY_NOT_FOUND";
    err.status = 404;
    return err;
  }

  if (resp.status === 429 || cod === 429) {
    const err = new Error(message || "Too many requests. Please try again shortly.");
    err.code = "RATE_LIMITED";
    err.status = 429;
    return err;
  }

  // Generic HTTP error
  const err = new Error(message || "Failed to fetch weather. Please try again later.");
  err.code = "HTTP_ERROR";
  err.status = resp.status;
  return err;
}

// PUBLIC_INTERFACE
export async function getWeatherByCity(cityRaw) {
  /** Fetch current weather by city name using OpenWeatherMap API.
   * Validates input, reads base URL and API key from env, and returns
   * a normalized weather object.
   *
   * Returns:
   *  {
   *    city: string,
   *    country: string,
   *    temperature: number, // unit depends on VITE_WEATHER_UNITS
   *    condition: string,
   *    humidity: number,
   *    windSpeed: number, // m/s or mph based on units
   *    icon: string, // icon code
   *    description: string,
   *    units: "standard" | "metric" | "imperial"
   *  }
   */
  const city = typeof cityRaw === "string" ? cityRaw.trim() : "";
  if (!city || city.length < 2) {
    const err = new Error("Please enter at least 2 characters for the city.");
    err.code = "VALIDATION_ERROR";
    throw err;
  }

  const { base, key, units } = getRuntimeConfig();

  if (!key) {
    const err = new Error(
      "Missing OpenWeatherMap API key. Please set VITE_WEATHER_API_KEY in your .env file and restart the dev server."
    );
    err.code = "CONFIG_ERROR";
    throw err;
  }

  const url = `${base}/weather?q=${encodeURIComponent(city)}&appid=${encodeURIComponent(
    key
  )}&units=${encodeURIComponent(units)}`;

  try {
    const resp = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!resp.ok) {
      throw await parseOwmError(resp);
    }

    const data = await resp.json();

    // Normalize response
    const normalized = {
      city: data?.name || city,
      country: data?.sys?.country || "",
      temperature:
        typeof data?.main?.temp === "number" ? Math.round(data.main.temp) : null,
      condition: data?.weather?.[0]?.main || "N/A",
      description: data?.weather?.[0]?.description || "",
      humidity: data?.main?.humidity ?? null,
      windSpeed: data?.wind?.speed ?? null,
      icon: data?.weather?.[0]?.icon || "",
      // Surface units to the caller for correct UI labels
      units,
    };
    return normalized;
  } catch (e) {
    // Network or parsing error or structured error from parseOwmError
    const err = new Error(e?.message || "Network error while fetching weather.");
    // Map known errors to their codes, default to NETWORK_ERROR for fetch failures
    err.code = e?.code || (e?.name === "TypeError" ? "NETWORK_ERROR" : "UNKNOWN_ERROR");
    err.status = e?.status;
    throw err;
  }
}

// PUBLIC_INTERFACE
export function getWeatherRuntimeInfo() {
  /** Return current runtime config useful for debugging issues in UI or tests. */
  const { base, key, units } = getRuntimeConfig();
  return {
    base,
    hasKey: Boolean(key),
    units,
  };
}
