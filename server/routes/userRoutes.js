import express from 'express';
import { getUsers, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', protect, admin, getUsers);
router.put('/profile', protect, updateUserProfile);

export default router;
