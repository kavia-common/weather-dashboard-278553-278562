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
- `REACT_APP_OPENWEATHER_API_KEY` — your OpenWeatherMap API key
- `REACT_APP_WEATHER_API_BASE` — defaults to `https://api.openweathermap.org/data/2.5` if omitted

Note: Variables must be prefixed with `REACT_APP_` to be exposed to the client by Create React App.

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

## Attributions
Weather data by [OpenWeatherMap](https://openweathermap.org/).
