import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import api from '../services/api';
import Sidebar from '../components/Sidebar';

import '../styles/combo-detail.css';

// page chi tiet combo + tinh final price
export default function ComboDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // state luu thong tin combo
  const [combo, setCombo] = useState(null);

  // state luu promotions
  const [promotions, setPromotions] = useState([]);

  // state loading va error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // state so nguoi
  const [people, setPeople] = useState(1);

  // state luu ket qua tinh gia
  const [priceData, setPriceData] = useState(null);

  // goi api khi mo trang
  useEffect(() => {
    fetchComboDetail();
  }, [id]);

  // api lay chi tiet combo
  const fetchComboDetail = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get(`/combos/${id}`);

      // api moi co combo + promotions
      setCombo(response.data.data.combo);
      setPromotions(response.data.data.promotions || []);

    } catch (err) {
      console.error(err);
      setError('Failed to load combo detail');
    } finally {
      setLoading(false);
    }
  };

  // api tinh final price theo so nguoi
  const fetchFinalPrice = async () => {
    try {
      const response = await api.get(
        `/combos/${id}/final-price?number_of_people=${people}`
      );

      setPriceData(response.data.data);

    } catch (err) {
      console.error(err);
    }
  };

  // chuyen sang booking page
  const handleBookNow = () => {
    navigate(`/booking?combo_id=${combo.combo_id}&people=${people}`);
  };

  // loading UI
  if (loading) {
    return <h2 style={{ padding: '20px' }}>Loading combo detail...</h2>;
  }

  // error UI
  if (error) {
    return <h2 style={{ padding: '20px', color: 'red' }}>{error}</h2>;
  }

  // combo not found UI
  if (!combo) {
    return <h2 style={{ padding: '20px' }}>Combo not found.</h2>;
  }

  return (
    <div className="app-layout">

      {/* main content */}
      <main className="main-content">

        <div className="combo-detail-page">

          {/* back button */}
          <button
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          {/* hero image */}
          <div className="detail-hero">

            <img
              src={combo.image_url}
              alt={combo.title}
              className="detail-image"
            />

            <span className="detail-badge">
              {combo.region}
            </span>

          </div>

          {/* combo info */}
          <div className="detail-card">

            <h1>{combo.title}</h1>

            {/* meta info */}
            <div className="detail-meta">

              <div className="meta-item">
                <span>📍</span>

                <div>
                  <p>Destination</p>
                  <strong>{combo.destination}</strong>
                </div>
              </div>

              <div className="meta-item">
                <span>🕒</span>

                <div>
                  <p>Duration</p>

                  <strong>
                    {combo.duration_days} days

                    {combo.duration_nights
                      ? ` ${combo.duration_nights} nights`
                      : ''}
                  </strong>
                </div>
              </div>

              <div className="meta-item">
                <span>🏷️</span>

                <div>
                  <p>Combo Type</p>
                  <strong>{combo.combo_type}</strong>
                </div>
              </div>

            </div>

            {/* description */}
            <p className="detail-description">
              {combo.description}
            </p>

          </div>

          {/* transportation */}
          {combo.transportation && (
            <div className="detail-card">

              <h2>Transportation</h2>

              <p className="detail-description">
                {combo.transportation}
              </p>

            </div>
          )}

          {/* promotions */}
          {promotions.length > 0 && (
            <div className="detail-card">

              <h2>🔥 Available Promotions</h2>

              <div className="highlight-grid">

                {promotions.map((promo) => (

                  <div
                    key={promo.promotion_id}
                    className="highlight-item"
                  >
                    <h3>{promo.title}</h3>

                    <p>
                      {promo.discount_type === 'percentage'
                        ? `${promo.discount_value}% OFF`
                        : `${Number(promo.discount_value).toLocaleString('vi-VN')} đ OFF`}
                    </p>

                  </div>

                ))}

              </div>

            </div>
          )}

          {/* highlights */}
          {combo.highlights && (
            <div className="detail-card">

              <h2>✨ Highlights</h2>

              <div className="highlight-grid">

                {combo.highlights
                  .split(',')
                  .map((item, index) => (

                    <div
                      key={index}
                      className="highlight-item"
                    >
                      ✓ {item.trim()}
                    </div>

                  ))}

              </div>

            </div>
          )}

          {/* itinerary */}
          {combo.itinerary && (
            <div className="detail-card">

              <h2>📅 Itinerary</h2>

              <div className="timeline">

                {combo.itinerary
                  .split('|')
                  .map((item, index) => (

                    <div
                      key={index}
                      className="timeline-item"
                    >
                      <div className="timeline-number">
                        {index + 1}
                      </div>

                      <p>{item.trim()}</p>
                    </div>

                  ))}

              </div>

            </div>
          )}

          {/* included services */}
          {combo.included_services && (
            <div className="detail-card">

              <h2>Included Services</h2>

              <div className="highlight-grid">

                {combo.included_services
                  .split(',')
                  .map((item, index) => (

                    <div
                      key={index}
                      className="highlight-item"
                    >
                      ✅ {item.trim()}
                    </div>

                  ))}

              </div>

            </div>
          )}

          {/* excluded services */}
          {combo.excluded_services && (
            <div className="detail-card">

              <h2>Excluded Services</h2>

              <div className="highlight-grid">

                {combo.excluded_services
                  .split(',')
                  .map((item, index) => (

                    <div
                      key={index}
                      className="highlight-item"
                    >
                      ❌ {item.trim()}
                    </div>

                  ))}

              </div>

            </div>
          )}

          {/* booking section */}
          <div className="booking-card">

            <p className="price-label">
              Starting from
            </p>

            <h2 className="booking-price">
              {Number(combo.original_price).toLocaleString('vi-VN')} đ
            </h2>

            <p className="price-person">
              per package
            </p>

            {/* people input */}
            <div className="booking-field">

              <label>Number of Travelers</label>

              <input
                type="number"
                min="1"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
              />

            </div>

            {/* calculate button */}
            <button
              className="calculate-btn"
              onClick={fetchFinalPrice}
            >
              Calculate Final Price
            </button>

            {/* final price result */}
            {priceData && (
              <div className="price-summary">

                <div className="summary-row">
                  <span>Original Price</span>

                  <strong>
                    {Number(priceData.original_price).toLocaleString('vi-VN')} đ
                  </strong>
                </div>

                <div className="summary-row discount">
                  <span>Discount</span>

                  <strong>
                    {Number(priceData.discount_amount) > 0
                      ? `-${Number(priceData.discount_amount).toLocaleString('vi-VN')} đ`
                      : '0 đ'}
                  </strong>
                </div>

                <div className="summary-total">
                  <span>Total</span>

                  <strong>
                    {Number(priceData.final_price).toLocaleString('vi-VN')} đ
                  </strong>
                </div>

              </div>
            )}

            {/* book now */}
            <button
              className="book-btn"
              onClick={handleBookNow}
            >
              Book Now
            </button>

          </div>

        </div>

      </main>

      {/* sidebar */}
      <Sidebar />

    </div>
  );
}