import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import Consultation from '../models/Consultation.js';
import escapeRegex from '../utils/escapeRegex.js';
import {
  sendConsultationBookedEmail,
  sendNewLeadAlertEmail,
  sendConsultationConfirmedEmail,
  sendConsultationCancelledEmail,
} from '../services/emailService.js';

/**
 * @desc    Book a new consultation
 * @route   POST /api/consultations
 * @access  Private (Authenticated Users)
 */
export const bookConsultation = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    phone,
    city,
    goal,
    consultationMode,
    preferredDate,
    preferredTime,
    message,
  } = req.body;

  const userId = req.user ? req.user._id : null;

  const consultation = await Consultation.create({
    user: userId,
    fullName: fullName || (req.user ? req.user.name : 'Valued Client'),
    email: email || (req.user ? req.user.email : ''),
    phone: phone || (req.user ? req.user.phone : ''),
    city: city || (req.user ? req.user.city : ''),
    goal: goal || 'Financial Planning',
    consultationMode: consultationMode || 'Phone Call',
    preferredDate: preferredDate ? new Date(preferredDate) : new Date(),
    preferredTime: preferredTime || 'Morning (9 AM - 12 PM)',
    message: message || '',
    status: 'Pending',
  });

  // Asynchronously dispatch emails without blocking the request:
  // 1) confirmation to the client, 2) new-lead alert to the advisor.
  sendConsultationBookedEmail(consultation).catch((err) =>
    console.error('[Email Notification Error]:', err.message)
  );
  sendNewLeadAlertEmail(consultation).catch((err) =>
    console.error('[Advisor Lead Alert Error]:', err.message)
  );

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        consultation,
        'Consultation booked successfully. Our advisory team will confirm your session shortly.'
      )
    );
});


/**
 * @desc    Get logged-in user's consultations
 * @route   GET /api/consultations/my
 * @access  Private (Authenticated Users)
 */
export const getMyConsultations = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(200).json(
      new ApiResponse(200, [], 'Consultations fetched successfully')
    );
  }

  const query = { user: req.user._id };

  if (req.query.status && ['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(req.query.status)) {
    query.status = req.query.status;
  }

  const rawConsultations = await Consultation.find(query)
    .sort({ createdAt: -1 })
    .lean();

  const consultations = Array.isArray(rawConsultations) ? rawConsultations : [];

  return res.status(200).json(
    new ApiResponse(200, consultations, 'Consultations fetched successfully')
  );
});

/**
 * @desc    Cancel a pending consultation
 * @route   PATCH /api/consultations/:id/cancel
 * @access  Private (Authenticated User - Owner or Admin)
 */
export const cancelConsultation = asyncHandler(async (req, res) => {
  const consultation = await Consultation.findById(req.params.id);

  if (!consultation) {
    throw new ApiError(404, 'Consultation booking not found');
  }

  // Ensure ownership unless admin/advisor
  const isOwner = consultation.user && consultation.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin' || req.user.role === 'advisor';

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'You are not authorized to cancel this booking');
  }

  if (consultation.status !== 'Pending') {
    throw new ApiError(
      400,
      `Cannot cancel consultation with status "${consultation.status}". Only Pending bookings can be cancelled.`
    );
  }

  consultation.status = 'Cancelled';
  await consultation.save();

  sendConsultationCancelledEmail(consultation).catch((err) =>
    console.error('[Email Notification Error]:', err.message)
  );

  return res
    .status(200)
    .json(new ApiResponse(200, consultation, 'Consultation cancelled successfully'));
});

/**
 * @desc    Get all consultations with search, filters & pagination
 * @route   GET /api/admin/consultations
 * @access  Private (Admin / Advisor Only)
 */
export const getAllConsultations = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const query = {};

  // Filters
  if (req.query.status && ['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(req.query.status)) {
    query.status = req.query.status;
  }
  if (req.query.goal) {
    query.goal = req.query.goal;
  }
  if (req.query.consultationMode) {
    query.consultationMode = req.query.consultationMode;
  }
  if (req.query.city) {
    query.city = { $regex: escapeRegex(req.query.city), $options: 'i' };
  }
  if (req.query.date) {
    const searchDate = new Date(req.query.date);
    if (!isNaN(searchDate.getTime())) {
      const nextDate = new Date(searchDate);
      nextDate.setDate(nextDate.getDate() + 1);
      query.preferredDate = { $gte: searchDate, $lt: nextDate };
    }
  }

  // Search by keyword across name, email, phone, city, goal
  if (req.query.search && req.query.search.trim()) {
    const searchRegex = new RegExp(escapeRegex(req.query.search.trim()), 'i');
    query.$or = [
      { fullName: searchRegex },
      { email: searchRegex },
      { phone: searchRegex },
      { city: searchRegex },
      { goal: searchRegex },
    ];
  }

  const totalBookings = await Consultation.countDocuments(query).catch(() => 0);
  const rawConsultations = await Consultation.find(query)
    .populate('user', 'name email phone avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const consultations = Array.isArray(rawConsultations) ? rawConsultations : [];

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        consultations,
        pagination: {
          totalBookings: totalBookings || 0,
          totalPages: Math.ceil((totalBookings || 0) / limit) || 1,
          page,
          limit,
        },
      },
      'All consultations fetched successfully'
    )
  );
});

/**
 * @desc    Update consultation status, meeting link & admin notes
 * @route   PATCH /api/admin/consultations/:id/status
 * @access  Private (Admin / Advisor Only)
 */
export const updateConsultationStatus = asyncHandler(async (req, res) => {
  const { status, meetingLink, notes } = req.body;

  const consultation = await Consultation.findById(req.params.id);

  if (!consultation) {
    throw new ApiError(404, 'Consultation booking not found');
  }

  const prevStatus = consultation.status;

  if (status && ['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
    consultation.status = status;
  }
  if (meetingLink !== undefined) consultation.meetingLink = meetingLink;
  if (notes !== undefined) consultation.notes = notes;

  await consultation.save();

  // Send status update emails
  if (status === 'Confirmed' && prevStatus !== 'Confirmed') {
    sendConsultationConfirmedEmail(consultation).catch((err) =>
      console.error('[Email Notification Error]:', err.message)
    );
  } else if (status === 'Cancelled' && prevStatus !== 'Cancelled') {
    sendConsultationCancelledEmail(consultation).catch((err) =>
      console.error('[Email Notification Error]:', err.message)
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, consultation, 'Consultation updated successfully'));
});

/**
 * @desc    Delete a consultation booking
 * @route   DELETE /api/admin/consultations/:id
 * @access  Private (Admin Only)
 */
export const deleteConsultation = asyncHandler(async (req, res) => {
  const consultation = await Consultation.findById(req.params.id);

  if (!consultation) {
    throw new ApiError(404, 'Consultation booking not found');
  }

  await consultation.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Consultation deleted successfully'));
});
