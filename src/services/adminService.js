import apiClient from './apiClient';

const adminService = {
  /**
   * Get Admin Analytics Stats (Counts)
   * GET /api/admin/stats
   */
  async getStats() {
    const response = await apiClient.get('/api/admin/stats');
    return response.data?.data || {
      totalUsers: 0,
      totalConsultations: 0,
      pendingConsultations: 0,
      confirmedConsultations: 0,
      completedConsultations: 0,
      cancelledConsultations: 0,
    };
  },

  /**
   * Get all consultations with search & filters
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
   * Update consultation status
   * PATCH /api/admin/consultations/:id/status
   */
  async updateConsultationStatus(id, updateData) {
    const response = await apiClient.patch(`/api/admin/consultations/${id}/status`, updateData);
    return response.data?.data;
  },

  /**
   * Delete consultation
   * DELETE /api/admin/consultations/${id}
   */
  async deleteConsultation(id) {
    const response = await apiClient.delete(`/api/admin/consultations/${id}`);
    return response.data?.data;
  },

  /**
   * Get all users (Admin/Advisor)
   * GET /api/admin/users
   */
  async getAllUsers(params = {}) {
    const response = await apiClient.get('/api/admin/users', { params });
    const data = response.data?.data;
    if (Array.isArray(data)) {
      return { users: data, pagination: { totalUsers: data.length, totalPages: 1, page: 1, limit: 10 } };
    }
    return {
      users: Array.isArray(data?.users) ? data.users : [],
      pagination: data?.pagination || { totalUsers: 0, totalPages: 1, page: 1, limit: 10 },
    };
  },

  /**
   * Update user role (user <-> admin)
   * PATCH /api/admin/users/:id/role
   */
  async updateUserRole(id, role) {
    const response = await apiClient.patch(`/api/admin/users/${id}/role`, { role });
    return response.data?.data;
  },

  /**
   * Delete user account
   * DELETE /api/admin/users/:id
   */
  async deleteUser(id) {
    const response = await apiClient.delete(`/api/admin/users/${id}`);
    return response.data?.data;
  },
};

export default adminService;
