import crypto from 'crypto';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import HealthCheckLead from '../models/HealthCheckLead.js';
import escapeRegex from '../utils/escapeRegex.js';
import { CONSENT_TEXTS, RETENTION_MONTHS } from '../../src/utils/financialHealthCheck.js';

/** `date` plus whole calendar months in UTC, keeping the day of the month (clamped to the last day of a shorter month). */
export const addMonthsUtc = (date, months) => {
  const result = new Date(date.getTime());
  const day = result.getUTCDate();
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate();
  result.setUTCDate(Math.min(day, lastDay));
  return result;
};

export const hashConsentText = (version) => crypto.createHash('sha256').update(CONSENT_TEXTS[version]).digest('hex');

/**
 * Turns a validated callback request into the document that is stored. The consent time and the deletion date are set
 * here, on the server, never taken from the client, and the consent record carries a hash of the exact wording that the
 * allowed text version stands for. Nothing but the fields below is copied from the request.
 */
export const buildLeadDocument = (body, now = new Date()) => ({
  fullName: body.fullName,
  phone: body.phone,
  source: body.source || 'financial_health_checkup',
  status: 'completed',
  schemaVersion: 2,
  completedAt: now,
  consent: {
    callback: true,
    textVersion: body.consent.textVersion,
    textHash: hashConsentText(body.consent.textVersion),
    acceptedAt: now,
  },
  result: {
    scoringVersion: body.result.scoringVersion,
    shieldingApplicable: body.result.shieldingApplicable,
    emergencyMeasurable: body.result.emergencyMeasurable,
    points: {
      emi: body.result.points.emi,
      term: body.result.points.term,
      emergency: body.result.points.emergency,
      investment: body.result.points.investment,
      health: body.result.points.health,
      overlap: body.result.points.overlap,
      shielding: body.result.points.shielding,
    },
    earned: body.result.earned,
    applicable: body.result.applicable,
    score: body.result.score,
    band: body.result.band,
  },
  deleteAfter: addMonthsUtc(now, RETENTION_MONTHS),
});

/**
 * @desc    Save a callback request made after a Financial Health Check-up (contact details, explicit consent, score summary)
 * @route   POST /api/health-check
 * @access  Public
 */
export const submitHealthCheck = asyncHandler(async (req, res) => {
  const lead = await HealthCheckLead.create(buildLeadDocument(req.body));
  res.status(201).json(new ApiResponse(201, { id: lead._id }, 'Callback request received'));
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
  // The consent hash is an internal integrity value: it stays in the database but is never sent to the admin dashboard.
  const entries = await HealthCheckLead.find(query)
    .select({ 'consent.textHash': 0 })
    .sort({ createdAt: -1 })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  res
    .status(200)
    .json(new ApiResponse(200, { total, totalPages: Math.ceil(total / limitNum) || 1, currentPage: pageNum, entries }, 'Health check entries retrieved'));
});
