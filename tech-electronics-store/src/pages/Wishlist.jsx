import { useEffect, useState, useContext } from "react";
import { FiTrash2, FiShoppingCart, FiHeart } from "react-icons/fi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { CartContext } from "../context/CartContext";
import Loader from "../components/Loader/Loader";
import { getImageSrc } from "../utils/constants";
import "./Wishlist.css";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  const fetchWishlist = async () => {
    try {
      const res = await api.get("/users/profile");
      const raw = res.data;
      setWishlist(raw.data?.wishlist ?? []);
    } catch {
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWishlist(); }, []);

  const handleRemove = async (productId, productName) => {
    try {
      await api.delete(`/users/wishlist/${productId}`);
      setWishlist((prev) => prev.filter((p) => p._id !== productId));
      toast.success(`${productName} removed from wishlist.`);
    } catch {
      toast.error("Could not remove item.");
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`, { icon: "🛒" });
  };

  if (loading) return <Loader />;

  return (
    <div className="wishlist-page">
      <h1>My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <FiHeart size={64} color="#94a3b8" />
          <h2>Your wishlist is empty</h2>
          <p>Save products you love and buy them later.</p>
          <Link to="/products" className="wishlist-shop-btn">Browse Products</Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((product) => (
            <div key={product._id} className="wishlist-card">
              <Link to={`/products/${product._id}`}>
                <img src={getImageSrc(product.image)} alt={product.name} />
              </Link>
              <div className="wishlist-info">
                <p className="wl-category">{product.category}</p>
                <Link to={`/products/${product._id}`} className="wl-name">
                  {product.name}
                </Link>
                <p className="wl-price">ETB {product.price?.toLocaleString()}</p>
              </div>
              <div className="wishlist-actions">
                <button className="wl-add-btn" onClick={() => handleAddToCart(product)}>
                  <FiShoppingCart /> Add to Cart
                </button>
                <button className="wl-remove-btn" onClick={() => handleRemove(product._id, product.name)}>
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
