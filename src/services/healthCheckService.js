import apiClient from './apiClient';

const healthCheckService = {
  /**
   * Ask for a callback after a Financial Health Check-up. `payload` must come from buildLeadPayload (contact details,
   * consent and the score summary only; the amounts the person typed never reach this function).
   * POST /api/health-check  ->  201 { id }
   * Resolves only on HTTP 201; any other status or a network error rejects, so callers can never show a false success.
   */
  async submitCallback(payload) {
    const response = await apiClient.post('/api/health-check', payload);
    if (response.status !== 201) throw new Error('Callback request was not saved');
    return response.data?.data;
  },

  /**
   * Admin: list who took the health check
   * GET /api/health-check  ->  { total, totalPages, currentPage, entries }
   */
  async getAll(params = {}) {
    const response = await apiClient.get('/api/health-check', { params });
    const data = response.data?.data || {};
    return {
      entries: Array.isArray(data.entries) ? data.entries : [],
      total: data.total || 0,
      totalPages: data.totalPages || 1,
      currentPage: data.currentPage || 1,
    };
  },
};

export default healthCheckService;
