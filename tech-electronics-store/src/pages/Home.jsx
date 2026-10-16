import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Home.css";
import ProductCard from "../components/ProductCard/ProductCard";
import CategoryCard from "../components/CategoryCard/CategoryCard";
import Hero from "../components/Hero/Hero";
import { ProductSkeletonGrid } from "../components/ProductSkeleton/ProductSkeleton";
import categories from "../data/categories";
import useDocumentTitle from "../hooks/useDocumentTitle";

// ── Static content (placeholders you can customise) ──────────────────
const PROMO_CARDS = [
  { icon: "🚚", title: "Free Shipping", desc: "On all orders above ETB 5,000" },
  { icon: "🔒", title: "Secure Payment", desc: "Pay safely via Chapa / COD" },
  { icon: "↩️", title: "Easy Returns", desc: "Hassle-free return policy" },
  { icon: "🎧", title: "24/7 Support", desc: "We're here to help you" },
];

const FEATURES = [
  { icon: "💻", title: "Wide Selection", desc: "Laptops, phones, accessories, monitors, and smart watches all in one place." },
  { icon: "💰", title: "Best Prices", desc: "Competitive prices in Ethiopian Birr — no hidden fees or currency surprises." },
  { icon: "⚡", title: "Fast Checkout", desc: "One-page checkout with Cash on Delivery or Chapa mobile money." },
  { icon: "📦", title: "Order Tracking", desc: "Follow every order from placement to delivery through your account." },
];

function Home() {
  useDocumentTitle("Home");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/products?limit=8&sort=-createdAt");
        const raw = res.data;
        setProducts(Array.isArray(raw.data) ? raw.data : []);
      } catch {
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const displayed = selectedCategory === "All"
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const handleNewsletter = (e) => {
    e.preventDefault();
    // Placeholder — no backend endpoint yet
    setEmail("");
    alert("Thank you for subscribing! We'll be in touch.");
  };

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────── */}
      <Hero />

      {/* ── Promo strip ───────────────────────────────────── */}
      <div className="promo-strip">
        <div className="section-wrap">
          <div className="promo-grid">
            {PROMO_CARDS.map((p) => (
              <div key={p.title} className="promo-card">
                <div className="promo-icon">{p.icon}</div>
                <div className="promo-text">
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Shop by Category ──────────────────────────────── */}
      <section className="categories-section">
        <div className="section-wrap">
          <div className="section-heading">
            <h2>Shop by Category</h2>
            <Link to="/categories">View all →</Link>
          </div>
          <div className="categories-grid">
            <CategoryCard
              category={{ name: "All" }}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────── */}
      <section className="products-section">
        <div className="section-wrap">
          <div className="section-heading">
            <h2>Featured Products</h2>
            <Link to="/products">See all products →</Link>
          </div>

          {error && (
            <p className="no-products" style={{ color: "var(--color-error)" }}>{error}</p>
          )}

          {loading ? (
            <ProductSkeletonGrid count={8} />
          ) : displayed.length === 0 ? (
            <p className="no-products">No products found in this category.</p>
          ) : (
            <div className="products-grid">
              {displayed.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Why TechStore ─────────────────────────────────── */}
      <section className="features-section">
        <div className="section-wrap">
          <div className="section-heading">
            <h2>Why Choose TechStore?</h2>
          </div>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ─────────────────────────────────────── */}
      <section className="newsletter-section">
        <div className="section-wrap">
          <div className="newsletter-box">
            <h2>Stay Updated</h2>
            <p>Get notified about the latest products and exclusive deals.</p>
            <form onSubmit={handleNewsletter} className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email for newsletter"
              />
              <button type="submit">Subscribe</button>
            </form>
            <p className="newsletter-note">No spam, ever. Unsubscribe at any time.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
