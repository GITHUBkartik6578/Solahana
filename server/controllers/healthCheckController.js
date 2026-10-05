import crypto from 'crypto';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import HealthCheckLead from '../models/HealthCheckLead.js';
import escapeRegex from '../utils/escapeRegex.js';

const verdictFor = (pct) => (pct >= 80 ? 'Good shape' : pct >= 50 ? 'Solid start, with gaps' : 'Needs attention');

/**
 * @desc    Save the visitor's name + phone and open a health-check attempt
 * @route   POST /api/health-check
 * @access  Public
 */
export const startHealthCheck = asyncHandler(async (req, res) => {
  const { fullName, phone, source } = req.body;
  const completionToken = crypto.randomBytes(24).toString('hex');

  const lead = await HealthCheckLead.create({
    fullName,
    phone,
    source: source || 'home_health_check',
    completionToken,
  });

  res.status(201).json(new ApiResponse(201, { id: lead._id, token: completionToken }, 'Health check started'));
});

/**
 * @desc    Attach the answers and the score to an attempt
 * @route   PATCH /api/health-check/:id/complete
 * @access  Public (needs the token returned by the start call)
 */
export const completeHealthCheck = asyncHandler(async (req, res) => {
  const { token, answers } = req.body;

  const lead = await HealthCheckLead.findById(req.params.id).select('+completionToken');
  const tokenOk =
    lead &&
    lead.completionToken.length === token.length &&
    crypto.timingSafeEqual(Buffer.from(lead.completionToken), Buffer.from(token));
  if (!tokenOk) {
    throw new ApiError(404, 'Health check not found');
  }

  const score = answers.reduce((sum, a) => sum + a.score, 0);
  const maxScore = answers.length * 2;
  const percent = Math.round((score / maxScore) * 100);

  lead.answers = answers;
  lead.score = score;
  lead.maxScore = maxScore;
  lead.percent = percent;
  lead.verdict = verdictFor(percent);
  lead.status = 'completed';
  lead.completedAt = new Date();
  await lead.save();

  res
    .status(200)
    .json(new ApiResponse(200, { id: lead._id, score, maxScore, percent, verdict: lead.verdict }, 'Health check saved'));
});

/**
 * @desc    List health-check entries
 * @route   GET /api/health-check
 * @access  Private/Admin
 */
export const getHealthChecks = asyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 20 } = req.query;

  const query = {};
  if (status) query.status = String(status);
  if (search) {
    const rx = { $regex: escapeRegex(String(search)), $options: 'i' };
    query.$or = [{ fullName: rx }, { phone: rx }];
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

  const total = await HealthCheckLead.countDocuments(query);
  const entries = await HealthCheckLead.find(query)
    .sort({ createdAt: -1 })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  res
    .status(200)
    .json(new ApiResponse(200, { total, totalPages: Math.ceil(total / limitNum) || 1, currentPage: pageNum, entries }, 'Health check entries retrieved'));
});
