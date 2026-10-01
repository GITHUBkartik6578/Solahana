import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import Blog from '../models/Blog.js';
import escapeRegex from '../utils/escapeRegex.js';

const isStaff = (user) => !!user && (user.role === 'admin' || user.role === 'advisor');

/**
 * Helper to generate URL slug from title
 */
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const VALID_CATEGORIES = [
  'SIP & Mutual Funds',
  'Retirement Planning',
  'Tax Planning',
  'Wealth Creation',
  'Insurance',
  'Financial Literacy',
  'Market Insights',
  'Financial Planning',
  'Tax Strategy',
  'Retirement',
  'Investments',
  'Goal Planning',
];

/**
 * @desc    Get all blogs (Public gets published only; Admin can pass status=all)
 * @route   GET /api/blogs or GET /api/blog
 * @access  Public
 */
export const getBlogs = asyncHandler(async (req, res) => {
  const { category, search, status, page = 1, limit = 10 } = req.query;

  const query = {};

  // Drafts are visible to staff only. Anonymous visitors always get published posts, whatever ?status= says.
  if (!isStaff(req.user)) {
    query.status = 'published';
  } else if (status && status !== 'all') {
    query.status = status;
  } else if (!status) {
    query.status = 'published';
  }

  if (category && category !== 'All') {
    query.category = category;
  }

  if (search && search.trim()) {
    const term = escapeRegex(search.trim());
    query.$or = [
      { title: { $regex: term, $options: 'i' } },
      { excerpt: { $regex: term, $options: 'i' } },
      { content: { $regex: term, $options: 'i' } },
      { author: { $regex: term, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);
  const skip = (pageNum - 1) * limitNum;

  const totalBlogs = await Blog.countDocuments(query).catch(() => 0);
  const blogs = await Blog.find(query)
    .sort({ publishedAt: -1, createdAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        count: blogs.length,
        totalBlogs,
        totalPages: Math.ceil(totalBlogs / limitNum) || 1,
        currentPage: pageNum,
        blogs: blogs || [],
      },
      'Blogs retrieved successfully'
    )
  );
});

/**
 * @desc    Get single blog by slug or ID
 * @route   GET /api/blogs/:slug
 * @access  Public
 */
export const getBlogBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    throw new ApiError(400, 'Blog slug parameter is required');
  }

  let blog = await Blog.findOne({ slug });

  // Fallback lookup by ID if valid ObjectId
  if (!blog && slug.match(/^[0-9a-fA-F]{24}$/)) {
    blog = await Blog.findById(slug);
  }

  // A draft must look exactly like a missing post to anyone who is not staff.
  if (!blog || (blog.status !== 'published' && !isStaff(req.user))) {
    throw new ApiError(404, 'Blog article not found');
  }

  return res.status(200).json(new ApiResponse(200, blog, 'Blog article retrieved successfully'));
});

/**
 * @desc    Create new blog post
 * @route   POST /api/blogs
 * @access  Private/Admin
 */
export const createBlog = asyncHandler(async (req, res) => {
  const {
    title,
    slug: customSlug,
    excerpt,
    summary,
    content,
    category,
    author,
    featuredImage,
    coverImage,
    readTime,
    status,
  } = req.body;

  // FIX 5 Validation: Validate required fields
  if (!title || !title.trim()) {
    throw new ApiError(400, 'Title is a required field');
  }

  if (!content || !content.trim()) {
    throw new ApiError(400, 'Article content is a required field');
  }

  const finalExcerpt = excerpt || summary || title;
  if (!finalExcerpt || !finalExcerpt.trim()) {
    throw new ApiError(400, 'Excerpt or summary is required');
  }

  const blogCategory = category || 'SIP & Mutual Funds';
  if (!VALID_CATEGORIES.includes(blogCategory)) {
    throw new ApiError(400, `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }

  const blogStatus = status || 'published';
  if (!['published', 'draft'].includes(blogStatus)) {
    throw new ApiError(400, 'Status must be either "published" or "draft"');
  }

  const blogSlug = customSlug ? generateSlug(customSlug) : generateSlug(title);

  // Ensure slug uniqueness
  const existingSlug = await Blog.findOne({ slug: blogSlug });
  let finalSlug = blogSlug;
  if (existingSlug) {
    finalSlug = `${blogSlug}-${Date.now().toString().slice(-4)}`;
  }

  const blog = await Blog.create({
    title: title.trim(),
    slug: finalSlug,
    excerpt: finalExcerpt.trim(),
    summary: finalExcerpt.trim(),
    content: content.trim(),
    category: blogCategory,
    author: author ? author.trim() : 'SOLAHANA Advisory Team',
    featuredImage: featuredImage || coverImage || 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200',
    coverImage: coverImage || featuredImage || 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200',
    readTime: readTime ? readTime.trim() : '5 min read',
    status: blogStatus,
    isPublished: blogStatus === 'published',
    publishedAt: blogStatus === 'published' ? new Date() : null,
  });

  return res.status(201).json(new ApiResponse(201, blog, 'Blog article created successfully'));
});

/**
 * @desc    Update existing blog post
 * @route   PUT /api/blogs/:id
 * @access  Private/Admin
 */
export const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let blog = await Blog.findById(id);
  if (!blog) {
    throw new ApiError(404, 'Blog article not found');
  }

  const {
    title,
    slug: customSlug,
    excerpt,
    summary,
    content,
    category,
    author,
    featuredImage,
    coverImage,
    readTime,
    status,
  } = req.body;

  if (title !== undefined) {
    if (!title.trim()) throw new ApiError(400, 'Title cannot be empty');
    blog.title = title.trim();
  }

  if (customSlug !== undefined) {
    blog.slug = generateSlug(customSlug);
  }

  if (excerpt !== undefined || summary !== undefined) {
    const newExcerpt = excerpt || summary;
    if (newExcerpt) {
      blog.excerpt = newExcerpt.trim();
      blog.summary = newExcerpt.trim();
    }
  }

  if (content !== undefined) {
    if (!content.trim()) throw new ApiError(400, 'Content cannot be empty');
    blog.content = content.trim();
  }

  if (category !== undefined) {
    if (!VALID_CATEGORIES.includes(category)) {
      throw new ApiError(400, `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`);
    }
    blog.category = category;
  }

  if (author !== undefined) blog.author = author.trim();
  
  if (featuredImage !== undefined) {
    blog.featuredImage = featuredImage;
    blog.coverImage = featuredImage;
  }
  if (coverImage !== undefined && !featuredImage) {
    blog.coverImage = coverImage;
    blog.featuredImage = coverImage;
  }

  if (readTime !== undefined) blog.readTime = readTime.trim();

  if (status !== undefined) {
    if (!['published', 'draft'].includes(status)) {
      throw new ApiError(400, 'Status must be either "published" or "draft"');
    }
    blog.status = status;
    blog.isPublished = status === 'published';
    if (status === 'published' && !blog.publishedAt) {
      blog.publishedAt = new Date();
    }
  }

  const updatedBlog = await blog.save();

  return res.status(200).json(new ApiResponse(200, updatedBlog, 'Blog article updated successfully'));
});

/**
 * @desc    Delete blog post
 * @route   DELETE /api/blogs/:id
 * @access  Private/Admin
 */
export const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findById(id);
  if (!blog) {
    throw new ApiError(404, 'Blog article not found');
  }

  await blog.deleteOne();

  return res.status(200).json(new ApiResponse(200, null, 'Blog article deleted successfully'));
});
