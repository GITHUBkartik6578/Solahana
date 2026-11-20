import express from 'express';
import { submitHealthCheck, getHealthChecks, startHealthCheck } from '../controllers/healthCheckController.js';
import { validate } from '../middleware/validateMiddleware.js';
import { submitHealthCheckSchema, startHealthCheckSchema } from '../validations/healthCheckValidation.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public: a visitor who has seen their result asks for a callback (one call: contact details + consent + score summary)
router.post('/', validate(submitHealthCheckSchema), submitHealthCheck);

// Public: someone starting the Financial Health Check-up leaves name, mobile, email and consent (no answers, no amounts)
router.post('/start', validate(startHealthCheckSchema), startHealthCheck);

// Admin: see who asked for a callback (older 6-question rows are listed too)
router.get('/', protect, admin, getHealthChecks);

export default router;
