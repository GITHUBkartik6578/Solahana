import BlogCover from '../../components/BlogCover';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  BookOpen, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import blogService from '../../services/blogService';

const CATEGORIES = [
  'All',
  'SIP & Mutual Funds',
  'Retirement Planning',
  'Tax Planning',
  'Wealth Creation',
  'Insurance',
  'Financial Literacy',
  'Market Insights',
];

const DEFAULT_BLOGS = [
  {
    _id: 'default-1',
    slug: 'sip-wealth-portfolio-15-years',
    title: 'How to Build a ₹5 Crore SIP Wealth Portfolio in 15 Years',
    excerpt: 'A step-by-step framework to step-up your SIPs, manage market volatility, and achieve early financial independence in India.',
    category: 'SIP & Mutual Funds',
    coverImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800',
    readTime: '5 min read',
    publishedAt: '2026-03-10',
  },
  {
    _id: 'default-2',
    slug: 'tax-saving-strategies-fy-2026-27',
    title: 'Section 80C & Beyond: Smart Tax Saving Strategies for FY 2026-27',
    excerpt: 'Optimize your tax liability across new vs old tax regimes with ELSS, NPS, SWP, and corporate tax structuring.',
    category: 'Tax Planning',
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800',
    readTime: '4 min read',
    publishedAt: '2026-03-05',
  },
  {
    _id: 'default-3',
    slug: 'fire-movement-india-retire-early',
    title: 'The FIRE Movement in India: How to Retire 10 Years Early',
    excerpt: 'Calculate your exact FIRE target corpus with inflation adjustment and sustainable withdrawal rate strategies.',
    category: 'Retirement Planning',
    coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800',
    readTime: '6 min read',
    publishedAt: '2026-02-28',
  },
  {
    _id: 'default-4',
    slug: 'asset-allocation-masterclass-equity-debt-gold',
    title: 'Asset Allocation Masterclass: Balancing Equity, Debt & Gold',
    excerpt: 'Discover how top HNWIs allocate capital across market cycles to protect upside while minimizing drawdown risk.',
    category: 'Wealth Creation',
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800',
    readTime: '4 min read',
    publishedAt: '2026-02-20',
  },
  {
    _id: 'default-5',
    slug: 'navigating-market-volatility-sip-vs-lumpsum',
    title: 'Navigating Market Volatility: Buying the Dips vs Systematic SIP',
    excerpt: 'Data-backed comparison between market timing and disciplined rupee cost averaging across Indian equity cycles.',
    category: 'Market Insights',
    coverImage: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?q=80&w=800',
    readTime: '5 min read',
    publishedAt: '2026-02-14',
  },
  {
    _id: 'default-6',
    slug: 'understanding-risk-adjusted-returns-sharpe-xirr',
    title: 'Understanding Risk-Adjusted Returns: Sharpe Ratio & XIRR Explained',
    excerpt: 'Learn how to evaluate your portfolio performance beyond absolute returns using professional risk metrics.',
    category: 'Financial Literacy',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800',
    readTime: '3 min read',
    publishedAt: '2026-02-01',
  },
];

export default function BlogsLandingPage() {
  const navigate = useNavigate();

  // State
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await blogService.getBlogs({
        category: activeCategory !== 'All' ? activeCategory : undefined,
        search: searchQuery || undefined,
        limit: 20,
      });

      let fetched = [];
      if (res && res.blogs && res.blogs.length > 0) {
        fetched = res.blogs;
      } else if (Array.isArray(res) && res.length > 0) {
        fetched = res;
      }

      if (fetched.length === 0) {
        // Filter default blogs if category/search active
        let filtered = DEFAULT_BLOGS;
        if (activeCategory !== 'All') {
          filtered = filtered.filter(b => b.category === activeCategory);
        }
        if (searchQuery) {
          filtered = filtered.filter(b => 
            b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            b.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        setBlogs(filtered);
      } else {
        setBlogs(fetched);
      }
    } catch (err) {
      console.error('[Fetch Blogs Error]:', err);
      setBlogs(DEFAULT_BLOGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [activeCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBlogs();
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#F7F8FB] text-[#0F1F45] relative overflow-hidden text-left font-inter">
      {/* Background Soft Glow */}
      <div className="absolute top-10 left-1/3 w-[600px] h-[600px] bg-[#2F5BC7]/8 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* HEADER SECTION */}
        <div className="text-center space-y-3.5 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FB] text-xs font-semibold text-[#1A3170] uppercase tracking-widest"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#2F5BC7]" />
            <span>SOLAHANA RESOURCES</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif-luxury text-3xl sm:text-5xl font-bold tracking-tight text-[#0F1F45] leading-tight"
          >
            Wealth & Financial Insights
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-[#475569] font-inter leading-relaxed max-w-2xl mx-auto"
          >
            Practical guides on goal planning, tax optimization, FIRE retirement structuring, and zero-commission wealth creation.
          </motion.p>

          {/* SEARCH BAR */}
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto pt-2 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles on SIP, Tax, FIRE retirement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#E4E8F0] focus:border-[#2F5BC7] rounded-2xl py-3 pl-11 pr-4 text-xs sm:text-sm text-[#0F1F45] placeholder-[#94A3B8] focus:outline-none shadow-xs transition-colors"
              />
            </div>
            <button
              type="submit"
              className="gold-glow-button px-5 py-3 rounded-2xl text-xs font-bold text-white flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* CATEGORY FILTER PILLS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar justify-start sm:justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#0F1F45] text-white font-bold shadow-md'
                  : 'bg-white text-[#475569] hover:text-[#2F5BC7] hover:bg-[#F7F8FB] border border-[#E4E8F0]/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#2F5BC7] animate-spin" />
            <p className="text-sm text-[#64748B]">Loading articles...</p>
          </div>
        )}

        {/* CLEAN UNIFORM ARTICLE CARD GRID (NO LONG PREVIEWS) */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {blogs.map((blog, idx) => (
              <motion.div
                key={blog._id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -6 }}
                onClick={() => navigate(`/blogs/${blog.slug}`)}
                className="group rounded-3xl bg-white border border-[#E4E8F0]/60 hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)] shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* 1. Article Image & Category Badge Overlay */}
                  <div className="h-52 overflow-hidden relative bg-[#F7F8FB]">
                    <BlogCover
                      src={blog.coverImage}
                      category={blog.category}
                      title={blog.title}
                      className="group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* 2. Category Badge */}
                    <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-[10px] font-bold bg-[#0F1F45] text-white tracking-wide shadow-md">
                      {blog.category}
                    </span>
                  </div>

                  {/* Card Content: Title & 2-Line Excerpt */}
                  <div className="p-6 space-y-3 text-left">
                    <div className="flex items-center gap-3 text-[11px] text-[#64748B]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#2F5BC7]" />
                        <span>{blog.readTime || '4 min read'}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#2F5BC7]" />
                        <span>{new Date(blog.publishedAt || blog.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </span>
                    </div>

                    {/* 3. Title */}
                    <h3 className="text-lg sm:text-xl font-serif-luxury font-bold text-[#0F1F45] group-hover:text-[#2F5BC7] transition-colors leading-snug line-clamp-2">
                      {blog.title}
                    </h3>

                    {/* 4. Two-Line Excerpt */}
                    <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>

                {/* 5. Read More Button */}
                <div className="px-6 pb-6 pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/blogs/${blog.slug}`);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl border border-[#2F5BC7]/30 text-xs font-bold text-[#0F1F45] group-hover:bg-[#1A3170] group-hover:text-white group-hover:border-[#2F5BC7] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

