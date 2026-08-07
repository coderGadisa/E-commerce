import { FiStar } from "react-icons/fi";
import "./Rating.css";

function Rating({ value = 0, max = 5, size = 16 }) {
  return (
    <div className="rating" style={{ fontSize: size }}>
      {[...Array(max)].map((_, i) => (
        <FiStar
          key={i}
          className={i < Math.floor(value) ? "rating-star rating-star--filled" : "rating-star"}
        />
      ))}
      <span className="rating-text">({value.toFixed(1)})</span>
    </div>
  );
}

export default Rating;
