const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const validate = require("../middleware/validate");

// validate(["field"]) returns middleware — called correctly here
router.post("/register", validate(["name", "email", "password"]), register);
router.post("/login",    validate(["email", "password"]),           login);

module.exports = router;
