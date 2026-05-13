import { useEffect, useState } from 'react';

import '../styles/admin-combos.css';

import api from '../services/api';

// page admin quan ly combos
export default function AdminCombosPage() {
  // state danh sach combos
  const [combos, setCombos] = useState([]);

  // state combo dang edit
  const [editingId, setEditingId] = useState(null);

  // state loading va message
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // state form combo
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    region: '',
    description: '',
    duration_days: '',
    duration_nights: '',
    accommodation_type: '',
    accommodation_name: '',
    original_price: '',
    image_url: '',
    status: 'active',
    created_by: 1,

    // thong tin mo rong
    transportation: '',
    included_services: '',
    excluded_services: '',
    highlights: '',
    itinerary: '',
    combo_type: '',
  });

  // goi api khi mo page
  useEffect(() => {
    fetchCombos();
  }, []);

  // api lay toan bo combo cho admin
  const fetchCombos = async () => {
    try {
      const response = await api.get('/admin/combos');
      setCombos(response.data.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load combos');
    }
  };

  // xu ly thay doi input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // reset form
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      destination: '',
      region: '',
      description: '',
      duration_days: '',
      duration_nights: '',
      accommodation_type: '',
      accommodation_name: '',
      original_price: '',
      image_url: '',
      status: 'active',
      created_by: 1,
      transportation: '',
      included_services: '',
      excluded_services: '',
      highlights: '',
      itinerary: '',
      combo_type: '',
    });
  };

  // submit create/update combo
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage('');
      setError('');

      const payload = {
        ...formData,
        duration_days: Number(formData.duration_days),
        duration_nights: formData.duration_nights
          ? Number(formData.duration_nights)
          : null,
        original_price: Number(formData.original_price),
        created_by: Number(formData.created_by) || 1,
      };

      if (editingId) {
        await api.put(`/combos/${editingId}`, payload);
        setMessage('Combo updated successfully');
      } else {
        await api.post('/combos', payload);
        setMessage('Combo created successfully');
      }

      resetForm();
      fetchCombos();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to save combo');
    } finally {
      setLoading(false);
    }
  };

  // dua data combo len form de edit
  const handleEdit = (combo) => {
    setEditingId(combo.combo_id);

    setFormData({
      title: combo.title || '',
      destination: combo.destination || '',
      region: combo.region || '',
      description: combo.description || '',
      duration_days: combo.duration_days || '',
      duration_nights: combo.duration_nights || '',
      accommodation_type: combo.accommodation_type || '',
      accommodation_name: combo.accommodation_name || '',
      original_price: combo.original_price || '',
      image_url: combo.image_url || '',
      status: combo.status || 'active',
      created_by: combo.created_by || 1,
      transportation: combo.transportation || '',
      included_services: combo.included_services || '',
      excluded_services: combo.excluded_services || '',
      highlights: combo.highlights || '',
      itinerary: combo.itinerary || '',
      combo_type: combo.combo_type || '',
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // soft delete combo
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Set this combo to inactive?');

    if (!confirmDelete) return;

    try {
      await api.delete(`/combos/${id}`);
      setMessage('Combo set to inactive');
      fetchCombos();
    } catch (err) {
      console.error(err);
      setError('Failed to delete combo');
    }
  };

  return (
    <div className="admin-page">
      <h1>Admin Combos</h1>

      <p>
        Manage travel combos, pricing, itinerary, services and status.
      </p>

      {/* message */}
      {message && (
        <p style={{ color: 'green', fontWeight: 'bold' }}>
          {message}
        </p>
      )}

      {error && (
        <p style={{ color: 'red', fontWeight: 'bold' }}>
          {error}
        </p>
      )}

      {/* form create/update combo */}
      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: '24px',
          display: 'grid',
          gap: '14px',
          maxWidth: '800px',
          padding: '24px',
          border: '1px solid #ddd',
          borderRadius: '12px',
          background: '#fff',
        }}
      >
        <h2>{editingId ? 'Update Combo' : 'Create Combo'}</h2>

        <input
          name="title"
          placeholder="Combo title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <input
          name="destination"
          placeholder="Destination"
          value={formData.destination}
          onChange={handleChange}
          required
        />

        <input
          name="region"
          placeholder="Region"
          value={formData.region}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <input
          type="number"
          name="duration_days"
          placeholder="Duration days"
          value={formData.duration_days}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="duration_nights"
          placeholder="Duration nights"
          value={formData.duration_nights}
          onChange={handleChange}
        />

        <input
          name="accommodation_type"
          placeholder="Accommodation type"
          value={formData.accommodation_type}
          onChange={handleChange}
        />

        <input
          name="accommodation_name"
          placeholder="Accommodation name"
          value={formData.accommodation_name}
          onChange={handleChange}
        />

        <input
          type="number"
          name="original_price"
          placeholder="Original price"
          value={formData.original_price}
          onChange={handleChange}
          required
        />

        <input
          name="image_url"
          placeholder="Image URL"
          value={formData.image_url}
          onChange={handleChange}
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="active">active</option>
          <option value="inactive">inactive</option>
        </select>

        <input
          name="combo_type"
          placeholder="Combo type e.g. Luxury, Family, Adventure"
          value={formData.combo_type}
          onChange={handleChange}
        />

        <textarea
          name="transportation"
          placeholder="Transportation e.g. Round-trip flight, airport transfer"
          value={formData.transportation}
          onChange={handleChange}
        />

        <textarea
          name="included_services"
          placeholder="Included services, separated by commas"
          value={formData.included_services}
          onChange={handleChange}
        />

        <textarea
          name="excluded_services"
          placeholder="Excluded services, separated by commas"
          value={formData.excluded_services}
          onChange={handleChange}
        />

        <textarea
          name="highlights"
          placeholder="Highlights, separated by commas"
          value={formData.highlights}
          onChange={handleChange}
        />

        <textarea
          name="itinerary"
          placeholder="Itinerary, separated by |. Example: Day 1: Arrival | Day 2: City tour"
          value={formData.itinerary}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading
            ? 'Saving...'
            : editingId
              ? 'Update Combo'
              : 'Create Combo'}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel Edit
          </button>
        )}
      </form>

      {/* danh sach combos */}
      <div style={{ marginTop: '40px' }}>
        <h2>Combo List</h2>

        {combos.length === 0 ? (
          <p>No combos found.</p>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {combos.map((combo) => (
              <div
                key={combo.combo_id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '12px',
                  padding: '18px',
                  background: '#fff',
                }}
              >
                <h3>
                  #{combo.combo_id} - {combo.title}
                </h3>

                <p>
                  <strong>Destination:</strong> {combo.destination}
                </p>

                <p>
                  <strong>Region:</strong> {combo.region}
                </p>

                <p>
                  <strong>Status:</strong> {combo.status}
                </p>

                <p>
                  <strong>Price:</strong>{' '}
                  {Number(combo.original_price).toLocaleString('vi-VN')} đ
                </p>

                <button onClick={() => handleEdit(combo)}>
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(combo.combo_id)}
                  style={{ marginLeft: '10px' }}
                >
                  Set inactive
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}