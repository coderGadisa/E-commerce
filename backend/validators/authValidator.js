const { body } = require("express-validator");

// ─────────────────────────────────────────────────────────
// Shared strong-password rule — reused by register and
// the password-change endpoint.
//
// Rules:
//   - 8 to 72 characters  (72 = bcrypt truncation limit)
//   - at least 1 uppercase letter
//   - at least 1 lowercase letter
//   - at least 1 digit
//   - at least 1 special character
// ─────────────────────────────────────────────────────────
const strongPasswordRules = body("password")
  .isLength({ min: 8, max: 72 })
  .withMessage("Password must be between 8 and 72 characters")
  .matches(/[A-Z]/)
  .withMessage("Password must contain at least 1 uppercase letter")
  .matches(/[a-z]/)
  .withMessage("Password must contain at least 1 lowercase letter")
  .matches(/\d/)
  .withMessage("Password must contain at least 1 number")
  .matches(/[^A-Za-z0-9]/)
  .withMessage("Password must contain at least 1 special character");

// Same rules applied to newPassword field for profile password changes
const strongNewPasswordRules = body("newPassword")
  .optional()                           // only validated when present
  .isLength({ min: 8, max: 72 })
  .withMessage("New password must be between 8 and 72 characters")
  .matches(/[A-Z]/)
  .withMessage("New password must contain at least 1 uppercase letter")
  .matches(/[a-z]/)
  .withMessage("New password must contain at least 1 lowercase letter")
  .matches(/\d/)
  .withMessage("New password must contain at least 1 number")
  .matches(/[^A-Za-z0-9]/)
  .withMessage("New password must contain at least 1 special character");

const registerValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),

  strongPasswordRules,
];

const loginValidationRules = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

// Validator for PUT /api/users/profile password change
const profileUpdateValidationRules = [
  strongNewPasswordRules,
];

module.exports = {
  registerValidationRules,
  loginValidationRules,
  profileUpdateValidationRules,
  strongNewPasswordRules,
};
