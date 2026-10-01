import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a blog title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Please provide an excerpt / summary'],
      trim: true,
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    summary: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide article content'],
    },
    category: {
      type: String,
      enum: [
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
      ],
      default: 'SIP & Mutual Funds',
    },
    author: {
      type: String,
      default: 'SOLAHANA Advisory Team',
    },
    featuredImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200',
    },
    coverImage: {
      type: String,
    },
    readTime: {
      type: String,
      default: '5 min read',
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Sync Virtuals and Pre-save Hooks (Synchronous pre-save hook, no next callback)
blogSchema.pre('save', function () {
  if (this.excerpt && !this.summary) {
    this.summary = this.excerpt;
  } else if (this.summary && !this.excerpt) {
    this.excerpt = this.summary;
  }

  if (this.featuredImage && !this.coverImage) {
    this.coverImage = this.featuredImage;
  } else if (this.coverImage && !this.featuredImage) {
    this.featuredImage = this.coverImage;
  }

  if (this.status === 'published') {
    this.isPublished = true;
  } else if (this.status === 'draft') {
    this.isPublished = false;
  }
});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
