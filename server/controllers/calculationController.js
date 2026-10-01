import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import SavedCalculation from '../models/SavedCalculation.js';
import escapeRegex from '../utils/escapeRegex.js';

// Normalizer helper for calculatorType enum
const normalizeCalculatorType = (type) => {
  if (!type) return 'SIP';
  const t = String(type).trim().toUpperCase();
  const typeMap = {
    'SIP': 'SIP',
    'EMI': 'EMI',
    'RETIREMENT': 'RETIREMENT',
    'GOAL': 'GOAL_PLANNER',
    'GOAL_PLANNER': 'GOAL_PLANNER',
    'GOAL-PLANNER': 'GOAL_PLANNER',
    'LUMPSUM': 'LUMPSUM',
    'FD': 'FD',
    'INFLATION': 'INFLATION',
  };
  return typeMap[t] || t;
};

/**
 * @desc    Save a financial calculation
 * @route   POST /api/calculations/save or /api/calculators/save
 * @access  Private
 */
export const saveCalculation = asyncHandler(async (req, res) => {
  const { calculatorType, calculationName, title, inputs, results } = req.body;

  if (!calculatorType || !inputs || !results) {
    throw new ApiError(400, 'Please provide calculatorType, inputs, and results');
  }

  const nameToSave = calculationName || title || `${calculatorType} Wealth Plan`;
  const normalizedType = normalizeCalculatorType(calculatorType);

  const newCalculation = await SavedCalculation.create({
    user: req.user._id,
    calculatorType: normalizedType,
    calculationName: nameToSave,
    inputs,
    results,
  });

  res.status(201).json(
    new ApiResponse(201, newCalculation, 'Calculation saved successfully')
  );
});

/**
 * @desc    Get current user's saved calculations with optional search, filter & sorting
 * @route   GET /api/calculations/my or /api/calculators/saved
 * @access  Private
 */
export const getMyCalculations = asyncHandler(async (req, res) => {
  const { type, calculatorType, search, sort } = req.query;

  const query = { user: req.user._id };

  // Filter by Calculator Type
  const filterType = type || calculatorType;
  if (filterType && filterType !== 'ALL') {
    query.calculatorType = normalizeCalculatorType(filterType);
  }

  // Search by calculation name
  if (search && search.trim() !== '') {
    query.calculationName = { $regex: escapeRegex(search.trim()), $options: 'i' };
  }

  // Sorting: newest (default) vs oldest
  let sortOption = { createdAt: -1 };
  if (sort === 'oldest' || sort === 'asc') {
    sortOption = { createdAt: 1 };
  }

  const calculations = await SavedCalculation.find(query).sort(sortOption);

  res.status(200).json(
    new ApiResponse(
      200,
      { count: calculations.length, data: calculations, calculations },
      'Saved calculations retrieved successfully'
    )
  );
});

/**
 * @desc    Get single calculation details by ID
 * @route   GET /api/calculations/:id
 * @access  Private
 */
export const getCalculationById = asyncHandler(async (req, res) => {
  const calculation = await SavedCalculation.findById(req.params.id);

  if (!calculation) {
    throw new ApiError(404, 'Saved calculation not found');
  }

  // SECURITY: Only the owner can view
  if (calculation.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Access denied. You can view only your own calculations.');
  }

  res.status(200).json(
    new ApiResponse(200, calculation, 'Calculation details retrieved successfully')
  );
});

/**
 * @desc    Delete a saved calculation
 * @route   DELETE /api/calculations/:id
 * @access  Private
 */
export const deleteCalculation = asyncHandler(async (req, res) => {
  const calculation = await SavedCalculation.findById(req.params.id);

  if (!calculation) {
    throw new ApiError(404, 'Saved calculation not found');
  }

  // SECURITY: Only the owner can delete
  if (calculation.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Access denied. You can delete only your own calculations.');
  }

  await SavedCalculation.deleteOne({ _id: req.params.id });

  res.status(200).json(
    new ApiResponse(200, { id: req.params.id }, 'Calculation deleted successfully')
  );
});
