import { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";
import "./Contact.css";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending
    setTimeout(() => {
      setSent(true);
      setLoading(false);
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h1>Contact Us</h1>
        <p>We're here to help. Reach out anytime.</p>
      </div>

      <div className="contact-layout">
        {/* Info */}
        <div className="contact-info">
          <h2>Get in Touch</h2>

          <div className="contact-info-item">
            <div className="contact-icon"><FiMapPin /></div>
            <div>
              <strong>Location</strong>
              <p>Bole Road, Addis Ababa, Ethiopia</p>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-icon"><FiPhone /></div>
            <div>
              <strong>Phone</strong>
              <p>+251 911 123 456</p>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-icon"><FiMail /></div>
            <div>
              <strong>Email</strong>
              <p>support@techstore.et</p>
            </div>
          </div>

          <div className="contact-hours">
            <h3>Business Hours</h3>
            <p>Mon – Fri: 8:00 AM – 6:00 PM</p>
            <p>Saturday: 9:00 AM – 4:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>

        {/* Form */}
        <div className="contact-form-card">
          {sent ? (
            <div className="contact-success">
              <div className="contact-success-icon">✅</div>
              <h2>Message Sent!</h2>
              <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
              <button onClick={() => setSent(false)} className="contact-again-btn">
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required />
              </div>

              <div className="form-group">
                <label htmlFor="cemail">Email Address</label>
                <input id="cemail" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input id="subject" name="subject" value={form.subject} onChange={handleChange} placeholder="Order issue, general inquiry..." />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help..."
                  rows={5}
                  required
                ></textarea>
              </div>

              <button type="submit" className="contact-submit-btn" disabled={loading || !form.name || !form.email || !form.message}>
                <FiSend />
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Contact;
