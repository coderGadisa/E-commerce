const nodemailer = require("nodemailer");
const templates = require("../utils/emailTemplates");

// ─────────────────────────────────────────────────────────
// Create transporter lazily so missing env vars at startup
// don't crash the server — emails simply won't send.
// ─────────────────────────────────────────────────────────
let _transporter = null;

const getTransporter = () => {
  if (_transporter) return _transporter;

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;

  if (!user || !pass) {
    console.warn("[Email] EMAIL_USER or EMAIL_PASSWORD not set — emails disabled");
    return null;
  }

  _transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: user,
      // Strip spaces — Gmail app passwords are sometimes pasted as
      // "xxxx xxxx xxxx xxxx" (19 chars with spaces) but the real
      // credential is the 16-char version without spaces
      pass: pass.replace(/\s/g, ""),
    },
  });

  return _transporter;
};

// ─────────────────────────────────────────────────────────
// Core send function — fire-and-forget.
// Errors are logged but NEVER thrown — email failure must
// never break an HTTP response or payment flow.
// ─────────────────────────────────────────────────────────
const sendEmail = async ({ to, subject, html }) => {
  const transporter = getTransporter();
  if (!transporter) return; // emails disabled — skip silently

  try {
    const info = await transporter.sendMail({
      from: `"TechStore" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`[Email] Sent to ${to}: ${subject} (${info.messageId})`);
  } catch (err) {
    // Log but never throw — don't break the calling flow
    console.error(`[Email] Failed to send to ${to}:`, err.message);
  }
};

// ─────────────────────────────────────────────────────────
// Public API — one function per email type
// ─────────────────────────────────────────────────────────

/**
 * Sends a welcome email after user registration.
 */
const sendWelcomeEmail = (user) => {
  const { subject, html } = templates.welcomeEmail(user.name);
  return sendEmail({ to: user.email, subject, html });
};

/**
 * Sends an order confirmation email.
 * Used for COD orders (paid orders use sendPaymentConfirmationEmail instead).
 */
const sendOrderConfirmationEmail = (user, order) => {
  const { subject, html } = templates.orderConfirmationEmail(user.name, order);
  return sendEmail({ to: user.email, subject, html });
};

/**
 * Sends a payment confirmed email after Chapa verifies a payment.
 */
const sendPaymentConfirmationEmail = (user, order) => {
  const { subject, html } = templates.paymentConfirmationEmail(user.name, order);
  return sendEmail({ to: user.email, subject, html });
};

/**
 * Sends an order status update email when admin changes order status.
 */
const sendOrderStatusUpdateEmail = (user, order) => {
  const { subject, html } = templates.orderStatusUpdateEmail(user.name, order);
  return sendEmail({ to: user.email, subject, html });
};

/**
 * Sends an order cancellation email when user cancels their order.
 */
const sendOrderCancellationEmail = (user, order) => {
  const { subject, html } = templates.orderCancellationEmail(user.name, order);
  return sendEmail({ to: user.email, subject, html });
};

module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendPaymentConfirmationEmail,
  sendOrderStatusUpdateEmail,
  sendOrderCancellationEmail,
};
