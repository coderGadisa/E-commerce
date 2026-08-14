const { body } = require("express-validator");

const registerValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .isLength({ min: 6, max: 72 })
    .withMessage("Password must be between 6 and 72 characters"),
];

const loginValidationRules = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

module.exports = {
  registerValidationRules,
  loginValidationRules,
};