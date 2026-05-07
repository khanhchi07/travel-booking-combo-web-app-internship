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
      setCombo(response.data.data || response.data);
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

  // tinh tong tien hien thi
  const totalOriginalPrice = priceData
    ? Number(priceData.original_price) * Number(people)
    : 0;

  const totalDiscount = priceData
    ? Number(priceData.discount_amount) * Number(people)
    : 0;

  const totalFinalPrice = priceData
    ? Number(priceData.final_price) * Number(people)
    : 0;

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

          {/* nut quay lai */}
          <button className="back-btn" onClick={() => navigate(-1)}>
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
                  <strong>{combo.duration_days} days</strong>
                </div>
              </div>

              <div className="meta-item">
                <span>⭐</span>
                <div>
                  <p>Rating</p>
                  <strong>4.8 (456 reviews)</strong>
                </div>
              </div>
  
            </div>

            <p className="detail-description">
              {combo.description}
            </p>
          </div>

          {/* booking section */}
          <div className="booking-card">

            <p className="price-label">
              Starting from
            </p>

            <h2 className="booking-price">
              {Number(combo.original_price).toLocaleString()} đ
            </h2>

            <p className="price-person">/ person</p>

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
                    {Number(priceData.original_price).toLocaleString()} đ
                  </strong>
                </div>

                <div className="summary-row discount">
                  <span>Discount</span>

                  <strong>
                    -{Number(priceData.discount_amount).toLocaleString()} đ
                  </strong>
                </div>

                <div className="summary-total">
                  <span>Total</span>

                  <strong>
                    {Number(priceData.final_price).toLocaleString()} đ
                  </strong>
                </div>

              </div>
            )}
 
            {/* book now */}
            <button
              className="book-btn"
              onClick={() =>
                navigate(`/booking?combo_id=${combo.combo_id}`)
              }
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