import api from './apiClient';

export const blogService = {
  /**
   * Get public or admin blogs list
   * GET /api/blogs
   */
  getBlogs: async (params = {}) => {
    try {
      const res = await api.get('/api/blogs', { params });
      return res?.data?.data || res?.data || res;
    } catch (err) {
      console.error('[blogService.getBlogs Error]:', err);
      return { blogs: [], count: 0, totalBlogs: 0 };
    }
  },

  /**
   * Get single blog post by slug
   * GET /api/blogs/:slug
   */
  getBlogBySlug: async (slug) => {
    try {
      const res = await api.get(`/api/blogs/${slug}`);
      return res?.data?.data || res?.data || res;
    } catch (err) {
      console.error('[blogService.getBlogBySlug Error]:', err);
      return null;
    }
  },

  /**
   * Create blog (Admin)
   * POST /api/blogs
   */
  createBlog: async (blogData) => {
    const res = await api.post('/api/blogs', blogData);
    return res?.data?.data || res?.data || res;
  },

  /**
   * Update blog (Admin)
   * PUT /api/blogs/:id
   */
  updateBlog: async (id, blogData) => {
    const res = await api.put(`/api/blogs/${id}`, blogData);
    return res?.data?.data || res?.data || res;
  },

  /**
   * Delete blog (Admin)
   * DELETE /api/blogs/:id
   */
  deleteBlog: async (id) => {
    const res = await api.delete(`/api/blogs/${id}`);
    return res?.data?.data || res?.data || res;
  },
};

export default blogService;
