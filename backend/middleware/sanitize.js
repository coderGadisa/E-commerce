// ─────────────────────────────────────────────────────────────────────────────
// NoSQL Injection + HTTP Parameter Pollution protection
// compatible with Express 5 + Node.js 24.
//
// WHY a custom implementation:
//   express-mongo-sanitize and hpp both do `req.query = sanitizedCopy` which
//   throws "Cannot set property query of #<IncomingMessage> which has only a
//   getter" in Express 5 — req.query is now a read-only getter derived from
//   req.url, not a plain writable property.
//
// This middleware mutates the CONTENTS of req.body and the individual
// properties of req.query (never the reference itself), which works in
// both Express 4 and Express 5.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Recursively removes MongoDB operator keys ($, .) from an object.
 * Returns a new sanitized object — does not mutate the input.
 */
const sanitizeValue = (value) => {
  if (value === null || value === undefined) return value;

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (typeof value === "object" && !(value instanceof Date)) {
    const cleaned = {};
    for (const [k, v] of Object.entries(value)) {
      // Drop keys starting with $ (MongoDB operators) or containing .
      if (typeof k === "string" && (k.startsWith("$") || k.includes("."))) {
        continue;
      }
      cleaned[k] = sanitizeValue(v);
    }
    return cleaned;
  }

  return value;
};

/**
 * Express 5 compatible middleware that:
 * 1. Sanitizes req.body (plain object — safe to reassign)
 * 2. Sanitizes req.params properties in-place
 * 3. Sanitizes individual req.query properties in-place
 *    (never reassigns req.query itself — Express 5 getter is read-only)
 * 4. Strips duplicate query parameters (HPP protection) by keeping
 *    only the last value when a key appears multiple times
 */
const sanitize = (req, res, next) => {
  // ── 1. Sanitize body ───────────────────────────────────────────
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeValue(req.body);
  }

  // ── 2. Sanitize params in-place ────────────────────────────────
  if (req.params && typeof req.params === "object") {
    for (const key of Object.keys(req.params)) {
      req.params[key] = sanitizeValue(req.params[key]);
    }
  }

  // ── 3. Sanitize query in-place + HPP deduplication ─────────────
  // Express 5: req.query is a getter — we can read it and mutate
  // individual properties, but cannot reassign the reference.
  if (req.query && typeof req.query === "object") {
    for (const key of Object.keys(req.query)) {
      let val = req.query[key];

      // HPP: if a query param appears multiple times, Express 5 makes
      // it an array — keep only the last value
      if (Array.isArray(val)) {
        val = val[val.length - 1];
      }

      // Sanitize MongoDB operators from query values
      req.query[key] = sanitizeValue(val);
    }
  }

  next();
};

module.exports = sanitize;
