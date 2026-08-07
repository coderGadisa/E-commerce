import api from "./api";

// Get wishlist
export const getWishlist = async () => {
  const response = await api.get("/users/wishlist");
  return response.data;
};

// Add product
export const addToWishlist = async (productId) => {
  const response = await api.post(`/users/wishlist/${productId}`);
  return response.data;
};

// Remove product
export const removeFromWishlist = async (productId) => {
  const response = await api.delete(`/users/wishlist/${productId}`);
  return response.data;
};