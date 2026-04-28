// src/services/api.js
// API integration with MongoDB backend

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach JWT token if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── AUTH ──────────────────────────────────────────────────────
export const authService = {
  loginNGO: (data) => apiClient.post('/auth/ngo/login', data),
  loginVolunteer: (data) => apiClient.post('/auth/volunteer/login', data),
  registerNGO: (data) => apiClient.post('/auth/ngo/register', data),
  registerVolunteer: (data) => apiClient.post('/auth/volunteer/register', data),
  loginAdmin: (data) => apiClient.post('/auth/admin/login', data),
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_data');
  },
  // Helper function to save login credentials
  saveLoginData: (token, role, userData) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_role', role);
    localStorage.setItem('user_data', JSON.stringify(userData));
  }
};

// ─── TASKS ─────────────────────────────────────────────────────
export const taskService = {
  getAllTasks: (filters) => apiClient.get('/tasks', { params: filters }),
  getTaskById: (id) => apiClient.get(`/tasks/${id}`),
  createTask: (data) => apiClient.post('/tasks', data),
  updateTask: (id, data) => apiClient.put(`/tasks/${id}`, data),
  deleteTask: (id) => apiClient.delete(`/tasks/${id}`),
  getTaskApplicants: (taskId) => apiClient.get(`/tasks/${taskId}/applicants`),
  applyToTask: (taskId) => apiClient.post(`/tasks/${taskId}/apply`),
  withdrawApplication: (taskId) => apiClient.delete(`/tasks/${taskId}/apply`),
};

// ─── NGO ───────────────────────────────────────────────────────
export const ngoService = {
  getAllNGOs: () => apiClient.get('/admin/ngos'),
  approveNGO: (ngoId) => apiClient.patch(`/admin/ngos/${ngoId}/approve`),
  rejectNGO: (ngoId) => apiClient.patch(`/admin/ngos/${ngoId}/reject`),
  getNGOProfile: (ngoId) => apiClient.get(`/ngos/${ngoId}`),
  updateNGOProfile: (ngoId, data) => apiClient.put(`/ngos/${ngoId}`, data),
};

// ─── VOLUNTEER ─────────────────────────────────────────────────
export const volunteerService = {
  getProfile: () => apiClient.get('/volunteer/profile'),
  updateProfile: (data) => apiClient.put('/volunteer/profile', data),
  getAppliedTasks: () => apiClient.get('/volunteer/applied-tasks'),
};

export default apiClient;
