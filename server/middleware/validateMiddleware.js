import ApiError from '../utils/ApiError.js';

/**
 * Middleware wrapper for Zod validation schemas
 */
export const validate = (schema) => (req, res, next) => {
  try {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issues = result.error?.issues || result.error?.errors || [];
      const firstErrorMessage = issues[0]?.message || 'Validation Error';
      const formattedErrors = issues.map((err) => `${err.path ? err.path.join('.') : ''}: ${err.message}`);
      throw new ApiError(400, firstErrorMessage, formattedErrors);
    }
    req.body = result.data;
    next();
  } catch (error) {
    next(error);
  }
};
