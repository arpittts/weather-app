import { 
  Thermometer, Droplets, Wind, Compass, Gauge, Eye, Sunrise, Sunset, Star
} from 'lucide-react';
import { getWeatherIcon, formatLocalTime } from '../utils/weatherUtils';

function WeatherCard({ data, unit, isFavorite, onToggleFavorite }) {
  if (!data) return null;

  const { name, main, weather, wind, sys, timezone, visibility } = data;
  
  // Client side temperature conversions
  const tempCelsius = main.temp;
  const tempDisplay = unit === 'C' ? tempCelsius : (tempCelsius * 9/5) + 32;
  
  const feelsLikeCelsius = main.feels_like;
  const feelsLikeDisplay = unit === 'C' ? feelsLikeCelsius : (feelsLikeCelsius * 9/5) + 32;
  
  const minTempCelsius = main.temp_min;
  const minTempDisplay = unit === 'C' ? minTempCelsius : (minTempCelsius * 9/5) + 32;

  const maxTempCelsius = main.temp_max;
  const maxTempDisplay = unit === 'C' ? maxTempCelsius : (maxTempCelsius * 9/5) + 32;

  // Wind speed conversion (m/s to mph if Imperial)
  const windSpeedDisplay = unit === 'C' ? wind.speed : wind.speed * 2.237;
  const windUnit = unit === 'C' ? 'm/s' : 'mph';

  // Get wind compass direction
  const getWindDirection = (deg) => {
    if (deg === undefined) return 'N/A';
    const index = Math.floor(((deg + 22.5) % 360) / 45);
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[index];
  };

  // Visibility conversion (m to km or miles)
  const visibilityVal = visibility ? (unit === 'C' ? (visibility / 1000).toFixed(1) : (visibility / 1609.34).toFixed(1)) : 'N/A';
  const visibilityUnit = unit === 'C' ? 'km' : 'mi';

  return (
    <div className="current-weather-card glass-panel animate-fade-in">
      <div className="weather-header">
        <div className="location-info">
          <h2>{name}, {sys.country}</h2>
          <p className="date-time">{formatLocalTime(data.dt, timezone)}</p>
        </div>
        <button 
          className={`favorite-toggle-btn ${isFavorite ? 'is-favorite' : ''}`}
          onClick={onToggleFavorite}
          title={isFavorite ? 'Remove from Saved Cities' : 'Save City'}
          aria-label={isFavorite ? 'Remove from Saved Cities' : 'Save City'}
        >
          <Star size={20} fill={isFavorite ? '#facc15' : 'none'} />
        </button>
      </div>

      <div className="main-temp-display">
        <div className="weather-illustration-container">
          {getWeatherIcon(weather[0].icon, 80)}
        </div>
        <div>
          <p className="temp-number">{Math.round(tempDisplay)}°</p>
          <div className="condition-summary">
            <span className="condition-text">{weather[0].description}</span>
            <span className="temp-limits">
              H: {Math.round(maxTempDisplay)}° &nbsp;L: {Math.round(minTempDisplay)}°
            </span>
          </div>
        </div>
      </div>

      <div className="highlights-title">Current Weather Details</div>
      <div className="highlights-grid">
        <div className="stat-box">
          <div className="stat-icon-wrapper">
            <Thermometer className="stat-icon" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Feels Like</span>
            <span className="stat-value">{Math.round(feelsLikeDisplay)}°</span>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon-wrapper">
            <Droplets className="stat-icon" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Humidity</span>
            <span className="stat-value">{main.humidity}%</span>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon-wrapper">
            <Wind className="stat-icon" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Wind</span>
            <span className="stat-value">{windSpeedDisplay.toFixed(1)} <span style={{fontSize: '11px'}}>{windUnit}</span></span>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon-wrapper">
            <Compass className="stat-icon" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Direction</span>
            <span className="stat-value">{getWindDirection(wind.deg)} ({wind.deg || 0}°)</span>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon-wrapper">
            <Gauge className="stat-icon" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Pressure</span>
            <span className="stat-value">{main.pressure} hPa</span>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon-wrapper">
            <Eye className="stat-icon" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Visibility</span>
            <span className="stat-value">{visibilityVal} {visibilityUnit}</span>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon-wrapper">
            <Sunrise className="stat-icon" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Sunrise</span>
            <span className="stat-value">{formatLocalTime(sys.sunrise, timezone, true)}</span>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon-wrapper">
            <Sunset className="stat-icon" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Sunset</span>
            <span className="stat-value">{formatLocalTime(sys.sunset, timezone, true)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
