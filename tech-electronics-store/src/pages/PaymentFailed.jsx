import { useSearchParams, Link } from "react-router-dom";
import { FiXCircle, FiRefreshCw, FiShoppingCart, FiHome } from "react-icons/fi";
import useDocumentTitle from "../hooks/useDocumentTitle";
import "./PaymentFailed.css";

function PaymentFailed() {
  useDocumentTitle("Payment Failed");

  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div className="pf-page">
      <div className="pf-card">
        {/* Icon */}
        <div className="pf-icon-wrap">
          <FiXCircle className="pf-icon" size={64} />
        </div>

        {/* Heading */}
        <h1 className="pf-title">Payment Failed</h1>
        <p className="pf-subtitle">
          Your payment was not completed. Your order has been saved but is not yet paid.
          You can try again or choose a different payment method.
        </p>

        {orderId && (
          <div className="pf-order-ref">
            <span className="pf-order-label">Order ID</span>
            <span className="pf-order-id">#{orderId.toString().slice(-8).toUpperCase()}</span>
          </div>
        )}

        <div className="pf-reasons">
          <p className="pf-reasons-title">This can happen because:</p>
          <ul>
            <li>The payment was cancelled</li>
            <li>Insufficient balance</li>
            <li>Bank or network timeout</li>
            <li>Card/account was declined</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="pf-actions">
          {/* Retry: go back to checkout */}
          <Link to="/checkout" className="pf-btn pf-btn-primary">
            <FiRefreshCw size={16} /> Try Again
          </Link>

          {/* View the pending order */}
          {orderId && (
            <Link to={`/orders/${orderId}`} className="pf-btn pf-btn-secondary">
              View Order
            </Link>
          )}

          <Link to="/cart" className="pf-btn pf-btn-ghost">
            <FiShoppingCart size={16} /> Return to Cart
          </Link>

          <Link to="/" className="pf-btn pf-btn-ghost">
            <FiHome size={16} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PaymentFailed;
