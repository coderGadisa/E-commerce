import { useState } from "react";
import "./AnnouncementBar.css";

function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="announcement-bar" role="banner">
      <p>
        🚚&nbsp;<strong>Free Shipping</strong> on orders over&nbsp;
        <strong>ETB 5,000</strong>&nbsp;— Shop now and save!
      </p>
      <button
        className="announcement-close"
        onClick={() => setVisible(false)}
        aria-label="Close announcement"
      >
        ×
      </button>
    </div>
  );
}

export default AnnouncementBar;
