import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

export default function ComboDetailPage() {
  const { id } = useParams();

  const [combo, setCombo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [people, setPeople] = useState(1);
  const [priceData, setPriceData] = useState(null);

  useEffect(() => {
    fetchComboDetail();
  }, [id]);

  const fetchComboDetail = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get(`/combos/${id}`);
      setCombo(response.data.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load combo detail');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return <h2 style={{ padding: '20px' }}>Loading combo detail...</h2>;
  }

  if (error) {
    return <h2 style={{ padding: '20px', color: 'red' }}>{error}</h2>;
  }

  if (!combo) {
    return <h2 style={{ padding: '20px' }}>Combo not found.</h2>;
  }

  return (
  <div style={{ padding: '20px' }}>
    <h1>{combo.title}</h1>

    <p>
      <strong>Destination:</strong> {combo.destination}
    </p>

    <p>
      <strong>Region:</strong> {combo.region}
    </p>

    <p>
      <strong>Description:</strong> {combo.description}
    </p>

    <p>
      <strong>Duration:</strong> {combo.duration_days} days
    </p>

    <p>
      <strong>Accommodation:</strong> {combo.accommodation_name}
    </p>

    <p>
      <strong>Price:</strong> {combo.original_price}
    </p>

    <div style={{ marginTop: '30px' }}>
      <h2>Calculate Final Price</h2>

      <input
        type="number"
        min="1"
        value={people}
        onChange={(e) => setPeople(e.target.value)}
        style={{
          padding: '8px',
          marginTop: '10px',
          marginRight: '10px',
        }}
      />

      <button
        onClick={fetchFinalPrice}
        style={{
          padding: '8px 12px',
          cursor: 'pointer',
        }}
      >
        Calculate
      </button>

      {priceData && (
        <div style={{ marginTop: '20px' }}>
          <p>
            <strong>Original Price:</strong>{' '}
            {priceData.original_price}
          </p>

          <p>
            <strong>Number of People:</strong>{' '}
            {priceData.number_of_people}
          </p>

          <p>
            <strong>Discount Amount:</strong>{' '}
            {priceData.discount_amount}
          </p>

          <p>
            <strong>Final Price:</strong>{' '}
            {priceData.final_price}
          </p>

          {priceData.applied_promotion ? (
            <p>
              <strong>Promotion:</strong>{' '}
              {priceData.applied_promotion.title}
            </p>
          ) : (
            <p>
              <strong>Promotion:</strong> No promotion applied
            </p>
          )}
        </div>
      )}
    </div>
  </div>
);
}