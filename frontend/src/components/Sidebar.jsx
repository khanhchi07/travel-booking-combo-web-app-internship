import '../styles/sidebar.css';
import { useNavigate } from 'react-router-dom';

// sidebar dung chung cho cac page
export default function Sidebar() {
  const navigate = useNavigate();

  // danh sach destination
  const destinations = [
    'Vietnam',
    'Asia',
    'Europe',
    'Africa',
    'Americas',
    'Oceania',
  ];

  return (
    <aside className="sidebar">
      {/* logo */}
      <div className="sidebar-logo">
        <h2>TravelZone</h2>
        <p>Modern Travel Experience</p>
      </div>

      {/* menu */}
      <div className="sidebar-section">
        <p className="sidebar-label">MENU</p>

        <button
          type="button"
          className="sidebar-item active"
          onClick={() => navigate('/')}
        >
          <span>⌂</span>

          <div>
            <strong>Home</strong>
            <small>Dashboard</small>
          </div>
        </button>

        <button
          type="button"
          className="sidebar-item"
          onClick={() => navigate('/')}
        >
          <span>♡</span>

          <div>
            <strong>Favorite</strong>
            <small>Saved combos</small>
          </div>
        </button>

        <button
          type="button"
          className="sidebar-item"
          onClick={() => navigate('/')}
        >
          <span>◴</span>

          <div>
            <strong>Recent</strong>
            <small>Viewed combos</small>
          </div>
        </button>

        <button
          type="button"
          className="sidebar-item"
          onClick={() => navigate('/')}
        >
          <span>ⓘ</span>

          <div>
            <strong>About You</strong>
            <small>Contact form</small>
          </div>
        </button>
      </div>

      {/* destinations */}
      <div className="sidebar-section">
        <p className="sidebar-label">DESTINATIONS</p>

        {destinations.map((item) => (
          <button
            key={item}
            type="button"
            className="destination-item"
            onClick={() => navigate(`/?destination=${item}`)}
          >
            <span>◎</span>
            {item}
          </button>
        ))}
      </div>

      {/* stats */}
      <div className="stats-card">
        <p>TRAVEL STATS</p>

        <h3>200+</h3>
        <span>Travel Combos</span>

        <h3>50K+</h3>
        <span>Happy Travelers</span>
      </div>
    </aside>
  );
}