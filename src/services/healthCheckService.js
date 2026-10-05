import apiClient from './apiClient';

const healthCheckService = {
  /**
   * Save the visitor's name + phone and open a health-check attempt
   * POST /api/health-check  ->  { id, token }
   */
  async start({ fullName, phone }) {
    const response = await apiClient.post('/api/health-check', { fullName, phone, source: 'home_health_check' });
    return response.data?.data;
  },

  /**
   * Attach the answers and the score to the attempt once the six questions are done
   * PATCH /api/health-check/:id/complete
   */
  async complete({ id, token, answers }) {
    const response = await apiClient.patch(`/api/health-check/${id}/complete`, { token, answers });
    return response.data?.data;
  },
};

export default healthCheckService;
