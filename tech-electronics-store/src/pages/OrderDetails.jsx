import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPackage } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../services/api";
import Loader from "../components/Loader/Loader";
import "./OrderDetails.css";

const STATUS_COLORS = {
  processing: { bg: "#fef9c3", color: "#92400e", label: "Processing" },
  shipped:    { bg: "#dbeafe", color: "#1e40af", label: "Shipped" },
  delivered:  { bg: "#dcfce7", color: "#166534", label: "Delivered" },
  cancelled:  { bg: "#fee2e2", color: "#991b1b", label: "Cancelled" },
};

const PAYMENT_LABELS = {
  cash_on_delivery: "Cash on Delivery",
  card:             "Card",
  mobile_money:     "Mobile Money",
};

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        const raw = res.data;
        setOrder(raw.data ?? raw);
      } catch (err) {
        const msg = err?.response?.data?.message || "Failed to load order.";
        toast.error(msg);
        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(true);
    try {
      const res = await api.put(`/orders/${id}/cancel`);
      const updated = res.data?.data ?? res.data;
      setOrder(updated);
      toast.success("Order cancelled successfully.");
    } catch (err) {
      const msg = err?.response?.data?.message || "Could not cancel order.";
      toast.error(msg);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <Loader />;
  if (!order)  return null;

  const s = STATUS_COLORS[order.orderStatus] || STATUS_COLORS.processing;
  const shortId = order._id.slice(-8).toUpperCase();

  return (
    <div className="od-page">
      {/* Back link */}
      <Link to="/orders" className="od-back">
        <FiArrowLeft size={16} /> Back to Orders
      </Link>

      {/* Page header */}
      <div className="od-header">
        <div className="od-header-left">
          <FiPackage size={22} className="od-icon" />
          <div>
            <h1 className="od-title">Order #{shortId}</h1>
            <p className="od-date">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </p>
          </div>
        </div>
        <span
          className="od-status-badge"
          style={{ background: s.bg, color: s.color }}
        >
          {s.label}
        </span>
      </div>

      <div className="od-body">
        {/* ── Items ───────────────────────── */}
        <div className="od-card od-items-card">
          <h2 className="od-card-title">Items Ordered</h2>
          <div className="od-items-list">
            {order.items.map((item, i) => (
              <div key={i} className="od-item-row">
                <img
                  src={item.image}
                  alt={item.name}
                  className="od-item-img"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                <div className="od-item-info">
                  <Link
                    to={`/products/${item.product}`}
                    className="od-item-name"
                  >
                    {item.name}
                  </Link>
                  <span className="od-item-unit">
                    ETB {item.price.toLocaleString()} each
                  </span>
                </div>
                <div className="od-item-right">
                  <span className="od-item-qty">×{item.quantity}</span>
                  <span className="od-item-total">
                    ETB {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="od-sidebar">
          {/* ── Order Summary ─────────────── */}
          <div className="od-card od-summary-card">
            <h2 className="od-card-title">Order Summary</h2>
            <div className="od-summary-row">
              <span>Subtotal</span>
              <span>ETB {order.itemsTotal?.toLocaleString()}</span>
            </div>
            <div className="od-summary-row">
              <span>Shipping</span>
              <span>
                {order.shippingPrice === 0
                  ? <span className="od-free">Free</span>
                  : `ETB ${order.shippingPrice?.toLocaleString()}`}
              </span>
            </div>
            <div className="od-summary-divider" />
            <div className="od-summary-row od-summary-total">
              <span>Total</span>
              <span>ETB {order.totalPrice?.toLocaleString()}</span>
            </div>
          </div>

          {/* ── Shipping Address ──────────── */}
          <div className="od-card">
            <h2 className="od-card-title">Shipping Address</h2>
            <p className="od-address-line">{order.shippingAddress.street}</p>
            <p className="od-address-line">
              {order.shippingAddress.city}
              {order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ""}
              {order.shippingAddress.zipCode ? ` ${order.shippingAddress.zipCode}` : ""}
            </p>
            <p className="od-address-line">{order.shippingAddress.country}</p>
          </div>

          {/* ── Payment ───────────────────── */}
          <div className="od-card">
            <h2 className="od-card-title">Payment</h2>
            <div className="od-payment-row">
              <span className="od-payment-method">
                {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
              </span>
              <span
                className="od-payment-status"
                style={{
                  color: order.paymentStatus === "paid" ? "#16a34a" :
                         order.paymentStatus === "failed" ? "#dc2626" : "#92400e",
                }}
              >
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </span>
            </div>
            {order.deliveredAt && (
              <p className="od-delivered-at">
                Delivered on{" "}
                {new Date(order.deliveredAt).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </p>
            )}
          </div>

          {/* ── Cancel Button ─────────────── */}
          {order.orderStatus === "processing" && (
            <button
              className="od-cancel-btn"
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? "Cancelling…" : "Cancel Order"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
