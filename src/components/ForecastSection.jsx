import { getWeatherIcon, formatLocalTime } from '../utils/weatherUtils';

function ForecastSection({ forecastData, timezone, unit }) {
  if (!forecastData || !forecastData.list) return null;

  const { list } = forecastData;

  // 1. Hourly Forecast (first 8 readings, which cover 24 hours)
  const hourlyForecast = list.slice(0, 8);

  // 2. Process Daily Forecast (grouping 3-hour readings into 5 calendar days)
  const processDailyForecast = () => {
    const dailyMap = {};

    list.forEach((item) => {
      // Find the date in the city's local timezone
      const date = new Date((item.dt + timezone) * 1000);
      const dateKey = date.toUTCString().substring(5, 16); // e.g., "21 Jun 2026"

      if (!dailyMap[dateKey]) {
        dailyMap[dateKey] = {
          temps: [],
          weather: item.weather[0],
          dt: item.dt,
        };
      }

      dailyMap[dateKey].temps.push(item.main.temp);

      // Prefer midday weather condition for the day's summary
      const localHour = date.getUTCHours();
      if (localHour >= 11 && localHour <= 15) {
        dailyMap[dateKey].weather = item.weather[0];
      }
    });

    // Convert map to sorted array of objects
    return Object.keys(dailyMap)
      .map((dateKey) => {
        const dayData = dailyMap[dateKey];
        const maxTemp = Math.max(...dayData.temps);
        const minTemp = Math.min(...dayData.temps);
        return {
          dateKey,
          dt: dayData.dt,
          maxTemp,
          minTemp,
          weather: dayData.weather,
        };
      })
      .slice(0, 5); // Return next 5 days
  };

  const dailyForecast = processDailyForecast();

  // Convert temperature helper
  const convertTemp = (tempC) => {
    return unit === 'C' ? tempC : (tempC * 9) / 5 + 32;
  };

  return (
    <div className="details-column animate-fade-in">
      {/* 24-Hour Hourly Forecast */}
      <div className="hourly-forecast-panel glass-panel">
        <h3 className="highlights-title">Hourly Forecast</h3>
        <div className="hourly-scroll custom-scrollbar">
          {hourlyForecast.map((hour, idx) => {
            const temp = convertTemp(hour.main.temp);
            const timeStr = formatLocalTime(hour.dt, timezone, true);
            return (
              <div key={idx} className="hourly-card">
                <span className="hourly-time">{timeStr}</span>
                {getWeatherIcon(hour.weather[0].icon, 36)}
                <span className="hourly-temp">{Math.round(temp)}°</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5-Day Daily Forecast */}
      <div className="daily-forecast-panel glass-panel">
        <h3 className="highlights-title">5-Day Forecast</h3>
        <div className="daily-list">
          {dailyForecast.map((day, idx) => {
            const maxTemp = convertTemp(day.maxTemp);
            const minTemp = convertTemp(day.minTemp);
            
            // Format Day Name (e.g., "Monday" or "Today" for index 0)
            const dayName = idx === 0 
              ? 'Today' 
              : (() => {
                  const date = new Date((day.dt + timezone) * 1000);
                  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                  return days[date.getUTCDay()];
                })();

            return (
              <div key={idx} className="daily-row">
                <span className="daily-day">{dayName}</span>
                <div className="daily-weather-info">
                  {getWeatherIcon(day.weather.icon, 32)}
                  <span className="daily-condition">{day.weather.description}</span>
                </div>
                <div className="daily-temp-range">
                  <span className="daily-temp-max">{Math.round(maxTemp)}°</span>
                  <span className="daily-temp-min">{Math.round(minTemp)}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ForecastSection;
