const multer = require("multer");
const ApiError = require("../utils/ApiError");

// Memory storage — files are streamed directly to Cloudinary.
// Nothing is written to the local filesystem.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    // Return an ApiError so errorHandler returns 400 (not 500)
    cb(new ApiError(400, "Only image files are allowed"), false);
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});
