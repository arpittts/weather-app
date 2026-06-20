# Aether Weather | Premium React Dashboard

A state-of-the-art, glassmorphic weather application built using React, Vite, and the OpenWeatherMap API. Designed with refined aesthetics, smooth animations, and advanced developer practices that make it a standout portfolio project.

**🌐 Live Demo**: [https://weather-app-nine-black-40.vercel.app](https://weather-app-nine-black-40.vercel.app)

## 🌟 Key Features

- **Dynamic Weather Themes**: The background interface smoothly shifts between premium HSL gradients matching the current weather conditions (Sunny/Clear, Clouds, Rain, Snow, Thunderstorm, Mist) and automatically shifts for Day/Night cycles.
- **Timezone-Correct Local Times**: Displays the exact local time and date of the searched city by computing the target UTC offset, rather than falling back to the browser's system clock.
- **Concurrent API Operations**: Utilizes `Promise.all` to fetch current weather and 5-day / 3-hour forecasts concurrently, eliminating serial request waterfalls.
- **One-Click Geolocation**: Instantly locates the user using the browser's Geolocation API to serve current local weather data upon initial load.
- **Unit Converter (°C / °F)**: Effortlessly switches units of temperature and wind velocity on the client side, ensuring zero extra network round-trips.
- **Saved Cities Panel**: Store bookmarked locations using a persistent `localStorage` cache. Users can add cities by starring them on the weather card, and search them directly with a single click.
- **Clean Architecture & ESLint Compliance**: Fully optimized codebase featuring strict hooks validation, lazy state initializers, decoupled helper scripts, and responsive grids.

---

## 🛠️ Technology Stack

- **Frontend Core**: [React 19](https://react.dev/) + [Vite](https://vite.dev/) (lightning-fast Hot Module Replacement)
- **Styling**: Vanilla CSS (glassmorphic styling, custom scrollbars, keyframe-based entrance transitions)
- **Icons**: [Lucide React](https://lucide.dev/) (high-quality scalable SVG vectors)
- **Data Source**: [OpenWeatherMap API](https://openweathermap.org/api)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/arpitsingh/weather-app.git
   cd weather-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root folder (referenced in `.gitignore` so your API key remains private):
   ```env
   VITE_WEATHER_API_KEY=your_openweathermap_api_key
   ```
   *(You can obtain a free key at [openweathermap.org](https://openweathermap.org/))*

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

5. **Lint and Build**:
   ```bash
   # Run the linter
   npm run lint

   # Build for production
   npm run build
   ```

---

## 📸 Component Architecture

```
weather-app/
├── src/
│   ├── main.jsx          # App entrypoint
│   ├── index.css         # Global style tokens, animations, and HSL gradients
│   ├── App.jsx           # Coordinate state management & API logic
│   ├── App.css           # Grid layouts & component styles
│   ├── components/
│   │   ├── SearchBar.jsx      # Autocomplete search & location triggers
│   │   ├── WeatherCard.jsx    # Primary statistics, wind direction & feels-like
│   │   ├── ForecastSection.jsx# Scrollable hourly and 5-day daily forecasts
│   │   └── FavoritesBar.jsx   # Cached cities bookmark bar
│   └── utils/
│       └── weatherUtils.jsx   # Timezone converters & custom SVG mapping
```

---

## 💡 Engineering Highlights (For Interviewers)

- **Lazy State Initialization**: The Saved Cities cache loads from `localStorage` within a state initializer callback (`useState(() => JSON.parse(saved))`), avoiding redundant reads and component cascading renders during mount.
- **Fast Refresh Compatibility**: Split core business helpers out of component modules into a dedicated utility script. This ensures Vite's HMR can track hot component reloads accurately without losing React state.
- **Responsive Fluid Layouts**: Fully responsive grids that rearrange seamlessly from single-column mobile views to multi-panel widescreen dashboards.
