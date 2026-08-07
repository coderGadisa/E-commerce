import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiTrash2, FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { getImageSrc } from "../utils/constants";
import "./Cart.css";

const SHIPPING_THRESHOLD = 5000;
const SHIPPING_PRICE = 200;

function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    getCartTotal,
  } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_PRICE;
  const total = subtotal + shipping;

  const handleClearCart = () => {
    clearCart();
    toast.success("Cart cleared.");
  };

  const handleRemove = (item) => {
    removeFromCart(item._id);
    toast.success(`${item.name} removed from cart.`);
  };

  const handleCheckout = () => {
    if (!user) {
      navigate("/login", { state: { from: "/checkout" } });
    } else {
      navigate("/checkout");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <FiShoppingBag size={72} color="#94a3b8" />
        <h2>Your cart is empty</h2>
        <p>Looks like you haven&apos;t added anything yet.</p>
        <Link to="/products" className="cart-empty-btn">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <button className="cart-clear-btn" onClick={handleClearCart}>
          <FiTrash2 /> Clear all
        </button>
      </div>

      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-item" key={item._id}>
              <img src={getImageSrc(item.image)} alt={item.name} />

              <div className="cart-item-info">
                <Link to={`/products/${item._id}`} className="cart-item-name">
                  {item.name}
                </Link>
                <p className="cart-item-category">{item.category}</p>
                <p className="cart-item-price">ETB {item.price?.toLocaleString()}</p>
              </div>

              <div className="cart-item-qty">
                <button onClick={() => decreaseQuantity(item._id)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQuantity(item._id)}>+</button>
              </div>

              <div className="cart-item-subtotal">
                ETB {(item.price * item.quantity).toLocaleString()}
              </div>

              <button
                className="cart-remove-btn"
                onClick={() => handleRemove(item)}
                aria-label="Remove item"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>ETB {subtotal.toLocaleString()}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>
              {shipping === 0
                ? <span className="free-ship">FREE</span>
                : `ETB ${shipping}`}
            </span>
          </div>

          {shipping > 0 && (
            <p className="free-ship-note">
              Add ETB {(SHIPPING_THRESHOLD - subtotal).toLocaleString()} more for free shipping
            </p>
          )}

          <hr className="summary-divider" />

          <div className="summary-total">
            <span>Total</span>
            <span>ETB {total.toLocaleString()}</span>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>

          <Link to="/products" className="continue-shopping">
            <FiArrowLeft /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
