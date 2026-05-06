//component sidebar ben phai
export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* logo */}
      <div>
        <h2 className="logo">TravelZone</h2>
        <p className="subtitle">Modern Travel Experience</p>
      </div>

      {/* menu section */}
      <div className="sidebar-section">
        <p className="section-title">MENU</p>

        <div className="menu-item active">
          <span>⌂</span>
          <div>
            <strong>Home</strong>
            <small>Dashboard</small>
          </div>
        </div>

        <div className="menu-item">
          <span>♡</span>
          <div>
            <strong>Favorite</strong>
            <small>Saved combos</small>
          </div>
        </div>

        <div className="menu-item">
          <span>◷</span>
          <div>
            <strong>Recent</strong>
            <small>Viewed combos</small>
          </div>
        </div>

        <div className="menu-item">
          <span>ⓘ</span>
          <div>
            <strong>About You</strong>
            <small>Contact form</small>
          </div>
        </div>
      </div>

      {/* destinations section */}
      <div className="sidebar-section">
        <p className="section-title">DESTINATIONS</p>

        {['Vietnam', 'Asia', 'Europe', 'Africa', 'Americas', 'Oceania'].map((item) => (
          <div className="destination-item" key={item}>
            <span>◎</span>
            <p>{item}</p>
          </div>
        ))}
      </div>

      {/* stats section */}
      <div className="travel-stats">
        <p>TRAVEL STATS</p>

        <h3>200+</h3>
        <span>Travel Combos</span>

        <h3 className="pink">50K+</h3>
        <span>Happy Travelers</span>
      </div>
    </aside>
  );
}