import express from 'express';
import { submitHealthCheck, getHealthChecks } from '../controllers/healthCheckController.js';
import { validate } from '../middleware/validateMiddleware.js';
import { submitHealthCheckSchema } from '../validations/healthCheckValidation.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public: a visitor who has seen their result asks for a callback (one call: contact details + consent + score summary)
router.post('/', validate(submitHealthCheckSchema), submitHealthCheck);

// Admin: see who asked for a callback (older 6-question rows are listed too)
router.get('/', protect, admin, getHealthChecks);

export default router;
