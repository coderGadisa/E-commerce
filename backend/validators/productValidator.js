const { body } = require("express-validator");

const productValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),

  body("image")
    .trim()
    .notEmpty()
    .withMessage("Image is required"),

  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than 0"),

  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock cannot be negative"),
];

module.exports = productValidationRules;