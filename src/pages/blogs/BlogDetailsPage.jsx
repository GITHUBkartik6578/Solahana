import BlogCover from '../../components/BlogCover';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Calendar, 
  User, 
  ArrowLeft, 
  Copy, 
  Check, 
  Loader2, 
  ArrowRight,
} from 'lucide-react';
import blogService from '../../services/blogService';

export default function BlogDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError('');
      try {
        const article = await blogService.getBlogBySlug(slug);
        setBlog(article);

        if (article) {
          const allRes = await blogService.getBlogs({ category: article.category, limit: 4 });
          const blogsList = Array.isArray(allRes?.blogs)
            ? allRes.blogs
            : Array.isArray(allRes?.data?.blogs)
            ? allRes.data.blogs
            : Array.isArray(allRes)
            ? allRes
            : [];
          const filtered = blogsList.filter((b) => b?.slug !== slug);
          setRelatedBlogs(filtered.slice(0, 3));
        }
      } catch (err) {
        console.error('[Fetch Article Error]:', err);
        setError('Article not found or moved.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [slug]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-36 pb-24 bg-[#F7F8FB] text-[#0F1F45] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#2F5BC7] animate-spin" />
        <p className="text-sm font-sora font-semibold text-[#64748B]">Loading article...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen pt-36 pb-24 bg-[#F7F8FB] text-[#0F1F45] flex flex-col items-center justify-center space-y-6 px-4">
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm max-w-md text-center font-inter">
          {error || 'Article not found.'}
        </div>
        <button
          onClick={() => navigate('/blogs')}
          className="gold-glow-button px-6 py-3 rounded-full text-xs font-bold text-white flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#F7F8FB] text-[#0F1F45] relative overflow-hidden text-left font-inter">
      {/* Background Soft Glow */}
      <div className="absolute top-10 left-1/3 w-[600px] h-[600px] bg-[#2F5BC7]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/blogs')}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-[#64748B] hover:text-[#2F5BC7] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to SOLAHANA Journal</span>
        </button>

        {/* Article Header */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#2F5BC7]/15 text-[#1A3170] border border-[#2F5BC7]/30 font-sora">
              {blog.category}
            </span>
            <span className="text-xs text-[#64748B] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#2F5BC7]" />
              {blog.readTime || '5 min read'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-[#0F1F45] leading-tight tracking-tight">
            {blog.title}
          </h1>

          <div className="flex items-center justify-between pt-4 border-t border-b border-[#2F5BC7]/20 py-4 text-xs text-[#64748B]">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#2F5BC7]/15 border border-[#2F5BC7]/30 flex items-center justify-center font-bold text-[#0F1F45]">
                {blog.authorName ? blog.authorName[0] : 'S'}
              </div>
              <div>
                <div className="font-bold text-[#0F1F45]">{blog.authorName || 'SOLAHANA Editorial'}</div>
                <div className="text-[10px] text-[#64748B] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#2F5BC7]" />
                  {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <button
              onClick={handleCopyLink}
              className="p-2.5 rounded-xl bg-white border border-[#2F5BC7]/20 hover:border-[#2F5BC7] text-[#0F1F45] flex items-center gap-1.5 transition-all shadow-sm"
              title="Copy Link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#2F5BC7]" />}
              <span className="text-xs">{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Cover Image */}
        <div className="rounded-3xl overflow-hidden shadow-lg border border-[#2F5BC7]/20 h-72 sm:h-96">
          <BlogCover src={blog.coverImage} category={blog.category} title={blog.title} />
        </div>

        {/* Article Body */}
        <div 
          className="prose prose-lg max-w-none text-[#334155] leading-relaxed space-y-6 font-inter border-b border-[#2F5BC7]/20 pb-12"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Planning CTA Banner inside Blog */}
        <div className="p-8 rounded-3xl bg-white border border-[#2F5BC7]/30 shadow-xl space-y-4 text-center">
          <h3 className="text-2xl font-serif-luxury font-bold text-[#0F1F45]">
            Ready to Structure Your Financial Goals?
          </h3>
          <p className="text-sm text-[#475569] max-w-xl mx-auto font-inter">
            Schedule a 1-on-1 private planning session with a SEBI Registered RIA advisor.
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="gold-glow-button px-8 py-3.5 rounded-full text-xs font-bold text-white inline-flex items-center gap-2 shadow-md"
          >
            <span>Start Your Comprehensive Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <div className="space-y-6 pt-6">
            <h3 className="text-2xl font-serif-luxury font-bold text-[#0F1F45]">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((rel, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(`/blogs/${rel.slug}`)}
                  className="p-5 rounded-2xl bg-white border border-[#2F5BC7]/20 hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)] shadow-sm hover:shadow-md cursor-pointer transition-all space-y-3"
                >
                  <h4 className="font-serif-luxury font-bold text-base text-[#0F1F45] line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-[#64748B] line-clamp-2">
                    {rel.excerpt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
