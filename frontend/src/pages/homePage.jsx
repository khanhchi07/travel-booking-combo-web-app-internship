import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function HomePage() {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCombos();
  }, []);

  const fetchCombos = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/combos');
      setCombos(response.data.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load combos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2 style={{ padding: '20px' }}>Loading combos...</h2>;
  }

  if (error) {
    return <h2 style={{ padding: '20px', color: 'red' }}>{error}</h2>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Combo List</h1>

      {combos.length === 0 ? (
        <p>No combos found.</p>
      ) : (
        <div style={{ display: 'grid', gap: '16px', marginTop: '20px' }}>
          {combos.map((combo) => (
            <div
              key={combo.combo_id}
              onClick={() => navigate(`/combos/${combo.combo_id}`)}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '16px',
                background: '#fff',
                cursor: 'pointer',
              }}
            >
              <h3>{combo.title}</h3>
              <p><strong>Destination:</strong> {combo.destination}</p>
              <p><strong>Region:</strong> {combo.region}</p>
              <p><strong>Price:</strong> {combo.original_price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}