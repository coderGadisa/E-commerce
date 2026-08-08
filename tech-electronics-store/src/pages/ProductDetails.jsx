import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { FiShoppingCart, FiHeart, FiArrowLeft, FiPackage } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../services/api";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader/Loader";
import StarRating from "../components/StarRating/StarRating";
import ReviewList from "../components/ReviewList/ReviewList";
import ReviewForm from "../components/ReviewForm/ReviewForm";
import { getImageSrc } from "../utils/constants";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [product, setProduct]               = useState(null);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [qty, setQty]                       = useState(1);
  const [added, setAdded]                   = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Reviews state
  const [reviews, setReviews]               = useState([]);
  const [averageRating, setAverageRating]   = useState(0);
  const [numReviews, setNumReviews]         = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [submitLoading, setSubmitLoading]   = useState(false);
  const [hasReviewed, setHasReviewed]       = useState(false);

  // Fetch product
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

  // Fetch reviews separately so product page loads fast
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const res = await api.get(`/products/${id}/reviews`);
        const data = res.data.data;
        setReviews(data.reviews || []);
        setAverageRating(data.averageRating || 0);
        setNumReviews(data.numReviews || 0);

        // Check if the current user already reviewed
        if (user) {
          const already = (data.reviews || []).some(
            (r) => r.user === user._id || r.user?._id === user._id
          );
          setHasReviewed(already);
        }
      } catch {
        // silently fail — reviews are non-critical
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [id, user]);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    toast.success(
      qty > 1 ? `${qty}× ${product.name} added to cart` : `${product.name} added to cart`,
      { icon: "🛒" }
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = async () => {
    if (!user) { toast.error("Please login to save to wishlist."); return; }
    try {
      setWishlistLoading(true);
      await api.post(`/users/wishlist/${product._id}`);
      toast.success("Added to wishlist ♥");
    } catch (err) {
      if (err.response?.status === 409) toast.error("Already in your wishlist.");
      else toast.error("Could not add to wishlist.");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleReviewSubmit = async ({ rating, comment }) => {
    try {
      setSubmitLoading(true);
      const res = await api.post(`/products/${id}/reviews`, { rating, comment });
      const data = res.data.data;

      // Prepend new review to list
      setReviews((prev) => [data.review, ...prev]);
      setAverageRating(data.averageRating);
      setNumReviews(data.numReviews);
      setHasReviewed(true);
      toast.success("Review submitted! Thank you.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReviewDelete = async (reviewId) => {
    try {
      const res = await api.delete(`/products/${id}/reviews/${reviewId}`);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      // Refetch to get updated averages
      const r2 = await api.get(`/products/${id}/reviews`);
      const d2 = r2.data.data;
      setAverageRating(d2.averageRating);
      setNumReviews(d2.numReviews);
      if (user && reviews.find((r) => r._id === reviewId)?.user === user._id) {
        setHasReviewed(false);
      }
      toast.success("Review deleted.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete review.");
    }
  };

  if (loading) return <Loader />;
  if (error) return (
    <div className="pd-error">
      <p>{error}</p>
      <Link to="/products">← Back to Products</Link>
    </div>
  );

  const userAlreadyReviewed = hasReviewed ||
    reviews.some((r) => r.user === user?._id || r.user?._id === user?._id);

  return (
    <div className="pd-page">
      <Link to="/products" className="pd-back">
        <FiArrowLeft /> Back to Products
      </Link>

      {/* ── Product info ─────────────────────────── */}
      <div className="pd-container">
        <div className="pd-image-wrapper">
          <img src={getImageSrc(product.image)} alt={product.name} />
          {product.stock === 0 && (
            <div className="pd-out-of-stock">Out of Stock</div>
          )}
        </div>

        <div className="pd-info">
          <span className="pd-category">{product.category}</span>
          <h1 className="pd-title">{product.name}</h1>

          {/* Rating summary under title */}
          <div className="pd-rating-row">
            <StarRating value={averageRating} size={18} showCount count={numReviews} />
            <a href="#reviews" className="pd-reviews-link">
              {numReviews === 0
                ? "No reviews yet"
                : `${numReviews} review${numReviews > 1 ? "s" : ""}`}
            </a>
          </div>

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

      {/* ── Reviews section ──────────────────────── */}
      <div className="pd-reviews" id="reviews">
        <div className="pd-reviews-header">
          <h2 className="pd-reviews-title">Customer Reviews</h2>
          {numReviews > 0 && (
            <div className="pd-reviews-summary">
              <span className="pd-reviews-avg">{averageRating.toFixed(1)}</span>
              <StarRating value={averageRating} size={20} />
              <span className="pd-reviews-count">
                {numReviews} review{numReviews > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Review list */}
        {reviewsLoading ? (
          <Loader size="small" text="Loading reviews..." />
        ) : (
          <ReviewList
            reviews={reviews}
            currentUserId={user?._id}
            userRole={user?.role}
            onDelete={user ? handleReviewDelete : null}
          />
        )}

        {/* Write a review */}
        <div className="pd-reviews-form">
          {!user ? (
            <div className="pd-login-prompt">
              <Link to="/login" state={{ from: `/products/${id}` }}>Sign in</Link> to write a review
            </div>
          ) : userAlreadyReviewed ? (
            <div className="pd-already-reviewed">
              ✅ You have already reviewed this product.
            </div>
          ) : (
            <ReviewForm onSubmit={handleReviewSubmit} loading={submitLoading} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
