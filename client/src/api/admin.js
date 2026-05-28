/**
 * Admin API endpoints
 */
import apiClient from './client';

export const adminApi = {
  // Dashboard
  getDashboard: () => apiClient.get('/admin/dashboard'),

  // Users
  listUsers: (params) => apiClient.get('/admin/users', { params }),
  updateRole: (id, role) => apiClient.patch(`/admin/users/${id}/role`, { role }),
  toggleBan: (id, is_banned) => apiClient.patch(`/admin/users/${id}/ban`, { is_banned }),
  updateScore: (id, amount) => apiClient.patch(`/admin/users/${id}/score`, { amount }),

  // Staff
  listStaff: () => apiClient.get('/admin/staff'),

  // Tasks
  createTask: (data) => apiClient.post('/admin/tasks', data),
  updateTask: (id, data) => apiClient.put(`/admin/tasks/${id}`, data),
  deleteTask: (id) => apiClient.delete(`/admin/tasks/${id}`),

  // Submissions
  listSubmissions: (params) => apiClient.get('/admin/submissions', { params }),
  reviewSubmission: (id, status) => apiClient.patch(`/admin/submissions/${id}`, { status }),

  // Shows
  listShows: () => apiClient.get('/admin/shows'),
  createShow: (data) => apiClient.post('/admin/shows', data),
  updateShow: (id, data) => apiClient.put(`/admin/shows/${id}`, data),
  listShowTickets: (showId) => apiClient.get(`/admin/shows/${showId}/tickets`),
  confirmTicket: (id) => apiClient.patch(`/admin/tickets/${id}/confirm`),

  // Settings
  getAllSettings: () => apiClient.get('/settings/all'),
  updateSetting: (key, value) => apiClient.put('/settings', { key, value }),

  // Mailing
  sendMailing: (data) => apiClient.post('/admin/mailing', data),
};

// Guard
export const guardApi = {
  verifyQR: (qr_code) => apiClient.post('/guard/verify-qr', { qr_code }),
};
