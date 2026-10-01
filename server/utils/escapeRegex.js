/**
 * Escapes user-supplied text so it can be used safely inside a MongoDB $regex / RegExp.
 * Without this, searching for "(" or "+91 (" throws (HTTP 500) and crafted patterns can be used
 * to make the database burn CPU (ReDoS).
 */
const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export default escapeRegex;
