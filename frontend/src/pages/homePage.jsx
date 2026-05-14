import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../services/api';
import Sidebar from '../components/Sidebar';
import ComboCard from '../components/ComboCard';

//page home hien thi danh sach combo va filter
export default function HomePage() {
  const navigate = useNavigate();

  //state luu danh sach combo
  const [combos, setCombos] = useState([]);

  //state loading
  const [loading, setLoading] = useState(true);

  //state filter search
  const [destination, setDestination] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  //state filter combo type
  const [selectedType, setSelectedType] = useState('All');

  //danh sach loai combo
  const comboTypes = [
    'All',
    'Solo Travel',
    'Couple Getaway',
    'Family Package',
    'Group Tour',
    'Luxury Escape',
  ];

  //state hero slider
  const [currentSlide, setCurrentSlide] = useState(0);

  //data hero slider
  const heroSlides = [
    {
      title: 'Explore Europe',
      subtitle: 'Historic Cities & Coastal Escapes',
      description: 'Journey through centuries of culture and architecture',
      region: 'Europe',
      season: 'Spring & Summer',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80',
    },
    {
      title: 'Discover Vietnam',
      subtitle: 'Beaches, Bays & Ancient Towns',
      description: 'Experience tropical coastlines and cultural heritage',
      region: 'Vietnam',
      season: 'Best Seller',
      image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80',
    },
    {
      title: 'Escape to Asia',
      subtitle: 'Islands, Cities & Traditions',
      description: 'Find peaceful resorts and vibrant local experiences',
      region: 'Asia',
      season: 'Hot Deal',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
    },
    {
      title: 'Relax in Maldives',
      subtitle: 'Luxury Resorts & Ocean Views',
      description: 'Enjoy crystal clear water and unforgettable sunsets',
      region: 'Oceania',
      season: 'Luxury Escape',
      image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1600&q=80',
    },
  ];

  //goi api khi mo trang va khi doi combo type
  useEffect(() => {
    fetchCombos();
  }, [selectedType]);

  //tu dong chuyen hero slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === heroSlides.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  //chuyen sang slide tiep theo
  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === heroSlides.length - 1 ? 0 : prev + 1
    );
  };

  //quay lai slide truoc
  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? heroSlides.length - 1 : prev - 1
    );
  };

  //api lay danh sach combo theo filter
  const fetchCombos = async () => {
    try {
      setLoading(true);

      const params = {};

      //filter theo destination
      if (destination) {
        params.destination = destination;
      }

      //filter theo max price
      if (maxPrice) {
        params.maxPrice = maxPrice;
      }

      //filter theo combo type
      if (selectedType !== 'All') {
        params.combo_type = selectedType;
      }

      const response = await api.get('/combos', { params });

      setCombos(response.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //xu ly click tag popular
  const handlePopularClick = (tag) => {
    setDestination(tag);
  };

  //xu ly submit search
  const handleSearch = () => {
    fetchCombos();
  };

  //reset tat ca filter
  const handleResetFilter = () => {
    setDestination('');
    setMaxPrice('');
    setSelectedType('All');
  };

  return (
    <div className="app-layout">
      {/* main content */}
      <main className="main-content">

        {/* hero section */}
        <section
          className="hero"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 59, 59, 0.45), rgba(59, 59, 59, 0.35)),
              url(${heroSlides[currentSlide].image})
            `,
          }}
        >
          <div className="hero-overlay">

            {/* hero tags */}
            <div className="hero-tags">
              <span>📍 {heroSlides[currentSlide].region}</span>
              <span>🗓 {heroSlides[currentSlide].season}</span>
            </div>

            {/* hero content */}
            <h1>{heroSlides[currentSlide].title}</h1>
            <h2>{heroSlides[currentSlide].subtitle}</h2>
            <p>{heroSlides[currentSlide].description}</p>

            {/* hero button */}
            <button
              className="hero-button"
              onClick={() => {
                document
                  .querySelector('.deals-section')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Packages
            </button>

            {/* hero prev button */}
            <button
              className="hero-arrow hero-arrow-left"
              onClick={prevSlide}
            >
              ‹
            </button>

            {/* hero next button */}
            <button
              className="hero-arrow hero-arrow-right"
              onClick={nextSlide}
            >
              ›
            </button>

            {/* hero dots */}
            <div className="hero-dots">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.title}
                  className={`hero-dot ${
                    currentSlide === index ? 'active' : ''
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* search section */}
        <section className="search-box">
          <input
            type="text"
            placeholder="Search destinations, countries, cities..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />

          <input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />

          <button onClick={handleSearch}>
            Search
          </button>
        </section>

        {/* popular tags */}
        <section className="popular-tags">
          <span>Popular:</span>

          {['Phu Quoc', 'Ha Long', 'Da Nang', 'Tokyo', 'Bali'].map((tag) => (
            <button
              key={tag}
              onClick={() => handlePopularClick(tag)}
            >
              {tag}
            </button>
          ))}
        </section>

        {/* combo type filters */}
        <section className="combo-type-filter">
          {comboTypes.map((type) => (
            <button
              key={type}
              className={
                selectedType === type
                  ? 'type-filter-btn active'
                  : 'type-filter-btn'
              }
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}

          <button
            className="type-filter-btn reset"
            onClick={handleResetFilter}
          >
            Reset
          </button>
        </section>

        {/* hot deals section */}
        <section className="deals-section">
          <div className="section-heading">
            <div className="icon-box">🔥</div>

            <div>
              <h2>Hot Deals This Week</h2>
              <p>Limited time offers - Book now!</p>
            </div>
          </div>

          {/* loading combo */}
          {loading ? (
            <p>Loading combos...</p>
          ) : combos.length === 0 ? (
            <p>No combos found.</p>
          ) : (
            <div className="combo-grid">
              {combos.map((combo) => (
                <ComboCard
                  key={combo.combo_id}
                  combo={combo}
                  onView={() => navigate(`/combos/${combo.combo_id}`)}
                />
              ))}
            </div>
          )}
        </section>

        {/* region section */}
        <section className="region-section">
          <h2>Explore by Region</h2>

          <div className="region-grid">
            {['Vietnam', 'Asia', 'Europe', 'Africa', 'Americas', 'Oceania'].map((region, index) => (
              <div
                key={region}
                className={`region-card ${index % 2 === 0 ? 'green' : 'pink'}`}
              >
                <span>✨ {index + 4} packages</span>

                <h3>{region}</h3>

                <p>Discover amazing travel experiences</p>

                <button
                  onClick={() => {
                    setDestination(region);
                    fetchCombos();
                  }}
                >
                  Explore Now →
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* sidebar */}
      <Sidebar />
    </div>
  );
}