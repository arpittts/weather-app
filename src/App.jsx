import { useState, useEffect, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ForecastSection from './components/ForecastSection';
import FavoritesBar from './components/FavoritesBar';
import { CloudLightning, AlertCircle } from 'lucide-react';
import './App.css';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState('C'); // 'C' for Celsius, 'F' for Fahrenheit
  
  // Lazy state initialization to satisfy react-hooks/set-state-in-effect
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('weather_fav_cities');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Sync favorites with localStorage
  const saveFavorites = (updatedList) => {
    setFavorites(updatedList);
    localStorage.setItem('weather_fav_cities', JSON.stringify(updatedList));
  };

  const handleToggleFavorite = () => {
    if (!weatherData) return;
    const cityName = weatherData.name;
    if (favorites.includes(cityName)) {
      const updated = favorites.filter(c => c !== cityName);
      saveFavorites(updated);
    } else {
      const updated = [...favorites, cityName];
      saveFavorites(updated);
    }
  };

  const handleRemoveFavorite = (cityName) => {
    const updated = favorites.filter(c => c !== cityName);
    saveFavorites(updated);
  };

  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    setLoading(true);
    setError('');
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

      const [weatherRes, forecastRes] = await Promise.all([
        fetch(weatherUrl),
        fetch(forecastUrl)
      ]);

      if (!weatherRes.ok) {
        throw new Error(`Failed to fetch current weather (status ${weatherRes.status})`);
      }
      if (!forecastRes.ok) {
        throw new Error(`Failed to fetch forecast (status ${forecastRes.status})`);
      }

      const wData = await weatherRes.json();
      const fData = await forecastRes.json();

      setWeatherData(wData);
      setForecastData(fData);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An error occurred fetching weather data.');
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeatherByCity = useCallback(async (city) => {
    if (!city || city.trim() === '') return;
    setLoading(true);
    setError('');
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;

      const [weatherRes, forecastRes] = await Promise.all([
        fetch(weatherUrl),
        fetch(forecastUrl)
      ]);

      if (!weatherRes.ok) {
        if (weatherRes.status === 404) {
          throw new Error(`City "${city}" not found. Please verify the spelling.`);
        } else if (weatherRes.status === 401) {
          throw new Error('Invalid API Key. Please verify your OpenWeatherMap credentials.');
        } else {
          throw new Error(`Error: ${weatherRes.statusText || 'Unable to fetch weather data.'}`);
        }
      }
      
      if (!forecastRes.ok) {
        throw new Error('Failed to fetch forecast details.');
      }

      const wData = await weatherRes.json();
      const fData = await forecastRes.json();

      setWeatherData(wData);
      setForecastData(fData);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An error occurred fetching weather data.');
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      fetchWeatherByCity('Delhi'); // fallback to Delhi
      return;
    }

    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      (err) => {
        console.warn('Geolocation denied or failed. Loading default city Delhi.', err.message);
        fetchWeatherByCity('Delhi'); // fallback
      }
    );
  }, [fetchWeatherByCoords, fetchWeatherByCity]);

  // Trigger geolocation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      handleGeolocation();
    }, 0);
    return () => clearTimeout(timer);
  }, [handleGeolocation]);

  const getThemeClass = () => {
    if (!weatherData || !weatherData.weather || !weatherData.weather[0]) return 'theme-default';
    const mainCondition = weatherData.weather[0].main;
    const icon = weatherData.weather[0].icon;
    const isNight = icon ? icon.endsWith('n') : false;

    switch (mainCondition) {
      case 'Clear':
        return isNight ? 'theme-clear-night' : 'theme-clear-day';
      case 'Clouds':
        return isNight ? 'theme-clouds-night' : 'theme-clouds-day';
      case 'Rain':
      case 'Drizzle':
        return 'theme-rain';
      case 'Snow':
        return 'theme-snow';
      case 'Thunderstorm':
        return 'theme-thunderstorm';
      case 'Mist':
      case 'Smoke':
      case 'Haze':
      case 'Dust':
      case 'Fog':
      case 'Sand':
      case 'Ash':
      case 'Squall':
      case 'Tornado':
        return 'theme-mist';
      default:
        return 'theme-default';
    }
  };

  return (
    <div className={`app-container ${getThemeClass()}`}>
      <div className="dashboard-wrapper">
        
        {/* Header Section */}
        <header className="app-header glass-panel">
          <div className="brand-section">
            <CloudLightning className="logo-icon animate-pulse-soft" />
            <h1 className="app-title">Aether Weather</h1>
          </div>
          <div className="header-controls">
            <div className="unit-toggle">
              <button 
                className={`unit-btn ${unit === 'C' ? 'active' : ''}`}
                onClick={() => setUnit('C')}
              >
                °C
              </button>
              <button 
                className={`unit-btn ${unit === 'F' ? 'active' : ''}`}
                onClick={() => setUnit('F')}
              >
                °F
              </button>
            </div>
          </div>
        </header>

        {/* Search Controls */}
        <SearchBar 
          onSearch={fetchWeatherByCity} 
          onGeoSearch={handleGeolocation} 
          isLoading={loading} 
        />

        {/* Saved Cities Bar */}
        <FavoritesBar 
          favorites={favorites} 
          onSelectCity={fetchWeatherByCity} 
          onRemoveFavorite={handleRemoveFavorite} 
        />

        {/* Status / Errors */}
        {loading && (
          <div className="status-container glass-panel">
            <div className="status-loading-spinner"></div>
            <p className="status-message">Fetching local weather configurations...</p>
          </div>
        )}

        {error && !loading && (
          <div className="status-container glass-panel animate-fade-in">
            <AlertCircle className="status-error-icon" />
            <p className="status-message" style={{ color: '#f87171' }}>{error}</p>
          </div>
        )}

        {/* Main Dashboard Layout */}
        {!loading && !error && weatherData && (
          <main className="dashboard-grid">
            <WeatherCard 
              data={weatherData} 
              unit={unit} 
              isFavorite={favorites.includes(weatherData.name)}
              onToggleFavorite={handleToggleFavorite}
            />
            <ForecastSection 
              forecastData={forecastData} 
              timezone={weatherData.timezone}
              unit={unit}
            />
          </main>
        )}

        {/* Initial Placeholder (if no weather data loaded yet) */}
        {!loading && !error && !weatherData && (
          <div className="status-container glass-panel">
            <div className="intro-placeholder">
              <CloudLightning size={48} className="intro-icon" />
              <h2>Welcome to Aether</h2>
              <p>Detecting your location or searching a city will display live weather patterns, wind velocities, and five-day forecasts instantly.</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="app-footer">
          <p>© {new Date().getFullYear()} Aether Weather. Powered by <a href="https://openweathermap.org" target="_blank" rel="noopener noreferrer">OpenWeatherMap API</a>.</p>
        </footer>

      </div>
    </div>
  );
}

export default App;
