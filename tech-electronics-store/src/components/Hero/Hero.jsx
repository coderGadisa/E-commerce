import { Link } from "react-router-dom";
import { FiShoppingBag, FiTag } from "react-icons/fi";
import "./Hero.css";

const STATS = [
  { value: "15+", label: "Products" },
  { value: "5", label: "Categories" },
  { value: "ETB", label: "Local Currency" },
  { value: "Fast", label: "Delivery" },
];

function Hero() {
  return (
    <section className="hero">
      {/* Background decorations */}
      <div className="hero-blob hero-blob--1" aria-hidden="true" />
      <div className="hero-blob hero-blob--2" aria-hidden="true" />

      <div className="hero-content">
        {/* Badge */}
        <div className="hero-badge">
          <FiTag size={13} />
          New Arrivals — Latest Tech Products
        </div>

        {/* Headline */}
        <h1 className="hero-title">
          Shop Premium<br />
          <span className="hero-title-accent">Tech & Electronics</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Discover the latest laptops, phones, accessories, monitors, and
          smart watches — all priced in <strong>Ethiopian Birr</strong>.
          Free shipping on orders over ETB 5,000.
        </p>

        {/* CTAs */}
        <div className="hero-actions">
          <Link to="/products" className="hero-btn hero-btn--primary">
            <FiShoppingBag size={16} />
            Shop Now
          </Link>
          <Link to="/categories" className="hero-btn hero-btn--secondary">
            Browse Categories
          </Link>
        </div>

        {/* Stats row */}
        <div className="hero-stats">
          {STATS.map((s) => (
            <div key={s.label} className="hero-stat">
              <span className="hero-stat-value">{s.value}</span>
              <span className="hero-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right side — category chips */}
      <div className="hero-visual" aria-hidden="true">
        <div className="hero-device-card">
          <div className="hero-device-icon">💻</div>
          <span>Laptops</span>
        </div>
        <div className="hero-device-card">
          <div className="hero-device-icon">📱</div>
          <span>Phones</span>
        </div>
        <div className="hero-device-card">
          <div className="hero-device-icon">🎧</div>
          <span>Accessories</span>
        </div>
        <div className="hero-device-card">
          <div className="hero-device-icon">🖥️</div>
          <span>Monitors</span>
        </div>
        <div className="hero-device-card">
          <div className="hero-device-icon">⌚</div>
          <span>Smart Watches</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
