import { useEffect, useState } from 'react';

import {
  useNavigate,
  useSearchParams
} from 'react-router-dom';

import api from '../services/api';
import Sidebar from '../components/Sidebar';

import '../styles/booking.css';

// page tao booking request
export default function BookingPage() {

  // react router
  const navigate = useNavigate();

  // lay params tu URL
  const [searchParams] = useSearchParams();

  // lay combo_id va people tu URL
  const comboId = searchParams.get('combo_id');

  const peopleFromUrl =
    searchParams.get('people') || 1;

  // state combo detail
  const [combo, setCombo] = useState(null);

  // state form booking
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    travel_date: '',
    number_of_people: peopleFromUrl,
    message: '',
    request_type: 'booking',
  });

  // state loading
  const [loading, setLoading] = useState(false);

  // state success message
  const [successMessage, setSuccessMessage] = useState('');

  // state error
  const [error, setError] = useState('');

  // goi api lay combo detail khi vao page
  useEffect(() => {

    if (comboId) {
      fetchComboDetail();
    }

  }, [comboId]);

  // api lay chi tiet combo
  const fetchComboDetail = async () => {

    try {

      const response = await api.get(
        `/combos/${comboId}`
      );

      // api moi co structure:
      // data.combo
      setCombo(
        response.data.data.combo
      );

    } catch (err) {

      console.error(err);

      setError(
        'Failed to load combo'
      );
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

  // gui booking request len backend
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      setError('');

      setSuccessMessage('');

      // payload gui backend
      const payload = {

        combo_id: Number(comboId),

        customer_name:
          formData.customer_name,

        email:
          formData.email,

        phone:
          formData.phone,

        travel_date:
          formData.travel_date,

        number_of_people:
          Number(formData.number_of_people),

        message:
          formData.message,

        request_type:
          formData.request_type,
      };

      // goi api tao booking request
      const response = await api.post(
        '/booking-requests',
        payload
      );

      // hien success message
      setSuccessMessage(
        response.data.message ||
        'Booking request sent successfully'
      );

      // reset form
      setFormData({
        customer_name: '',
        email: '',
        phone: '',
        travel_date: '',
        number_of_people: peopleFromUrl,
        message: '',
        request_type: 'booking',
      });

      // chuyen sang success page
      setTimeout(() => {

        navigate(`/booking-success?combo_id=${comboId}`);

      }, 1200);

    } catch (err) {

      console.error(err);

      setError(
        err.response?.data?.error ||
        'Failed to send booking request'
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="app-layout">

      {/* main content */}
      <main className="booking-page">

        {/* page heading */}
        <div className="booking-header">

          <h1>
            Booking Request
          </h1>

          <p>
            Send your travel request to our admin team
          </p>

        </div>

        {/* combo summary */}
        {combo && (

          <div className="booking-combo-card">

            <h2>
              {combo.title}
            </h2>

            <p>
              <strong>Destination:</strong>{' '}
              {combo.destination}
            </p>

            <p>
              <strong>Region:</strong>{' '}
              {combo.region}
            </p>

            <p>
              <strong>Combo Type:</strong>{' '}
              {combo.combo_type}
            </p>

            <p>
              <strong>Price:</strong>{' '}
              {Number(combo.original_price)
                .toLocaleString('vi-VN')} đ
            </p>

          </div>
        )}

        {/* booking form */}
        <form
          className="booking-form"
          onSubmit={handleSubmit}
        >

          {/* customer name */}
          <label>

            Customer Name

            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              required
            />

          </label>

          {/* email */}
          <label>

            Email

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </label>

          {/* phone */}
          <label>

            Phone

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />

          </label>

          {/* travel date */}
          <label>

            Travel Date

            <input
              type="date"
              name="travel_date"
              value={formData.travel_date}
              onChange={handleChange}
              required
            />

          </label>

          {/* number of people */}
          <label>

            Number of People

            <input
              type="number"
              name="number_of_people"
              min="1"
              value={formData.number_of_people}
              onChange={handleChange}
              required
            />

          </label>

          {/* message */}
          <label>

            Message

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us more about your trip..."
            />

          </label>

          {/* error message */}
          {error && (
            <p className="booking-error">
              {error}
            </p>
          )}

          {/* success message */}
          {successMessage && (
            <p className="booking-success">
              {successMessage}
            </p>
          )}

          {/* submit button */}
          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Sending...'
              : 'Send Booking Request'}
          </button>

        </form>

      </main>

      {/* sidebar */}
      <Sidebar />

    </div>
  );
}