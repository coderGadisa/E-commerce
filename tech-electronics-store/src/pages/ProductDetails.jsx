import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { FiShoppingCart, FiHeart, FiArrowLeft, FiPackage } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../services/api";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader/Loader";
import { getImageSrc } from "../utils/constants";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        const raw = res.data;
        setProduct(raw.data ?? raw);
      } catch {
        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    toast.success(
      qty > 1
        ? `${qty}× ${product.name} added to cart`
        : `${product.name} added to cart`,
      { icon: "🛒" }
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = async () => {
    if (!user) {
      toast.error("Please login to save to wishlist.");
      return;
    }
    try {
      setWishlistLoading(true);
      await api.post(`/users/wishlist/${product._id}`);
      toast.success("Added to wishlist ♥");
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("Already in your wishlist.");
      } else {
        toast.error("Could not add to wishlist.");
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return (
    <div className="pd-error">
      <p>{error}</p>
      <Link to="/products">← Back to Products</Link>
    </div>
  );

  return (
    <div className="pd-page">
      <Link to="/products" className="pd-back">
        <FiArrowLeft /> Back to Products
      </Link>

      <div className="pd-container">
        {/* Image */}
        <div className="pd-image-wrapper">
          <img src={getImageSrc(product.image)} alt={product.name} />
          {product.stock === 0 && (
            <div className="pd-out-of-stock">Out of Stock</div>
          )}
        </div>

        {/* Info */}
        <div className="pd-info">
          <span className="pd-category">{product.category}</span>
          <h1 className="pd-title">{product.name}</h1>
          <p className="pd-price">ETB {product.price?.toLocaleString()}</p>
          <p className="pd-description">{product.description}</p>

          <div className="pd-stock">
            <FiPackage />
            {product.stock > 0
              ? <span className="in-stock">In Stock ({product.stock} left)</span>
              : <span className="no-stock">Out of Stock</span>}
          </div>

          {product.stock > 0 && (
            <div className="pd-qty-row">
              <label>Quantity:</label>
              <div className="qty-control">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>+</button>
              </div>
            </div>
          )}

          <div className="pd-actions">
            <button
              className={`pd-cart-btn ${added ? "pd-cart-btn--added" : ""}`}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <FiShoppingCart />
              {added ? "Added!" : "Add to Cart"}
            </button>

            <button
              className="pd-wish-btn"
              onClick={handleWishlist}
              disabled={wishlistLoading}
              title="Add to Wishlist"
            >
              <FiHeart />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
