import { Star, X } from 'lucide-react';

function FavoritesBar({ favorites, onSelectCity, onRemoveFavorite }) {
  if (!favorites || favorites.length === 0) {
    return (
      <div className="favorites-bar">
        <span className="favorites-label">
          <Star size={14} /> Saved Cities:
        </span>
        <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.4)' }}>
          No saved cities yet. Search and click the star to bookmark!
        </span>
      </div>
    );
  }

  return (
    <div className="favorites-bar">
      <span className="favorites-label font-medium">
        <Star size={14} fill="#facc15" color="#facc15" /> Saved Cities:
      </span>
      {favorites.map((city, idx) => (
        <div key={idx} className="fav-tag" onClick={() => onSelectCity(city)}>
          <span>{city}</span>
          <button
            type="button"
            className="remove-fav-btn"
            onClick={(e) => {
              e.stopPropagation(); // Avoid triggering search on click
              onRemoveFavorite(city);
            }}
            title={`Remove ${city}`}
            aria-label={`Remove ${city}`}
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default FavoritesBar;
