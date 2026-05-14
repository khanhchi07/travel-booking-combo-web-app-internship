import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function BookingSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const comboId = searchParams.get('combo_id');

  return (
    <div className="app-layout">
      <main className="main-content">
        <div className="booking-success-page">
          <div className="success-card">
            <div className="success-icon">✓</div>

            <h1>Booking Request Sent!</h1>

            <p>
              Your booking request has been submitted successfully.
              Our travel consultant will contact you soon by email or phone.
            </p>

            <div className="success-info">
              <p><strong>Status:</strong> Pending</p>
              <p><strong>Next step:</strong> Please wait for confirmation from TravelZone.</p>
            </div>

            <div className="success-actions">
              <button onClick={() => navigate('/')}>
                Back to Home
              </button>

              {comboId && (
                <button onClick={() => navigate(`/combos/${comboId}`)}>
                  Back to Combo
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Sidebar />
    </div>
  );
}