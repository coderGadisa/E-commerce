import { useContext, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import toast from "react-hot-toast";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import StarRating from "../StarRating/StarRating";
import { getImageSrc } from "../../utils/constants";
import api from "../../services/api";
import "./ProductCard.css";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(
    () => user?.wishlist?.includes(product._id) ?? false
  );
  const [wishLoading, setWishLoading] = useState(false);

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart`, { icon: "🛒" });
  }, [product, addToCart]);

  const handleWishlist = useCallback(async (e) => {
    e.preventDefault();
    if (!user) { navigate("/login"); return; }
    setWishLoading(true);
    try {
      if (wishlisted) {
        await api.delete(`/users/wishlist/${product._id}`);
        setWishlisted(false);
        toast("Removed from wishlist", { icon: "💔" });
      } else {
        await api.post(`/users/wishlist/${product._id}`);
        setWishlisted(true);
        toast.success("Added to wishlist", { icon: "❤️" });
      }
    } catch {
      toast.error("Could not update wishlist.");
    } finally {
      setWishLoading(false);
    }
  }, [wishlisted, user, product._id, navigate]);

  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <Link to={`/products/${product._id}`} className="product-link">
      <div className="product-card">

        {/* Image */}
        <div className="product-image-wrapper">
          <img
            src={getImageSrc(product.image)}
            alt={product.name}
            loading="lazy"
            onError={(e) => { e.currentTarget.src = "https://placehold.co/400x300?text=No+Image"; }}
          />

          {product.stock === 0 && (
            <span className="product-badge product-badge--out">Out of Stock</span>
          )}
          {lowStock && (
            <span className="product-badge product-badge--low">Only {product.stock} left!</span>
          )}
          {/* New badge for recently added products */}
          {product.numReviews === 0 && product.stock > 0 && (
            <span className="product-badge product-badge--new">New</span>
          )}

          {/* Wishlist heart */}
          <button
            className={`product-wish-btn ${wishlisted ? "product-wish-btn--active" : ""}`}
            onClick={handleWishlist}
            disabled={wishLoading}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <FiHeart size={16} />
          </button>
        </div>

        {/* Info */}
        <div className="product-info">
          <span className="product-category">{product.category}</span>
          <h3 className="product-name">{product.name}</h3>
          {product.numReviews > 0 && (
            <div className="product-rating">
              <StarRating value={product.averageRating} size={13} />
              <span className="product-rating__count">({product.numReviews})</span>
            </div>
          )}
          <p className="product-price">ETB {product.price?.toLocaleString()}</p>
        </div>

        {/* CTA */}
        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          aria-label={`Add ${product.name} to cart`}
        >
          <FiShoppingCart size={15} />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </Link>
  );
}

export default ProductCard;
