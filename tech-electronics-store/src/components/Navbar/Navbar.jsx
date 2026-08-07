import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiShoppingCart, FiUser, FiMenu, FiX,
  FiHeart, FiLogOut, FiSettings,
} from "react-icons/fi";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { getCartCount } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">TechStore</Link>

      <button
        className="navbar-hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <ul className={`nav-links ${menuOpen ? "nav-links--open" : ""}`}>
        <li><NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink></li>
        <li><NavLink to="/products" onClick={() => setMenuOpen(false)}>Products</NavLink></li>
        <li><NavLink to="/categories" onClick={() => setMenuOpen(false)}>Categories</NavLink></li>
        <li><NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink></li>
        {user && (
          <li>
            <NavLink to="/wishlist" onClick={() => setMenuOpen(false)}>
              <FiHeart /> Wishlist
            </NavLink>
          </li>
        )}
      </ul>

      <div className="navbar-actions">
        <Link to="/cart" className="navbar-icon-btn" aria-label="Cart">
          <FiShoppingCart size={22} />
          {getCartCount() > 0 && (
            <span className="cart-badge">{getCartCount()}</span>
          )}
        </Link>

        {user ? (
          <div className="navbar-user" onMouseLeave={() => setDropdownOpen(false)}>
            <button
              className="navbar-icon-btn user-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="User menu"
            >
              <FiUser size={22} />
              <span className="user-name">{user.name.split(" ")[0]}</span>
            </button>

            {dropdownOpen && (
              <div className="user-dropdown">
                <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                  <FiUser /> Profile
                </Link>
                <Link to="/orders" onClick={() => setDropdownOpen(false)}>
                  📦 My Orders
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin" onClick={() => setDropdownOpen(false)}>
                    <FiSettings /> Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout}>
                  <FiLogOut /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="navbar-login-btn">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
