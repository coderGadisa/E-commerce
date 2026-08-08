import { useState } from "react";
import "./StarRating.css";

/**
 * StarRating — two modes:
 *   display mode  (interactive=false): shows filled/empty stars from a value (0–5)
 *   interactive   (interactive=true):  clickable star picker, calls onChange(rating)
 */
function StarRating({
  value = 0,
  max = 5,
  interactive = false,
  onChange,
  size = 18,
  showCount = false,
  count = 0,
}) {
  const [hovered, setHovered] = useState(0);

  if (interactive) {
    return (
      <div className="star-rating star-rating--interactive" aria-label="Select rating">
        {[...Array(max)].map((_, i) => {
          const starVal = i + 1;
          return (
            <span
              key={starVal}
              className={`star ${(hovered || value) >= starVal ? "filled" : ""}`}
              style={{ fontSize: size + 4 }}
              onClick={() => onChange && onChange(starVal)}
              onMouseEnter={() => setHovered(starVal)}
              onMouseLeave={() => setHovered(0)}
              role="button"
              aria-label={`Rate ${starVal} star${starVal > 1 ? "s" : ""}`}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onChange && onChange(starVal)}
            >
              ★
            </span>
          );
        })}
      </div>
    );
  }

  // Display mode
  return (
    <div className="star-rating star-rating--display" style={{ fontSize: size }}>
      {[...Array(max)].map((_, i) => {
        const starVal = i + 1;
        const filled = value >= starVal;
        const half   = !filled && value >= starVal - 0.5;
        return (
          <span
            key={starVal}
            className={`star ${filled ? "filled" : ""} ${half ? "half" : ""}`}
            aria-hidden="true"
          >
            ★
          </span>
        );
      })}
      {showCount && (
        <span className="star-rating__count">
          {value > 0 ? value.toFixed(1) : "No ratings"}
          {count > 0 && ` (${count})`}
        </span>
      )}
    </div>
  );
}

export default StarRating;
