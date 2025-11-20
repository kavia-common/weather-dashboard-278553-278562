//
// Weather API Service Module
// Handles communication with OpenWeatherMap Current Weather API using env variables.
//

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
   *    temperature: number, // Celsius
   *    condition: string,
   *    humidity: number,
   *    windSpeed: number, // m/s
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
  const base = process.env.REACT_APP_WEATHER_API_BASE || process.env.REACT_APP_OPENWEATHER_API_BASE || "https://api.openweathermap.org/data/2.5";
  const key = process.env.REACT_APP_OPENWEATHER_API_KEY;

  if (!key) {
    const err = new Error("Missing OpenWeatherMap API key. Please set REACT_APP_OPENWEATHER_API_KEY in your .env file.");
    err.code = "MISSING_API_KEY";
    throw err;
  }

  const url = `${base}/weather?q=${encodeURIComponent(city)}&appid=${encodeURIComponent(key)}&units=metric`;

  try {
    const resp = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!resp.ok) {
      if (resp.status === 404) {
        const err = new Error("City not found. Please try another search.");
        err.code = "CITY_NOT_FOUND";
        throw err;
      }
      const err = new Error("Failed to fetch weather. Please try again later.");
      err.code = "HTTP_ERROR";
      err.status = resp.status;
      throw err;
    }

    const data = await resp.json();

    // Normalize response
    const normalized = {
      city: data?.name || city,
      country: data?.sys?.country || "",
      temperature: typeof data?.main?.temp === "number" ? Math.round(data.main.temp) : null,
      condition: data?.weather?.[0]?.main || "N/A",
      description: data?.weather?.[0]?.description || "",
      humidity: data?.main?.humidity ?? null,
      windSpeed: data?.wind?.speed ?? null,
      icon: data?.weather?.[0]?.icon || "",
    };
    return normalized;
  } catch (e) {
    // Network or parsing error
    const err = new Error(e?.message || "Network error while fetching weather.");
    err.code = e?.code || "NETWORK_ERROR";
    throw err;
  }
}
