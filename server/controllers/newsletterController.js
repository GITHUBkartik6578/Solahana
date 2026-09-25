import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import Newsletter from '../models/Newsletter.js';
import escapeRegex from '../utils/escapeRegex.js';

/**
 * @desc    Subscribe to newsletter
 * @route   POST /api/newsletter/subscribe or POST /api/newsletters
 * @access  Public
 */
export const subscribeNewsletter = asyncHandler(async (req, res) => {
  const { email, source } = req.body;

  if (!email) {
    throw new ApiError(400, 'Email address is required');
  }

  const existing = await Newsletter.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    if (existing.status === 'subscribed') {
      return res.status(200).json(new ApiResponse(200, existing, 'Email is already subscribed to SOLAHANA Insights'));
    }
    existing.status = 'subscribed';
    await existing.save();
    return res.status(200).json(new ApiResponse(200, existing, 'Resubscribed to SOLAHANA Insights successfully'));
  }

  const subscription = await Newsletter.create({
    email: email.toLowerCase().trim(),
    source: source || 'website_footer',
  });

  res.status(201).json(new ApiResponse(201, subscription, 'Subscribed to SOLAHANA Insights successfully'));
});

/**
 * @desc    Get all newsletter subscribers
 * @route   GET /api/newsletters or GET /api/admin/newsletters
 * @access  Private/Admin
 */
export const getNewsletterSubscribers = asyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 10 } = req.query;

  const query = {};
  if (status) {
    query.status = status;
  }
  if (search) {
    query.email = { $regex: escapeRegex(search), $options: 'i' };
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  const skip = (pageNum - 1) * limitNum;

  const totalSubscribers = await Newsletter.countDocuments(query);
  const subscribers = await Newsletter.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        count: subscribers.length,
        totalSubscribers,
        totalPages: Math.ceil(totalSubscribers / limitNum) || 1,
        currentPage: pageNum,
        subscribers,
      },
      'Newsletter subscribers retrieved successfully'
    )
  );
});

/**
 * @desc    Delete subscriber
 * @route   DELETE /api/newsletters/:id or DELETE /api/admin/newsletters/:id
 * @access  Private/Admin
 */
export const deleteSubscriber = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const subscriber = await Newsletter.findById(id);
  if (!subscriber) {
    throw new ApiError(404, 'Subscriber not found');
  }

  await subscriber.deleteOne();

  res.status(200).json(new ApiResponse(200, null, 'Subscriber removed successfully'));
});
