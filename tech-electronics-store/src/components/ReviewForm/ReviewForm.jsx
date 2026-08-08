import { useState } from "react";
import toast from "react-hot-toast";
import StarRating from "../StarRating/StarRating";
import "./ReviewForm.css";

function ReviewForm({ onSubmit, loading }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    if (comment.trim().length < 5) {
      toast.error("Review must be at least 5 characters.");
      return;
    }

    onSubmit({ rating, comment: comment.trim() });
  };

  const handleSuccess = () => {
    setRating(0);
    setComment("");
  };

  return (
    <form className="review-form" onSubmit={handleSubmit} noValidate>
      <h3 className="review-form__title">Write a Review</h3>

      <div className="review-form__stars">
        <label>Your Rating *</label>
        <StarRating
          interactive
          value={rating}
          onChange={(val) => setRating(val)}
          size={28}
        />
        {rating > 0 && (
          <span className="review-form__label">
            {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
          </span>
        )}
      </div>

      <div className="review-form__field">
        <label htmlFor="review-comment">Your Review *</label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          rows={4}
          maxLength={1000}
        />
        <span className="review-form__char">{comment.length}/1000</span>
      </div>

      <button
        type="submit"
        className="review-form__submit"
        disabled={loading || rating === 0}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}

export default ReviewForm;
