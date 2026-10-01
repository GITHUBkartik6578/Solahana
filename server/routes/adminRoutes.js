import express from 'express';
import {
  getAllConsultations,
  updateConsultationStatus,
  deleteConsultation,
} from '../controllers/consultationController.js';
import {
  getAdminStats,
  getAllUsersAdmin,
  updateUserRole,
  deleteUserAdmin,
} from '../controllers/adminController.js';
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController.js';
import {
  getNewsletterSubscribers,
  deleteSubscriber,
} from '../controllers/newsletterController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin, adminOnly } from '../middleware/adminMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { updateStatusSchema } from '../validations/consultationValidation.js';

const router = express.Router();

// All routes here require authentication & Admin/Advisor role
router.use(protect, admin);

// Analytics Stats Endpoint
router.get('/stats', getAdminStats);

// Consultation Management Endpoints
router.get('/consultations', getAllConsultations);
router.patch('/consultations/:id/status', validate(updateStatusSchema), updateConsultationStatus);
router.delete('/consultations/:id', adminOnly, deleteConsultation);

// User Management Endpoints
router.get('/users', getAllUsersAdmin);
// Privilege changes and account deletion are admin-only: an advisor must not be able to promote
// themselves or remove other accounts.
router.patch('/users/:id/role', adminOnly, updateUserRole);
router.delete('/users/:id', adminOnly, deleteUserAdmin);

// Blog Management Endpoints
router.get('/blogs', getBlogs);
router.post('/blogs', createBlog);
router.put('/blogs/:id', updateBlog);
router.delete('/blogs/:id', deleteBlog);

// Newsletter Management Endpoints
router.get('/newsletters', getNewsletterSubscribers);
router.delete('/newsletters/:id', deleteSubscriber);

export default router;
