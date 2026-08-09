const multer = require("multer");

// Use memory storage — files are held in req.file.buffer
// and uploaded directly to Cloudinary in the controller.
// Nothing is written to the local filesystem.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});
