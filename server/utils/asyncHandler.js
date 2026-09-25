/**
 * Async handler wrapper to catch errors in Express route handlers and pass to next() middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

export default asyncHandler;
