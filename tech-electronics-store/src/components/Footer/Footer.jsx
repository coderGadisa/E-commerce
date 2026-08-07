import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section footer-brand">
          <h2>TechStore</h2>
          <p>Your trusted electronics shopping destination in Ethiopia.</p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-section">
          <h3>Customer Service</h3>
          <Link to="/orders">My Orders</Link>
          <Link to="/profile">My Account</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/contact">Help Center</Link>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>
          <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://t.me" target="_blank" rel="noreferrer">Telegram</a>
        </div>
      </div>

      <hr />

      <p className="copyright">
        © {new Date().getFullYear()} TechStore. All Rights Reserved.
      </p>
    </footer>
  );
}

export default Footer;
