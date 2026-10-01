import express from 'express';
import {
  bookConsultation,
  getMyConsultations,
  cancelConsultation,
} from '../controllers/consultationController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { bookConsultationSchema } from '../validations/consultationValidation.js';

const router = express.Router();

// User Consultation Routes
router.post('/', optionalAuth, validate(bookConsultationSchema), bookConsultation);
router.get('/my', protect, getMyConsultations);
router.patch('/:id/cancel', protect, cancelConsultation);

export default router;

