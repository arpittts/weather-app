import { useState } from 'react';
import { Search, MapPin, X } from 'lucide-react';

function SearchBar({ onSearch, onGeoSearch, isLoading }) {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim() === '') return;
    onSearch(city);
  };

  const handleClear = () => {
    setCity('');
  };

  return (
    <div className="search-controls">
      <form onSubmit={handleSubmit} className="search-bar-form">
        <div className="search-input-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search for a city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={isLoading}
          />
          {city && (
            <button
              type="button"
              className="clear-btn"
              onClick={handleClear}
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="search-submit-btn"
          disabled={isLoading || city.trim() === ''}
        >
          Search
        </button>
      </form>
      
      <button
        type="button"
        className="geo-btn"
        onClick={onGeoSearch}
        disabled={isLoading}
        title="Use Current Location"
        aria-label="Use Current Location"
      >
        <MapPin size={22} />
      </button>
    </div>
  );
}

export default SearchBar;
