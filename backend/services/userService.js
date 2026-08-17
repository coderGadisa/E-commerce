const User = require("../models/User");
const ApiError = require("../utils/ApiError");

const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select("-password").populate("wishlist", "name image price category");
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

const updateUserProfile = async (userId, updates) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  // Explicitly block role changes via this endpoint —
  // role management is admin-only via PUT /api/admin/users/:id/role
  if (updates.role !== undefined) {
    throw new ApiError(403, "Role cannot be changed via profile update");
  }

  if (updates.name) user.name = updates.name;
  if (updates.email) user.email = updates.email;
  if (updates.address) {
    const current = user.address ? user.address.toObject?.() ?? user.address : {};
    user.address = { ...current, ...updates.address };
  }
  if (updates.avatar) user.avatar = updates.avatar;

  // Password change
  if (updates.newPassword) {
    if (!updates.currentPassword) {
      throw new ApiError(400, "Current password is required");
    }
    const isMatch = await user.matchPassword(updates.currentPassword);
    if (!isMatch) throw new ApiError(401, "Current password is incorrect");
    user.password = updates.newPassword;
  }

  await user.save();

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    address: user.address,
    avatar: user.avatar,
    wishlist: user.wishlist,
  };
};
const getWishlist = async (userId) => {
  const user = await User.findById(userId)
    .select("wishlist")
    .populate("wishlist", "name image price category");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user.wishlist;
};
const addToWishlist = async (userId, productId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  if (user.wishlist.includes(productId)) {
    throw new ApiError(409, "Product already in wishlist");
  }

  user.wishlist.push(productId);
  await user.save();
  return user.wishlist;
};

const removeFromWishlist = async (userId, productId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  user.wishlist = user.wishlist.filter(
    (id) => id.toString() !== productId
  );
  await user.save();
  return user.wishlist;
};

const getAllUsers = async () => {
  return await User.find().select("-password").sort({ createdAt: -1 });
};

const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) throw new ApiError(404, "User not found");
  return { message: "User deleted" };
};

/**
 * Change a user's role. Protected by:
 *  - last-admin guard: if target is admin and they're the only one → block
 *  - valid role values only: "customer" | "admin"
 */
const changeUserRole = async (targetUserId, newRole, requestingAdminId) => {
  const VALID_ROLES = ["customer", "admin"];
  if (!VALID_ROLES.includes(newRole)) {
    throw new ApiError(400, `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}`);
  }

  const target = await User.findById(targetUserId);
  if (!target) throw new ApiError(404, "User not found");

  // Last-admin protection: block removing the only admin
  if (target.role === "admin" && newRole !== "admin") {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      throw new ApiError(400, "Cannot remove the last administrator");
    }
  }

  target.role = newRole;
  await target.save();

  return {
    _id: target._id,
    name: target.name,
    email: target.email,
    role: target.role,
  };
};
const uploadAvatar = async (userId, filename) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.profileImage = `uploads/${filename}`;

  await user.save();

  return user;
};
module.exports = {
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getAllUsers,
  deleteUser,
  changeUserRole,
};
