// Base URL for the backend server (used for image src paths)
// strips /api from the end of VITE_API_URL
export const BACKEND_URL = import.meta.env.VITE_API_URL?.replace("/api", "") ?? "http://localhost:5000";

// Helper: resolve a product image path to a full URL
export function getImageSrc(image) {
  if (!image) return "https://placehold.co/400x320?text=No+Image";
  if (image.startsWith("http")) return image;
  return `${BACKEND_URL}/${image}`;
}
