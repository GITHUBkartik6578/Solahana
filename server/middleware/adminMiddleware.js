import ApiError from '../utils/ApiError.js';

export const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'advisor')) {
    next();
  } else {
    throw new ApiError(403, 'Access denied. Admin or Advisor permission required');
  }
};

/**
 * Strictly admin-only (advisors excluded). Used for destructive / privilege-changing actions:
 * changing roles, deleting users and deleting consultations.
 */
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    throw new ApiError(403, 'Access denied. Administrator permission required');
  }
};
