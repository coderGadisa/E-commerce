import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import "./Checkout.css";

const SHIPPING_THRESHOLD = 5000;
const SHIPPING_PRICE = 200;

function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zipCode: user?.address?.zipCode || "",
    country: user?.address?.country || "",
    paymentMethod: "cash_on_delivery",
  });
  const [loading, setLoading] = useState(false);

  const subtotal = getCartTotal();
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_PRICE;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.street || !form.city || !form.country) {
      toast.error("Please fill in all required address fields.");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);
      const orderPayload = {
        items: cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          street: form.street,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          country: form.country,
        },
        paymentMethod: form.paymentMethod,
      };

      const res = await api.post("/orders", orderPayload);
      clearCart();
      toast.success("Order placed successfully! 🎉");
      navigate("/orders", { state: { newOrder: res.data.data } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-layout">
        {/* Form */}
        <form onSubmit={handleSubmit} className="checkout-form" noValidate>
          <div className="checkout-section">
            <h2>Shipping Address</h2>

            <div className="form-group">
              <label>Street Address *</label>
              <input name="street" value={form.street} onChange={handleChange} placeholder="123 Main St" required />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>City *</label>
                <input name="city" value={form.city} onChange={handleChange} placeholder="Addis Ababa" required />
              </div>
              <div className="form-group">
                <label>State / Region</label>
                <input name="state" value={form.state} onChange={handleChange} placeholder="Oromia" />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>ZIP / Postal Code</label>
                <input name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="1000" />
              </div>
              <div className="form-group">
                <label>Country *</label>
                <input name="country" value={form.country} onChange={handleChange} placeholder="Ethiopia" required />
              </div>
            </div>
          </div>

          <div className="checkout-section">
            <h2>Payment Method</h2>

            {["cash_on_delivery", "card", "mobile_money"].map((method) => (
              <label key={method} className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={form.paymentMethod === method}
                  onChange={handleChange}
                />
                <span>
                  {method === "cash_on_delivery" && "💵 Cash on Delivery"}
                  {method === "card" && "💳 Credit / Debit Card"}
                  {method === "mobile_money" && "📱 Mobile Money (Telebirr / CBE)"}
                </span>
              </label>
            ))}
          </div>

          <button type="submit" className="place-order-btn" disabled={loading}>
            {loading ? "Placing Order..." : `Place Order — ETB ${total.toLocaleString()}`}
          </button>
        </form>

        {/* Summary */}
        <div className="checkout-summary">
          <h2>Your Items ({cartItems.length})</h2>

          <div className="checkout-items">
            {cartItems.map((item) => (
              <div key={item._id} className="checkout-item">
                <div className="co-item-name">{item.name} <span>×{item.quantity}</span></div>
                <div className="co-item-price">ETB {(item.price * item.quantity).toLocaleString()}</div>
              </div>
            ))}
          </div>

          <hr />

          <div className="co-row"><span>Subtotal</span><span>ETB {subtotal.toLocaleString()}</span></div>
          <div className="co-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? <span className="free-label">FREE</span> : `ETB ${shipping}`}</span>
          </div>
          <div className="co-row co-total">
            <span>Total</span>
            <span>ETB {total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
