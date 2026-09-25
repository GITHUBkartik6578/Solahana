import api from './apiClient';

export const newsletterService = {
  /**
   * Subscribe user email to newsletter
   * POST /api/newsletters/subscribe
   */
  subscribe: async (email, source = 'website_footer') => {
    try {
      const res = await api.post('/api/newsletters/subscribe', { email, source });
      return res?.data || res;
    } catch (err) {
      // Fallback try /api/newsletter/subscribe
      const res = await api.post('/api/newsletter/subscribe', { email, source });
      return res?.data || res;
    }
  },

  /**
   * Get subscribers list (Admin)
   * GET /api/admin/newsletters or GET /api/newsletters
   */
  getSubscribers: async (params = {}) => {
    try {
      const res = await api.get('/api/admin/newsletters', { params });
      return res?.data?.data || res?.data || res;
    } catch (err) {
      try {
        const res = await api.get('/api/newsletters', { params });
        return res?.data?.data || res?.data || res;
      } catch (e) {
        console.error('[newsletterService.getSubscribers Error]:', e);
        return { subscribers: [], count: 0, totalSubscribers: 0 };
      }
    }
  },

  /**
   * Delete subscriber (Admin)
   * DELETE /api/admin/newsletters/:id or DELETE /api/newsletters/:id
   */
  deleteSubscriber: async (id) => {
    try {
      const res = await api.delete(`/api/admin/newsletters/${id}`);
      return res?.data || res;
    } catch (err) {
      const res = await api.delete(`/api/newsletters/${id}`);
      return res?.data || res;
    }
  },
};

export default newsletterService;
