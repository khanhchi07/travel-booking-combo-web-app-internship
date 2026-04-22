import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

export default function ComboDetailPage() {
  const { id } = useParams();

  const [combo, setCombo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

      <p><strong>Destination:</strong> {combo.destination}</p>
      <p><strong>Region:</strong> {combo.region}</p>
      <p><strong>Description:</strong> {combo.description}</p>
      <p><strong>Duration:</strong> {combo.duration_days} days</p>
      <p><strong>Accommodation Type:</strong> {combo.accommodation_type}</p>
      <p><strong>Accommodation Name:</strong> {combo.accommodation_name}</p>
      <p><strong>Original Price:</strong> {combo.original_price}</p>
      <p><strong>Status:</strong> {combo.status}</p>
    </div>
  );
}