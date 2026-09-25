import express from 'express';
import {
  subscribeNewsletter,
  getNewsletterSubscribers,
  deleteSubscriber,
} from '../controllers/newsletterController.js';
import { validate } from '../middleware/validateMiddleware.js';
import { validateNewsletter } from '../validations/newsletterValidation.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public subscription endpoint
router.post('/subscribe', validate(validateNewsletter), subscribeNewsletter);
router.post('/', validate(validateNewsletter), subscribeNewsletter);

// Admin Protected Routes
router.get('/', protect, admin, getNewsletterSubscribers);
router.delete('/:id', protect, admin, deleteSubscriber);

export default router;
