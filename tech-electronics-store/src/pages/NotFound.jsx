import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-content">
        <div className="notfound-code">404</div>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <div className="notfound-actions">
          <Link to="/" className="notfound-home">Go to Home</Link>
          <Link to="/products" className="notfound-products">Browse Products</Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
