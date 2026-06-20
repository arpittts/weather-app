import { Sun, Moon, Cloud, CloudRain, CloudLightning, Snowflake, Wind } from 'lucide-react';

export const getWeatherIcon = (iconCode, size = 48) => {
  if (!iconCode) return <Sun size={size} className="animate-pulse-soft" />;
  const isNight = iconCode.endsWith('n');
  const code = iconCode.substring(0, 2);
  
  switch(code) {
    case '01': // clear
      return isNight ? <Moon size={size} color="#fcd34d" /> : <Sun size={size} color="#fcc419" className="animate-pulse-soft" />;
    case '02': // few clouds
    case '03': // scattered clouds
    case '04': // broken/overcast clouds
      return <Cloud size={size} color="#cbd5e1" />;
    case '09': // shower rain
    case '10': // rain
      return <CloudRain size={size} color="#60a5fa" />;
    case '11': // thunderstorm
      return <CloudLightning size={size} color="#a78bfa" />;
    case '13': // snow
      return <Snowflake size={size} color="#93c5fd" />;
    case '50': // mist/fog
      return <Wind size={size} color="#cbd5e1" />;
    default:
      return <Sun size={size} color="#fcc419" />;
  }
};

export const formatLocalTime = (timestamp, timezoneOffsetSec, showTimeOnly = false) => {
  const date = new Date((timestamp + timezoneOffsetSec) * 1000);
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const dayName = days[date.getUTCDay()];
  const monthName = months[date.getUTCMonth()];
  const dateNum = date.getUTCDate();
  
  let hours = date.getUTCHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  
  if (showTimeOnly) {
    return `${hours}:${minutes} ${ampm}`;
  }
  return `${dayName}, ${monthName} ${dateNum} • ${hours}:${minutes} ${ampm}`;
};
