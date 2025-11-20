//
//
// Weather API Service Module
// Handles communication with OpenWeatherMap Current Weather API using env variables.
// Adds robust error differentiation for configuration vs. city-not-found,
// supports configurable units and clearer error messages.
//

/**
 * Read runtime configuration from CRA env (available at build time).
 * This function centralizes env lookups and defaults.
 */
function getRuntimeConfig() {
  const base =
    process.env.REACT_APP_WEATHER_API_BASE ||
    process.env.REACT_APP_OPENWEATHER_API_BASE ||
    "https://api.openweathermap.org/data/2.5";

  // Allowed: "standard", "metric", "imperial"
  const unitsRaw = (process.env.REACT_APP_WEATHER_UNITS || "metric").trim().toLowerCase();
  const allowedUnits = new Set(["standard", "metric", "imperial"]);
  const units = allowedUnits.has(unitsRaw) ? unitsRaw : "metric";

  const key = process.env.REACT_APP_OPENWEATHER_API_KEY;

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
    const err = new Error(message || "Invalid API key. Please verify REACT_APP_OPENWEATHER_API_KEY.");
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
   *    temperature: number, // unit depends on REACT_APP_WEATHER_UNITS
   *    condition: string,
   *    humidity: number,
   *    windSpeed: number, // m/s or mph based on units
   *    icon: string, // icon code
   *    description: string
   *  }
   */
  const city = typeof cityRaw === "string" ? cityRaw.trim() : "";
  if (!city || city.length < 2) {
    const err = new Error("Please enter at least 2 characters for the city.");
    err.code = "VALIDATION_ERROR";
    throw err;
  }

  // Read from env (Create React App exposes REACT_APP_* at build time)
  const { base, key, units } = getRuntimeConfig();

  if (!key) {
    const err = new Error(
      "Missing OpenWeatherMap API key. Please set REACT_APP_OPENWEATHER_API_KEY in your .env file and restart the dev server."
    );
    err.code = "MISSING_API_KEY";
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
      // Optionally surface units to the caller if needed in UI
      units,
    };
    return normalized;
  } catch (e) {
    // Network or parsing error
    const err = new Error(e?.message || "Network error while fetching weather.");
    err.code = e?.code || "NETWORK_ERROR";
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
