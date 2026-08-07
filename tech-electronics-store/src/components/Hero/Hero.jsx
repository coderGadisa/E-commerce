import { Link } from "react-router-dom";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Tech Electronics Store</h1>
        <p className="hero-subtitle">Buy Latest Electronics at Best Price</p>
        <Link to="/products" className="hero-btn">
          Shop Now →
        </Link>
      </div>
    </section>
  );
}

export default Hero;
