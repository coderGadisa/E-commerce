import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiPackage, FiHome } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../services/api";
import Loader from "../components/Loader/Loader";
import useDocumentTitle from "../hooks/useDocumentTitle";
import "./PaymentSuccess.css";

function PaymentSuccess() {
  useDocumentTitle("Payment Successful");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const txRef = searchParams.get("tx_ref");
  const orderId = searchParams.get("order_id");

  const [status, setStatus] = useState("verifying"); // "verifying" | "success" | "failed"
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!txRef) {
      // No tx_ref means user landed here directly — redirect home
      navigate("/");
      return;
    }

    const verify = async () => {
      try {
        const res = await api.get(`/payment/verify?tx_ref=${txRef}`);
        const data = res.data.data;

        if (data.paymentStatus === "paid") {
          setOrder(data);
          setStatus("success");
          toast.success("Payment confirmed!");
        } else {
          setStatus("failed");
        }
      } catch (err) {
        const raw = err?.response?.data?.message;
        const msg = typeof raw === "string"
          ? raw
          : raw && typeof raw === "object"
            ? Object.values(raw).flat().join(" | ")
            : "Payment verification failed.";
        // If already verified, treat as success
        if (err?.response?.data?.success === true) {
          setStatus("success");
        } else {
          toast.error(msg);
          setStatus("failed");
        }
      }
    };

    verify();
  }, [txRef, navigate]);

  if (status === "verifying") {
    return (
      <div className="ps-page">
        <Loader />
        <p className="ps-verifying-text">Verifying your payment...</p>
      </div>
    );
  }

  if (status === "failed") {
    navigate(`/payment/failed?order_id=${orderId || ""}`);
    return null;
  }

  const shortId = (order?.orderId || orderId || "").toString().slice(-8).toUpperCase();

  return (
    <div className="ps-page">
      <div className="ps-card">
        {/* Icon */}
        <div className="ps-icon-wrap">
          <FiCheckCircle className="ps-icon" size={64} />
        </div>

        {/* Heading */}
        <h1 className="ps-title">Payment Successful!</h1>
        <p className="ps-subtitle">
          Your payment has been confirmed and your order is being processed.
        </p>

        {/* Order info */}
        {shortId && (
          <div className="ps-order-ref">
            <span className="ps-order-label">Order Reference</span>
            <span className="ps-order-id">#{shortId}</span>
          </div>
        )}

        {order && (
          <div className="ps-summary">
            <div className="ps-summary-row">
              <span>Payment Status</span>
              <span className="ps-paid">Paid</span>
            </div>
            <div className="ps-summary-row">
              <span>Order Status</span>
              <span className="ps-processing">
                {order.orderStatus
                  ? order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)
                  : "Processing"}
              </span>
            </div>
            {order.totalPrice && (
              <div className="ps-summary-row">
                <span>Amount Paid</span>
                <span className="ps-amount">ETB {Number(order.totalPrice).toLocaleString()}</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="ps-actions">
          <Link
            to={order?.orderId ? `/orders/${order.orderId}` : "/orders"}
            className="ps-btn ps-btn-primary"
          >
            <FiPackage size={16} /> View My Order
          </Link>
          <Link to="/" className="ps-btn ps-btn-secondary">
            <FiHome size={16} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
