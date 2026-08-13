// ─────────────────────────────────────────────────────────
// Email HTML templates for TechStore transactional emails.
// All templates use inline CSS for maximum email client
// compatibility (Gmail, Outlook, Apple Mail, etc.)
// ─────────────────────────────────────────────────────────

const BASE = {
  primaryColor: "#2563eb",
  bgColor:      "#f8fafc",
  cardBg:       "#ffffff",
  textDark:     "#1e293b",
  textMid:      "#475569",
  textLight:    "#64748b",
  border:       "#e2e8f0",
  green:        "#16a34a",
  red:          "#dc2626",
  orange:       "#d97706",
};

// ── Shared wrapper ─────────────────────────────────────────
const wrap = (title, bodyHtml) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:${BASE.bgColor};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${BASE.bgColor};padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
             style="max-width:600px;width:100%;background:${BASE.cardBg};border-radius:12px;
                    border:1px solid ${BASE.border};overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="background:${BASE.primaryColor};padding:28px 32px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">
              TechStore
            </h1>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">
              Electronics &amp; Gadgets
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 32px 24px;">
            ${bodyHtml}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:${BASE.bgColor};padding:20px 32px;
                     border-top:1px solid ${BASE.border};text-align:center;">
            <p style="margin:0;color:${BASE.textLight};font-size:12px;">
              TechStore &bull; Addis Ababa, Ethiopia<br/>
              This is an automated message — please do not reply to this email.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

// ── Helper: item row in order table ────────────────────────
const itemRows = (items) =>
  items.map(item => `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid ${BASE.border};
               color:${BASE.textMid};font-size:14px;">${item.name}</td>
    <td style="padding:10px 0;border-bottom:1px solid ${BASE.border};
               color:${BASE.textMid};font-size:14px;text-align:center;">×${item.quantity}</td>
    <td style="padding:10px 0;border-bottom:1px solid ${BASE.border};
               color:${BASE.textDark};font-size:14px;text-align:right;font-weight:600;">
      ETB ${(item.price * item.quantity).toLocaleString()}
    </td>
  </tr>`).join("");

// ── Helper: order summary block ─────────────────────────────
const orderSummaryBlock = (order) => {
  const shortId = order._id.toString().slice(-8).toUpperCase();
  const date    = new Date(order.createdAt).toLocaleDateString("en-US",
    { year: "numeric", month: "long", day: "numeric" });

  const statusColors = {
    processing: BASE.orange,
    shipped:    BASE.primaryColor,
    delivered:  BASE.green,
    cancelled:  BASE.red,
  };
  const statusColor = statusColors[order.orderStatus] || BASE.textMid;

  return `
  <!-- Order meta -->
  <table width="100%" cellpadding="0" cellspacing="0"
         style="background:${BASE.bgColor};border-radius:8px;
                border:1px solid ${BASE.border};margin-bottom:24px;">
    <tr>
      <td style="padding:14px 18px;border-bottom:1px solid ${BASE.border};">
        <span style="font-size:12px;color:${BASE.textLight};font-weight:600;">ORDER ID</span><br/>
        <span style="font-size:15px;color:${BASE.textDark};font-weight:700;font-family:monospace;">
          #${shortId}
        </span>
      </td>
      <td style="padding:14px 18px;border-bottom:1px solid ${BASE.border};">
        <span style="font-size:12px;color:${BASE.textLight};font-weight:600;">DATE</span><br/>
        <span style="font-size:14px;color:${BASE.textMid};">${date}</span>
      </td>
      <td style="padding:14px 18px;border-bottom:1px solid ${BASE.border};">
        <span style="font-size:12px;color:${BASE.textLight};font-weight:600;">STATUS</span><br/>
        <span style="font-size:14px;color:${statusColor};font-weight:700;text-transform:capitalize;">
          ${order.orderStatus}
        </span>
      </td>
    </tr>
    <tr>
      <td colspan="3" style="padding:14px 18px;">
        <span style="font-size:12px;color:${BASE.textLight};font-weight:600;">SHIP TO</span><br/>
        <span style="font-size:14px;color:${BASE.textMid};">
          ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.country}
        </span>
      </td>
    </tr>
  </table>

  <!-- Items table -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
    <tr>
      <th style="padding:8px 0;font-size:12px;color:${BASE.textLight};
                 font-weight:600;text-align:left;border-bottom:2px solid ${BASE.border};">ITEM</th>
      <th style="padding:8px 0;font-size:12px;color:${BASE.textLight};
                 font-weight:600;text-align:center;border-bottom:2px solid ${BASE.border};">QTY</th>
      <th style="padding:8px 0;font-size:12px;color:${BASE.textLight};
                 font-weight:600;text-align:right;border-bottom:2px solid ${BASE.border};">PRICE</th>
    </tr>
    ${itemRows(order.items)}
  </table>

  <!-- Totals -->
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="padding:5px 0;font-size:14px;color:${BASE.textMid};">Subtotal</td>
      <td style="padding:5px 0;font-size:14px;color:${BASE.textMid};text-align:right;">
        ETB ${order.itemsTotal.toLocaleString()}
      </td>
    </tr>
    <tr>
      <td style="padding:5px 0;font-size:14px;color:${BASE.textMid};">Shipping</td>
      <td style="padding:5px 0;font-size:14px;color:${BASE.textMid};text-align:right;">
        ${order.shippingPrice === 0 ? '<span style="color:#16a34a;font-weight:600;">Free</span>' : "ETB " + order.shippingPrice.toLocaleString()}
      </td>
    </tr>
    <tr>
      <td style="padding:10px 0 0;font-size:16px;font-weight:700;
                 color:${BASE.textDark};border-top:2px solid ${BASE.border};">Total</td>
      <td style="padding:10px 0 0;font-size:16px;font-weight:700;
                 color:${BASE.primaryColor};text-align:right;border-top:2px solid ${BASE.border};">
        ETB ${order.totalPrice.toLocaleString()}
      </td>
    </tr>
  </table>`;
};

// ─────────────────────────────────────────────────────────────
// 1. Welcome email — sent after registration
// ─────────────────────────────────────────────────────────────
const welcomeEmail = (userName) => ({
  subject: "Welcome to TechStore! 🎉",
  html: wrap("Welcome to TechStore", `
    <h2 style="margin:0 0 8px;font-size:22px;color:${BASE.textDark};">
      Welcome, ${userName}!
    </h2>
    <p style="margin:0 0 20px;font-size:15px;color:${BASE.textMid};line-height:1.6;">
      Your TechStore account has been created successfully.
      Explore our wide range of laptops, phones, accessories, monitors,
      and smart watches — all priced in Ethiopian Birr (ETB).
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="background:${BASE.bgColor};border-radius:8px;padding:16px;
                   border:1px solid ${BASE.border};">
          <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:${BASE.textLight};">
            WHAT YOU CAN DO
          </p>
          <ul style="margin:0;padding-left:18px;color:${BASE.textMid};font-size:14px;line-height:2;">
            <li>Browse and search our full product catalog</li>
            <li>Add items to your cart and wishlist</li>
            <li>Place orders with Cash on Delivery or Chapa payment</li>
            <li>Track your orders in real time</li>
          </ul>
        </td>
      </tr>
    </table>
    <p style="margin:0;font-size:14px;color:${BASE.textLight};">
      If you didn't create this account, please ignore this email.
    </p>
  `),
});

// ─────────────────────────────────────────────────────────────
// 2. Order confirmation — sent when order is created (COD)
// ─────────────────────────────────────────────────────────────
const orderConfirmationEmail = (userName, order) => {
  const paymentLabels = {
    cash_on_delivery: "Cash on Delivery",
    card:             "Card (Chapa)",
    mobile_money:     "Mobile Money (Chapa)",
  };

  return {
    subject: `Order Confirmed — #${order._id.toString().slice(-8).toUpperCase()} | TechStore`,
    html: wrap("Order Confirmation", `
      <h2 style="margin:0 0 6px;font-size:22px;color:${BASE.textDark};">
        Order Confirmed!
      </h2>
      <p style="margin:0 0 24px;font-size:15px;color:${BASE.textMid};line-height:1.6;">
        Hi ${userName}, thank you for your order.
        We've received it and it's being processed.
      </p>

      ${orderSummaryBlock(order)}

      <table width="100%" cellpadding="0" cellspacing="0"
             style="margin-top:20px;background:${BASE.bgColor};border:1px solid ${BASE.border};
                    border-radius:8px;">
        <tr>
          <td style="padding:14px 18px;">
            <span style="font-size:12px;color:${BASE.textLight};font-weight:600;">
              PAYMENT METHOD
            </span><br/>
            <span style="font-size:14px;color:${BASE.textMid};">
              ${paymentLabels[order.paymentMethod] || order.paymentMethod}
            </span>
          </td>
          <td style="padding:14px 18px;">
            <span style="font-size:12px;color:${BASE.textLight};font-weight:600;">
              PAYMENT STATUS
            </span><br/>
            <span style="font-size:14px;color:${order.paymentStatus === "paid" ? BASE.green : BASE.orange};
                         font-weight:600;text-transform:capitalize;">
              ${order.paymentStatus}
            </span>
          </td>
        </tr>
      </table>
    `),
  };
};

// ─────────────────────────────────────────────────────────────
// 3. Payment confirmation — sent after Chapa verifies payment
// ─────────────────────────────────────────────────────────────
const paymentConfirmationEmail = (userName, order) => ({
  subject: `Payment Confirmed — #${order._id.toString().slice(-8).toUpperCase()} | TechStore`,
  html: wrap("Payment Confirmed", `
    <!-- Green checkmark banner -->
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;
                padding:16px;margin-bottom:24px;text-align:center;">
      <p style="margin:0;font-size:18px;font-weight:700;color:${BASE.green};">
        ✓ Payment Successful
      </p>
      <p style="margin:4px 0 0;font-size:13px;color:#166534;">
        ETB ${order.totalPrice.toLocaleString()} received
      </p>
    </div>

    <h2 style="margin:0 0 6px;font-size:20px;color:${BASE.textDark};">
      Your payment has been confirmed
    </h2>
    <p style="margin:0 0 24px;font-size:15px;color:${BASE.textMid};line-height:1.6;">
      Hi ${userName}, your payment was processed successfully and
      your order is now being prepared for shipment.
    </p>

    ${orderSummaryBlock(order)}
  `),
});

// ─────────────────────────────────────────────────────────────
// 4. Order status update — sent when admin changes status
// ─────────────────────────────────────────────────────────────
const orderStatusUpdateEmail = (userName, order) => {
  const statusMessages = {
    processing: {
      heading: "Your order is being processed",
      body:    "We're preparing your order for shipment. You'll receive another email when it ships.",
      color:   BASE.orange,
      icon:    "⏳",
    },
    shipped: {
      heading: "Your order has shipped!",
      body:    "Great news — your order is on its way. It should arrive within the estimated delivery window.",
      color:   BASE.primaryColor,
      icon:    "🚚",
    },
    delivered: {
      heading: "Your order has been delivered!",
      body:    "We hope you love your purchase. If you have any issues, please contact our support team.",
      color:   BASE.green,
      icon:    "✅",
    },
    cancelled: {
      heading: "Your order has been cancelled",
      body:    "Your order has been cancelled. If stock was deducted, it has been restored. Contact support if you have questions.",
      color:   BASE.red,
      icon:    "❌",
    },
  };

  const info = statusMessages[order.orderStatus] || {
    heading: `Order status updated to ${order.orderStatus}`,
    body:    "Your order status has been updated.",
    color:   BASE.textMid,
    icon:    "📦",
  };

  return {
    subject: `Order Update — ${info.icon} ${order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)} | #${order._id.toString().slice(-8).toUpperCase()}`,
    html: wrap("Order Status Update", `
      <h2 style="margin:0 0 6px;font-size:22px;color:${BASE.textDark};">
        ${info.icon} ${info.heading}
      </h2>
      <p style="margin:0 0 24px;font-size:15px;color:${BASE.textMid};line-height:1.6;">
        Hi ${userName}, ${info.body}
      </p>

      ${orderSummaryBlock(order)}
    `),
  };
};

// ─────────────────────────────────────────────────────────────
// 5. Order cancellation — sent when user cancels their order
// ─────────────────────────────────────────────────────────────
const orderCancellationEmail = (userName, order) => ({
  subject: `Order Cancelled — #${order._id.toString().slice(-8).toUpperCase()} | TechStore`,
  html: wrap("Order Cancelled", `
    <h2 style="margin:0 0 6px;font-size:22px;color:${BASE.textDark};">
      Your order has been cancelled
    </h2>
    <p style="margin:0 0 24px;font-size:15px;color:${BASE.textMid};line-height:1.6;">
      Hi ${userName}, your order has been successfully cancelled.
      Any stock deductions have been reversed.
    </p>

    ${orderSummaryBlock(order)}

    <p style="margin:20px 0 0;font-size:14px;color:${BASE.textLight};">
      If you cancelled by mistake or need assistance, please contact our support team.
    </p>
  `),
});

module.exports = {
  welcomeEmail,
  orderConfirmationEmail,
  paymentConfirmationEmail,
  orderStatusUpdateEmail,
  orderCancellationEmail,
};
