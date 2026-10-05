import express from 'express';
import { startHealthCheck, completeHealthCheck, getHealthChecks } from '../controllers/healthCheckController.js';
import { validate } from '../middleware/validateMiddleware.js';
import { startHealthCheckSchema, completeHealthCheckSchema } from '../validations/healthCheckValidation.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public: the visitor starts a check (name + phone), then sends the answers when finished
router.post('/', validate(startHealthCheckSchema), startHealthCheck);
router.patch('/:id/complete', validate(completeHealthCheckSchema), completeHealthCheck);

// Admin: see who took the check
router.get('/', protect, admin, getHealthChecks);

export default router;
