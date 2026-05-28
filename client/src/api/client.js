import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Token saqlash (memory-only, xavfsiz)
let authToken = null;

export function setAuthToken(token) { authToken = token; }
export function getAuthToken() { return authToken; }
export function clearAuthToken() { authToken = null; }

// Request interceptor — har bir so'rovga JWT qo'shish
apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Response interceptor — 401 uchun
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthToken();
      // TWA da qayta auth
    }
    return Promise.reject(error);
  }
);

export default apiClient;
