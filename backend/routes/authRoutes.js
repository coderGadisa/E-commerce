const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const { register, login } = require("../controllers/authController");
const {
    registerValidationRules,
    loginValidationRules,
} = require("../validators/authValidator");
const ApiError = require("../utils/ApiError");

// Middleware that runs after express-validator rules and returns
// a structured 400 if any rule failed.
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const messages = errors.array().map((e) => e.msg).join(", ");
        return next(new ApiError(400, messages));
    }
    next();
};

// register: validate email format, password length (6–72 chars), name presence
router.post(
    "/register",
    registerValidationRules,
    handleValidation,
    register
);

// login: validate email format, password presence
router.post(
    "/login",
    loginValidationRules,
    handleValidation,
    login
);

module.exports = router;
