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

### 2) Configure environment variables
Create a `.env` file in this directory by copying `.env.example`:
```
cp .env.example .env
```
Edit `.env` and set:
- `REACT_APP_OPENWEATHER_API_KEY` — your OpenWeatherMap API key (required)
- `REACT_APP_WEATHER_API_BASE` — defaults to `https://api.openweathermap.org/data/2.5` if omitted
- `REACT_APP_WEATHER_UNITS` — optional: one of `standard`, `metric`, or `imperial` (default: `metric`)

Important:
- Variables must be prefixed with `REACT_APP_` to be exposed to the client by Create React App.
- After changing `.env`, you MUST restart `npm start` for changes to take effect.

### 3) Run the app
```
npm start
```
Visit http://localhost:3000

### 4) Build for production
```
npm run build
```

## Security notes
- API keys are read from environment variables; never hardcode secrets.
- City input is trimmed and validated to avoid unnecessary requests.
- Network and HTTP errors are handled gracefully without exposing stack traces.

## Project Structure
- `src/api/weatherService.js` — API service (`getWeatherByCity(city)`)
- `src/components/SearchBar.jsx` — search input and button
- `src/components/WeatherCard.jsx` — weather display card
- `src/App.js` — main app logic and state
- `src/index.css` — global styles and theme
- `src/App.css` — theme variables and toggle styles

## Troubleshooting

- "API key missing. Please configure .env and restart the app."
  - Ensure `.env` contains `REACT_APP_OPENWEATHER_API_KEY=...`
  - Restart `npm start` after editing `.env` (CRA reads env at startup).
- "Invalid API key."
  - The key is present but incorrect. Verify on OpenWeatherMap.
- "City not found."
  - The city name is invalid/unknown. Try a different spelling.
- Still failing?
  - Check network tab for requests to `https://api.openweathermap.org/data/2.5/weather?...`
  - Confirm `REACT_APP_WEATHER_UNITS` is one of `standard|metric|imperial`.

## Attributions
Weather data by [OpenWeatherMap](https://openweathermap.org/).
