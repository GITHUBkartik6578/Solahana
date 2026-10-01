import express from 'express';
import {
  getAllConsultations,
  updateConsultationStatus,
  deleteConsultation,
} from '../controllers/consultationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin, adminOnly } from '../middleware/adminMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { updateStatusSchema } from '../validations/consultationValidation.js';

const router = express.Router();

// Protect all admin routes
router.use(protect, admin);

router.get('/consultations', getAllConsultations);
router.patch('/consultations/:id/status', validate(updateStatusSchema), updateConsultationStatus);
router.delete('/consultations/:id', adminOnly, deleteConsultation);

export default router;
