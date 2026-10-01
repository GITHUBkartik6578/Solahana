import jwt from 'jsonwebtoken';

const isProduction = () => process.env.NODE_ENV === 'production';

/**
 * Single source of truth for the JWT signing secret.
 * In production a missing JWT_SECRET is a hard error: falling back to a value that lives in the
 * repository would let anyone forge admin tokens.
 */
export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  if (isProduction()) {
    throw new Error('JWT_SECRET environment variable is required in production.');
  }
  return 'solahana_dev_only_secret_do_not_use_in_production';
};

/**
 * Cookie attributes for the auth cookie. Used both when setting AND clearing it: a cookie set with
 * SameSite=None; Secure (cross-site Vercel -> Render setup) can only be overwritten/cleared by a
 * Set-Cookie carrying the same attributes.
 */
export const authCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction(),
  sameSite: isProduction() ? 'none' : 'lax',
});

/**
 * Generate JWT Token & configure secure HTTP-Only Cookie
 */
const generateToken = (res, userId, role = 'user') => {
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  const token = jwt.sign({ id: userId, role }, getJwtSecret(), {
    expiresIn,
  });

  const cookieDays = parseInt(process.env.JWT_COOKIE_EXPIRES_IN || '7', 10);

  if (res) {
    res.cookie('jwt', token, {
      ...authCookieOptions(),
      maxAge: cookieDays * 24 * 60 * 60 * 1000,
    });
  }

  return token;
};

export default generateToken;
