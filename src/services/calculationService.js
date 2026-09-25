import apiClient from './apiClient';

const calculationService = {
  /**
   * Save a calculation
   */
  async saveCalculation(calculationData) {
    const response = await apiClient.post('/api/calculations/save', calculationData);
    return response.data;
  },

  /**
   * Get current user's saved calculations
   */
  async getMyCalculations(params = {}) {
    const response = await apiClient.get('/api/calculations/my', { params });
    const payload = response.data?.data;
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.data)) return payload.data;
    if (payload && Array.isArray(payload.calculations)) return payload.calculations;
    return [];
  },

  /**
   * Get single calculation details by ID
   */
  async getCalculationById(id) {
    const response = await apiClient.get(`/api/calculations/${id}`);
    return response.data?.data || response.data;
  },

  /**
   * Delete a saved calculation
   */
  async deleteCalculation(id) {
    const response = await apiClient.delete(`/api/calculations/${id}`);
    return response.data;
  },
};

export default calculationService;
