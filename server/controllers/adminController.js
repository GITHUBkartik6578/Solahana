import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';
import Consultation from '../models/Consultation.js';

import Blog from '../models/Blog.js';
import Newsletter from '../models/Newsletter.js';
import escapeRegex from '../utils/escapeRegex.js';

/**
 * @desc    Get Admin Analytics Stats (counts)
 * @route   GET /api/admin/stats
 * @access  Private (Admin / Advisor Only)
 */
export const getAdminStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalConsultations,
    pendingConsultations,
    confirmedConsultations,
    completedConsultations,
    cancelledConsultations,
    totalBlogs,
    totalSubscribers,
  ] = await Promise.all([
    User.countDocuments().catch(() => 0),
    Consultation.countDocuments().catch(() => 0),
    Consultation.countDocuments({ status: 'Pending' }).catch(() => 0),
    Consultation.countDocuments({ status: 'Confirmed' }).catch(() => 0),
    Consultation.countDocuments({ status: 'Completed' }).catch(() => 0),
    Consultation.countDocuments({ status: 'Cancelled' }).catch(() => 0),
    Blog.countDocuments().catch(() => 0),
    Newsletter.countDocuments().catch(() => 0),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalUsers: totalUsers || 0,
        totalConsultations: totalConsultations || 0,
        pendingConsultations: pendingConsultations || 0,
        confirmedConsultations: confirmedConsultations || 0,
        completedConsultations: completedConsultations || 0,
        cancelledConsultations: cancelledConsultations || 0,
        totalBlogs: totalBlogs || 0,
        totalSubscribers: totalSubscribers || 0,
      },
      'Admin analytics stats retrieved successfully'
    )
  );
});

/**
 * @desc    Get all users for admin management with search & filter
 * @route   GET /api/admin/users
 * @access  Private (Admin / Advisor Only)
 */
export const getAllUsersAdmin = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const query = {};

  if (req.query.role && ['user', 'admin', 'advisor'].includes(req.query.role)) {
    query.role = req.query.role;
  }

  if (req.query.search && req.query.search.trim()) {
    const searchRegex = new RegExp(escapeRegex(req.query.search.trim()), 'i');
    query.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { phone: searchRegex },
      { city: searchRegex },
    ];
  }

  const totalUsers = await User.countDocuments(query).catch(() => 0);
  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users: users || [],
        pagination: {
          totalUsers: totalUsers || 0,
          totalPages: Math.ceil((totalUsers || 0) / limit) || 1,
          page,
          limit,
        },
      },
      'Users retrieved successfully'
    )
  );
});

/**
 * @desc    Update user role (user <-> admin)
 * @route   PATCH /api/admin/users/:id/role
 * @access  Private (Admin Only)
 */
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!role || !['user', 'admin', 'advisor'].includes(role)) {
    throw new ApiError(400, 'Invalid role. Allowed roles: user, admin, advisor.');
  }

  if (req.user._id.toString() === req.params.id) {
    throw new ApiError(400, 'You cannot change your own role.');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User account not found');
  }

  user.role = role;
  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      `User role updated to ${role} successfully`
    )
  );
});

/**
 * @desc    Delete user account
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin Only)
 */
export const deleteUserAdmin = asyncHandler(async (req, res) => {
  if (req.user._id.toString() === req.params.id) {
    throw new ApiError(400, 'You cannot delete your own admin account.');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User account not found');
  }

  await user.deleteOne();

  return res.status(200).json(new ApiResponse(200, {}, 'User deleted successfully'));
});
