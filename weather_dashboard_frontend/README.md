# Weather Dashboard (React)

A modern, lightweight Weather Dashboard built with React. Search for a city to view current weather using the OpenWeatherMap API. Styled with the "Ocean Professional" theme.

## Features
- Search by city with input validation
- Current weather: temperature, condition, humidity, wind, and icon
- Loading spinner and error handling (e.g., "City not found")
- Light/Dark theme toggle
- No UI frameworks; clean CSS with subtle shadows and rounded corners
- Environment-based configuration (no hardcoded keys)

## Getting Started

### 1) Install dependencies
```
npm install
```

### 2) Configure environment variables (Vite-style)
Create a `.env` file in this directory by copying `.env.example`:
```
cp .env.example .env
```
Edit `.env` and set:
- `VITE_WEATHER_API_KEY` — your OpenWeatherMap API key (required)
- `VITE_WEATHER_API_BASE` — optional, defaults to `https://api.openweathermap.org/data/2.5`
- `VITE_WEATHER_UNITS` — optional: one of `standard`, `metric`, or `imperial` (default: `metric`)

Important:
- Variables must be prefixed with `VITE_` to be exposed to the client.
- After changing `.env`, you MUST restart the dev server for changes to take effect.

### 3) Run the app
```
npm start
```
Visit http://localhost:3000

Example request URL the app will call:
```
https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_KEY&units=metric
```

### 4) Build for production
```
npm run build
```

## Security notes
- API keys are read from environment variables; never hardcode secrets.
- City input is trimmed and validated to avoid unnecessary requests.
- Network and HTTP errors are handled gracefully without exposing stack traces.
- All third-party requests use HTTPS.

## Project Structure
- `src/api/weatherService.js` — API service (`getWeatherByCity(city)`) and runtime info helper
- `src/components/SearchBar.jsx` — search input and button
- `src/components/WeatherCard.jsx` — weather display card
- `src/App.js` — main app logic and state
- `src/index.css` — global styles and theme
- `src/App.css` — theme variables and toggle styles

## Troubleshooting

- "API key missing. Create .env with VITE_WEATHER_API_KEY=your_key and restart the dev server."
  - Ensure `.env` contains `VITE_WEATHER_API_KEY=...`
  - Restart `npm start` after editing `.env` (env is read at startup).
- "Invalid API key."
  - The key is present but incorrect. Verify on OpenWeatherMap.
- "City not found."
  - The city name is invalid/unknown. Try a different spelling.
- "Rate limit reached."
  - You have exceeded the API rate limits; wait and retry.
- Still failing?
  - Check the network tab for requests to `https://api.openweathermap.org/data/2.5/weather?...`
  - Confirm `VITE_WEATHER_UNITS` is one of `standard|metric|imperial`.

## Run and Build
- Development: `npm start` (http://localhost:3000)
- Production build: `npm run build` (outputs to `build/`)
- After updating `.env`, always restart `npm start`.

## Attributions
Weather data by [OpenWeatherMap](https://openweathermap.org/).
