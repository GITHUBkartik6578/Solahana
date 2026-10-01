import express from 'express';
import {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public Routes
// optionalAuth: anonymous visitors only ever see published posts; admins/advisors also see drafts.
router.get('/', optionalAuth, getBlogs);
router.get('/:slug', optionalAuth, getBlogBySlug);

// Admin Protected Routes
router.post('/', protect, admin, createBlog);
router.put('/:id', protect, admin, updateBlog);
router.delete('/:id', protect, admin, deleteBlog);

export default router;
