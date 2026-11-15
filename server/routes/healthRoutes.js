import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Version of the Financial Health Check-up callback API (POST /api/health-check with a consent record and a score summary).
// The website only sends a callback request to a server that reports this exact number, so a page that is newer than the
// server it talks to (during a rollout) never submits to a server that would drop the consent record. Raise it, together
// with the same number in src/services/healthCheckService.js, whenever that API changes in an incompatible way.
const HEALTH_CHECK_CALLBACK_API = 2;

/**
 * @route   GET /api/health
 * @desc    Health Check Endpoint
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'SOLAHANA Financial Planning Backend Engine',
    // 0 disconnected, 1 connected, 2 connecting, 3 disconnecting
    database: mongoose.connection.readyState === 1 ? 'connected' : 'not connected',
    healthCheckCallback: HEALTH_CHECK_CALLBACK_API,
  });
});

export default router;
