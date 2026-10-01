import apiClient from './apiClient';

const consultationService = {
  /**
   * Book a new consultation (Authenticated User)
   * POST /api/consultations
   */
  async bookConsultation(bookingData) {
    const response = await apiClient.post('/api/consultations', bookingData);
    return response.data?.data;
  },

  /**
   * Get logged-in user's consultations
   * GET /api/consultations/my
   */
  async getMyConsultations(params = {}) {
    const response = await apiClient.get('/api/consultations/my', { params });
    const data = response.data?.data;
    return Array.isArray(data) ? data : [];
  },

  /**
   * Cancel pending consultation
   * PATCH /api/consultations/:id/cancel
   */
  async cancelConsultation(id) {
    const response = await apiClient.patch(`/api/consultations/${id}/cancel`);
    return response.data?.data;
  },

  /**
   * Get all consultations with search & filters (Admin Only)
   * GET /api/admin/consultations
   */
  async getAllConsultations(params = {}) {
    const response = await apiClient.get('/api/admin/consultations', { params });
    const data = response.data?.data;
    if (Array.isArray(data)) {
      return { consultations: data, pagination: { totalBookings: data.length, totalPages: 1, page: 1, limit: 10 } };
    }
    return {
      consultations: Array.isArray(data?.consultations) ? data.consultations : [],
      pagination: data?.pagination || { totalBookings: 0, totalPages: 1, page: 1, limit: 10 },
    };
  },

  /**
   * Update consultation status (Admin Only)
   * PATCH /api/admin/consultations/:id/status
   */
  async updateConsultationStatus(id, updateData) {
    const response = await apiClient.patch(`/api/admin/consultations/${id}/status`, updateData);
    return response.data?.data;
  },

  /**
   * Delete consultation (Admin Only)
   * DELETE /api/admin/consultations/:id
   */
  async deleteConsultation(id) {
    const response = await apiClient.delete(`/api/admin/consultations/${id}`);
    return response.data?.data;
  },
};

export default consultationService;
