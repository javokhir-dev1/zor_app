import apiClient from './client';

// Auth
export const authApi = {
  authenticate: (initData) => apiClient.post('/auth', { initData }),
};

// User
export const userApi = {
  getProfile: () => apiClient.get('/user/profile'),
  getLeaderboard: (limit = 100) => apiClient.get(`/user/leaderboard?limit=${limit}`),
};

// Tasks
export const taskApi = {
  list: () => apiClient.get('/tasks'),
  submit: (taskId, formData) => apiClient.post(`/tasks/${taskId}/submit`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// Shows
export const showApi = {
  list: () => apiClient.get('/shows'),
  book: (showId) => apiClient.post(`/shows/${showId}/book`),
};

// Settings
export const settingsApi = {
  getStreamUrls: () => apiClient.get('/settings/stream-urls'),
};
