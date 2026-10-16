import { useContext, useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiShoppingCart, FiUser, FiMenu, FiX,
  FiHeart, FiLogOut, FiSettings, FiPackage,
  FiSearch,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Close user-dropdown when clicking outside
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [dropdownOpen]);

  // Focus search input when overlay opens
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/products?keyword=${encodeURIComponent(q)}`);
      setSearchQuery("");
      setSearchOpen(false);
      setMenuOpen(false);
    }
  };

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-tech">Tech</span>Store
        </Link>

        {/* Desktop nav links */}
        <ul className={`nav-links ${menuOpen ? "nav-links--open" : ""}`}>
          <li><NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink></li>
          <li><NavLink to="/products" onClick={() => setMenuOpen(false)}>Products</NavLink></li>
          <li><NavLink to="/categories" onClick={() => setMenuOpen(false)}>Categories</NavLink></li>
          <li><NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink></li>
          {user && (
            <li>
              <NavLink to="/wishlist" onClick={() => setMenuOpen(false)}>
                <FiHeart size={14} /> Wishlist
              </NavLink>
            </li>
          )}

          {/* Mobile-only search form inside menu */}
          <li className="mobile-search-li">
            <form onSubmit={handleSearch} className="mobile-search-form">
              <input
                type="search"
                placeholder="Search products…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search"
              />
              <button type="submit" aria-label="Search"><FiSearch /></button>
            </form>
          </li>
        </ul>

        {/* Right-side actions */}
        <div className="navbar-actions">
          {/* Desktop search toggle */}
          <button
            className="navbar-icon-btn search-toggle"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Toggle search"
          >
            {searchOpen ? <FiX size={20} /> : <FiSearch size={20} />}
          </button>

          {/* Cart */}
          <Link to="/cart" className="navbar-icon-btn" aria-label="Cart">
            <FiShoppingCart size={21} />
            {getCartCount() > 0 && (
              <span className="cart-badge">{getCartCount()}</span>
            )}
          </Link>

          {/* User / Login */}
          {user ? (
            <div className="navbar-user" ref={dropdownRef}>
              <button
                className="navbar-icon-btn user-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="User menu"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="navbar-avatar" />
                ) : (
                  <div className="navbar-avatar-initial">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="user-name">{user.name.split(" ")[0]}</span>
              </button>

              {dropdownOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <span>{user.name}</span>
                    <small>{user.role}</small>
                  </div>
                  <hr className="dropdown-divider" />
                  <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                    <FiUser size={14} /> Profile
                  </Link>
                  <Link to="/orders" onClick={() => setDropdownOpen(false)}>
                    <FiPackage size={14} /> My Orders
                  </Link>
                  <Link to="/wishlist" onClick={() => setDropdownOpen(false)}>
                    <FiHeart size={14} /> Wishlist
                  </Link>
                  {user.role === "admin" && (
                    <>
                      <hr className="dropdown-divider" />
                      <Link to="/admin" onClick={() => setDropdownOpen(false)}>
                        <FiSettings size={14} /> Admin Panel
                      </Link>
                    </>
                  )}
                  <hr className="dropdown-divider" />
                  <button onClick={handleLogout}>
                    <FiLogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar-auth-btns">
              <Link to="/login" className="navbar-login-btn">Login</Link>
              <Link to="/register" className="navbar-register-btn">Sign Up</Link>
            </div>
          )}

          {/* Hamburger */}
          <button
            className="navbar-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </nav>

      {/* Desktop search bar — slides down */}
      {searchOpen && (
        <div className="navbar-search-bar">
          <form onSubmit={handleSearch} className="navbar-search-form">
            <FiSearch size={18} className="search-icon" />
            <input
              ref={searchRef}
              type="search"
              placeholder="Search laptops, phones, accessories…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search products"
            />
            <button type="submit">Search</button>
            <button type="button" className="search-close" onClick={() => setSearchOpen(false)}>
              <FiX size={18} />
            </button>
          </form>
        </div>
      )}
    </header>
  );
}

export default Navbar;
