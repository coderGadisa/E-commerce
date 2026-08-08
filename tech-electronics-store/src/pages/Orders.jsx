import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiPackage, FiChevronDown, FiChevronUp, FiExternalLink } from "react-icons/fi";
import api from "../services/api";
import Loader from "../components/Loader/Loader";
import "./Orders.css";

const STATUS_COLORS = {
  processing: { bg: "#fef9c3", color: "#92400e", label: "Processing" },
  shipped: { bg: "#dbeafe", color: "#1e40af", label: "Shipped" },
  delivered: { bg: "#dcfce7", color: "#166534", label: "Delivered" },
  cancelled: { bg: "#fee2e2", color: "#991b1b", label: "Cancelled" },
};

function OrderCard({ order }) {
  const [open, setOpen] = useState(false);
  const s = STATUS_COLORS[order.orderStatus] || STATUS_COLORS.processing;

  return (
    <div className="order-card">
      <div className="order-card-header" onClick={() => setOpen(!open)}>
        <div className="order-meta">
          <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
          <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="order-right">
          <span className="order-status-badge" style={{ background: s.bg, color: s.color }}>
            {s.label}
          </span>
          <span className="order-total">ETB {order.totalPrice?.toLocaleString()}</span>
          {open ? <FiChevronUp /> : <FiChevronDown />}
        </div>
      </div>

      {open && (
        <div className="order-card-body">
          <div className="order-items">
            {order.items.map((item, i) => (
              <div key={i} className="order-item-row">
                <span className="oi-name">{item.name}</span>
                <span className="oi-qty">×{item.quantity}</span>
                <span className="oi-price">ETB {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="order-footer">
            <div className="order-address">
              <strong>Shipping to:</strong>{" "}
              {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.country}
            </div>
            <div className="order-payment">
              <strong>Payment:</strong>{" "}
              {order.paymentMethod === "cash_on_delivery" ? "Cash on Delivery" :
                order.paymentMethod === "card" ? "Card" : "Mobile Money"}
              {" — "}
              <span style={{ color: order.paymentStatus === "paid" ? "#16a34a" : "#92400e" }}>
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </span>
            </div>
            <Link to={`/orders/${order._id}`} className="order-details-link">
              <FiExternalLink size={13} /> View Details
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const newOrder = location.state?.newOrder;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/myorders");
        const raw = res.data;
        setOrders(Array.isArray(raw.data) ? raw.data : raw);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      {newOrder && (
        <div className="order-success-banner">
          ✅ Order placed successfully! Order #{newOrder._id?.slice(-8).toUpperCase()}
        </div>
      )}

      {loading ? (
        <Loader />
      ) : orders.length === 0 ? (
        <div className="orders-empty">
          <FiPackage size={64} color="#94a3b8" />
          <h2>No orders yet</h2>
          <p>When you place an order, it will appear here.</p>
          <Link to="/products" className="orders-shop-btn">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
