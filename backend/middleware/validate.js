const ApiError = require("../utils/ApiError");

// validate(["field1", "field2"]) returns an Express middleware
// that checks req.body for the presence of each required field.
const validate = (requiredFields) => {
  return (req, res, next) => {
    const missing = requiredFields.filter((field) => {
      const value = req.body[field];
      return value === undefined || value === null || String(value).trim() === "";
    });

    if (missing.length > 0) {
      return next(
        new ApiError(400, `Missing required fields: ${missing.join(", ")}`)
      );
    }
    next();
  };
};

module.exports = validate;
