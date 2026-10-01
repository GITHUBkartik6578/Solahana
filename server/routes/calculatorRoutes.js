import express from 'express';
import { saveCalculation, getSavedCalculations } from '../controllers/calculatorController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/save', saveCalculation);
router.get('/saved', protect, getSavedCalculations);

export default router;
