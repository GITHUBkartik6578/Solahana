import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';
import generateToken, { authCookieOptions } from '../utils/generateToken.js';

/**
 * @desc    Register a new user & return authenticated session
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, password, phone, city } = req.body;
  const email = String(req.body.email).toLowerCase().trim();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'An account with this email address already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    phone: phone || '',
    city: city || '',
    lastLogin: new Date(),
  });

  const token = generateToken(res, user._id, user.role);

  const responseUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    city: user.city,
    role: user.role,
    avatar: user.avatar,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };

  res.status(201).json(
    new ApiResponse(
      201,
      { user: responseUser, token },
      'Account created and authenticated successfully'
    )
  );
});

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { password, isAdminLogin } = req.body;
  const email = String(req.body.email).toLowerCase().trim();

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Check the password BEFORE revealing account state, so the "deactivated" message can't be used
  // to discover which emails have accounts.
  const isPasswordMatched = await user.matchPassword(password);
  if (!isPasswordMatched) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (user.isActive === false) {
    throw new ApiError(403, 'Your account has been deactivated. Please contact support.');
  }

  // SECURITY ENFORCEMENT: Separate User and Admin Logins
  const isExplicitAdminLogin = isAdminLogin === true || isAdminLogin === 'true';

  if (isExplicitAdminLogin) {
    // Admin login context (/admin/login)
    if (user.role !== 'admin' && user.role !== 'advisor') {
      throw new ApiError(403, 'Access denied. Administrator account required.');
    }
  } else {
    // Normal user login context (/login or AuthModal)
    if (user.role === 'admin' || user.role === 'advisor') {
      throw new ApiError(403, 'Administrator accounts must sign in from the Admin Portal.');
    }
  }

  // Update last login timestamp
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = generateToken(res, user._id, user.role);

  const responseUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    city: user.city,
    role: user.role,
    avatar: user.avatar,
    isVerified: user.isVerified,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
  };

  res.status(200).json(
    new ApiResponse(
      200,
      { user: responseUser, token },
      'Logged in successfully'
    )
  );
});

/**
 * @desc    Logout user & clear cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logoutUser = asyncHandler(async (req, res) => {
  // Must use the same attributes the cookie was set with (SameSite=None; Secure in production),
  // otherwise browsers ignore the clearing header and the user stays signed in via the cookie.
  res.clearCookie('jwt', authCookieOptions());

  res.status(200).json(new ApiResponse(200, {}, 'Logged out successfully'));
});

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req.user, 'Current user session retrieved'));
});

/**
 * @desc    Update user profile
 * @route   PATCH /api/auth/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    throw new ApiError(404, 'User account not found');
  }

  if (req.body.name) user.name = req.body.name;
  if (req.body.phone !== undefined) user.phone = req.body.phone;
  if (req.body.city !== undefined) user.city = req.body.city;
  if (req.body.avatar !== undefined) user.avatar = req.body.avatar;
  if (req.body.password && req.body.password.trim().length >= 8) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  const responseUser = {
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    city: updatedUser.city,
    role: updatedUser.role,
    avatar: updatedUser.avatar,
    isVerified: updatedUser.isVerified,
    updatedAt: updatedUser.updatedAt,
  };

  res.status(200).json(new ApiResponse(200, responseUser, 'Profile updated successfully'));
});
