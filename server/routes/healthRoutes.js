import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

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
  });
});

export default router;
