# weather-forecast
 simple weather forecast widget

## Setup

1. Copy `config.example.js` to `config.js` and put your OpenWeatherMap API key in it.
2. Open `index.html` in a browser and allow geolocation (works from `file://` or any static server).

Uses the free OpenWeatherMap `weather` and `forecast` endpoints: current conditions plus a 5-day forecast for your location, with the city name resolved via Nominatim.
