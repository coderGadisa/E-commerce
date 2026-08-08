import { FiTrash2 } from "react-icons/fi";
import StarRating from "../StarRating/StarRating";
import "./ReviewList.css";

function ReviewList({ reviews, currentUserId, userRole, onDelete }) {
  if (!reviews || reviews.length === 0) {
    return (
      <p className="review-list__empty">
        No reviews yet. Be the first to review this product!
      </p>
    );
  }

  return (
    <div className="review-list">
      {reviews.map((review) => {
        const canDelete =
          userRole === "admin" ||
          (currentUserId && review.user === currentUserId) ||
          (currentUserId && review.user?._id === currentUserId);

        return (
          <div key={review._id} className="review-item">
            <div className="review-item__header">
              <div className="review-item__avatar">
                {review.name?.charAt(0).toUpperCase()}
              </div>

              <div className="review-item__meta">
                <div className="review-item__name">{review.name}</div>
                <div className="review-item__date">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>

              <StarRating value={review.rating} size={15} />

              {canDelete && onDelete && (
                <button
                  className="review-item__delete"
                  onClick={() => onDelete(review._id)}
                  title="Delete review"
                  aria-label="Delete review"
                >
                  <FiTrash2 size={15} />
                </button>
              )}
            </div>

            <p className="review-item__comment">{review.comment}</p>
          </div>
        );
      })}
    </div>
  );
}

export default ReviewList;
