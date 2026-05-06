//component hien thi 1 combo card
export default function ComboCard({ combo, onView }) {
  return (
    <div className="combo-card">
      {/* combo image */}
      <div className="combo-image">
        {combo.image_url ? (
          <img
            src={`/images/${combo.image_url}`}
            alt={combo.title}
          />
        ) : (
          <div className="image-placeholder">
            Image
          </div>
        )}

        {/* deal badge */}
        <span className="deal-badge">
          ⚡ HOT DEAL
        </span>

        {/* region badge */}
        <span className="region-badge">
          {combo.region}
        </span>
      </div>

      {/* combo content */}
      <div className="combo-content">
        <h3>{combo.title}</h3>

        <p className="combo-meta">
          📍 {combo.destination}
        </p>

        <p className="combo-meta">
          ◷ {combo.duration_days} days
        </p>

        <span className="type-badge">
          {combo.accommodation_type || 'Travel'}
        </span>

        {/* price and button */}
        <div className="price-row">
          <div>
            <small>Total price</small>

            <p className="price">
              {Number(combo.original_price).toLocaleString('vi-VN')} đ
            </p>
          </div>

          <button onClick={onView}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}