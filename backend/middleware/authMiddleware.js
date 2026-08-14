const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Pin algorithm to HS256 — prevents "none" algorithm attacks
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    // Always load user from DB so revoked/deleted accounts are caught
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    next();
  } catch {
    // Never expose the underlying JWT error message to the client —
    // it reveals whether the token was malformed, expired, or had
    // an invalid signature, which helps attackers narrow down attacks.
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = { protect };
