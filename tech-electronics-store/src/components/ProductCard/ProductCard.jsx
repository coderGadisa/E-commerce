import { useContext } from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import toast from "react-hot-toast";
import { CartContext } from "../../context/CartContext";
import { getImageSrc } from "../../utils/constants";
import "./ProductCard.css";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (e) => {
    e.preventDefault(); // prevent navigating to detail page
    addToCart(product);
    toast.success(`${product.name} added to cart`, {
      icon: "🛒",
    });
  };

  return (
    <Link to={`/products/${product._id}`} className="product-link">
      <div className="product-card">
        <div className="product-image-wrapper">
          <img
            src={getImageSrc(product.image)}
            alt={product.name}
            loading="lazy"
          />
          {product.stock === 0 && (
            <span className="out-of-stock-badge">Out of Stock</span>
          )}
        </div>

        <div className="product-info">
          <span className="product-category">{product.category}</span>
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">ETB {product.price?.toLocaleString()}</p>
        </div>

        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          aria-label={`Add ${product.name} to cart`}
        >
          <FiShoppingCart />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </Link>
  );
}

export default ProductCard;
