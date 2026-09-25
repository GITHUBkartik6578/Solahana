import express from 'express';
import {
  saveCalculation,
  getMyCalculations,
  getCalculationById,
  deleteCalculation,
} from '../controllers/calculationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Require JWT authentication for all calculation endpoints
router.use(protect);

router.post('/save', saveCalculation);
router.get('/my', getMyCalculations);
router.get('/saved', getMyCalculations);
router.get('/:id', getCalculationById);
router.delete('/:id', deleteCalculation);

export default router;
