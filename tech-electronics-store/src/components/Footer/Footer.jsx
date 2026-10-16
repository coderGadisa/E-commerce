import { Link } from "react-router-dom";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import "./Footer.css";

const PAYMENT_METHODS = ["Chapa", "Telebirr", "CBE Birr", "Cash on Delivery"];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* Brand column */}
        <div className="footer-col footer-brand">
          <h2 className="footer-logo">
            <span className="footer-logo-accent">Tech</span>Store
          </h2>
          <p>
            Your trusted destination for tech and electronics in Ethiopia.
            We offer quality products at competitive prices with local payment support.
          </p>

          <div className="footer-contact">
            <span><FiMapPin size={14} /> Addis Ababa, Ethiopia</span>
            <a href="tel:+251900000000"><FiPhone size={14} /> +251 900 000 000</a>
            <a href="mailto:support@techstore.et"><FiMail size={14} /> support@techstore.et</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/products">All Products</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        {/* Account */}
        <div className="footer-col">
          <h3>My Account</h3>
          <Link to="/profile">My Profile</Link>
          <Link to="/orders">My Orders</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/cart">Shopping Cart</Link>
        </div>

        {/* Payment & Social */}
        <div className="footer-col">
          <h3>We Accept</h3>
          <div className="payment-badges">
            {PAYMENT_METHODS.map((m) => (
              <span key={m} className="payment-badge">{m}</span>
            ))}
          </div>

          <h3 style={{ marginTop: 24 }}>Follow Us</h3>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://t.me" target="_blank" rel="noreferrer">Telegram</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">© {year} TechStore. All rights reserved.</p>
        <p className="footer-policy">
          Prices are in <strong>ETB</strong>. Free shipping on orders above ETB 5,000.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
