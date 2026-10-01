import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import SavedCalculation from '../models/SavedCalculation.js';

/**
 * @desc    Save a calculation result
 * @route   POST /api/calculators/save
 * @access  Public / Private
 */
export const saveCalculation = asyncHandler(async (req, res) => {
  const { calculatorType, title, inputs, results, sessionId } = req.body;

  if (!calculatorType || !inputs || !results) {
    throw new ApiError(400, 'Please provide calculatorType, inputs, and results');
  }

  const saved = await SavedCalculation.create({
    user: req.user ? req.user._id : undefined,
    calculatorType,
    title: title || `${calculatorType.toUpperCase()} Calculation`,
    inputs,
    results,
    sessionId: sessionId || '',
  });

  res.status(201).json(new ApiResponse(201, saved, 'Calculation saved successfully'));
});

/**
 * @desc    Get user saved calculations
 * @route   GET /api/calculators/saved
 * @access  Private
 */
export const getSavedCalculations = asyncHandler(async (req, res) => {
  const calculations = await SavedCalculation.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, { count: calculations.length, calculations }, 'Saved calculations retrieved'));
});
