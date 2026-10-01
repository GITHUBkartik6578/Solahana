import apiClient from './apiClient';

const authService = {
  /**
   * Register new user
   */
  async register(data) {
    const response = await apiClient.post('/api/auth/register', data);
    if (response.data?.data?.token) {
      localStorage.setItem('solahana_token', response.data.data.token);
    }
    return response.data;
  },

  /**
   * Login user
   */
  async login(credentials) {
    const response = await apiClient.post('/api/auth/login', credentials);
    if (response.data?.data?.token) {
      localStorage.setItem('solahana_token', response.data.data.token);
    }
    return response.data;
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (e) {
      console.warn('Logout server request failed:', e);
    } finally {
      localStorage.removeItem('solahana_token');
    }
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },

  /**
   * Update user profile
   */
  async updateProfile(profileData) {
    const response = await apiClient.patch('/api/auth/profile', profileData);
    return response.data;
  },
};

export default authService;
