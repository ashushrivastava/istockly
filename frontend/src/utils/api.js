// frontend/src/utils/api.js
// API utility functions with axios

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Courses API
export const coursesAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getBySlug: (slug) => api.get(`/courses/${slug}`),
  getCategories: () => api.get('/courses/meta/categories'),
};

// User API
export const userAPI = {
  getEnrolledCourses: () => api.get('/user/enrolled-courses'),
  checkCourseAccess: (courseId) => api.get(`/user/courses/${courseId}/access`),
  getCourseWithProgress: (courseId) => api.get(`/user/courses/${courseId}`),
  updateProgress: (courseId, data) => api.post(`/user/courses/${courseId}/progress`, data),
  getDashboardStats: () => api.get('/user/dashboard/stats'),
  syncUser: (data) => api.post('/user/sync', data),
};

// Admin API
export const adminAPI = {
  getAllCourses: () => api.get('/admin/courses'),
  getCourse: (id) => api.get(`/admin/courses/${id}`),
  createCourse: (data) => api.post('/admin/courses', data),
  updateCourse: (id, data) => api.put(`/admin/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/admin/courses/${id}`),
  togglePublish: (id) => api.patch(`/admin/courses/${id}/publish`),
  getAnalytics: () => api.get('/admin/analytics'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserDetails: (userId) => api.get(`/admin/users/${userId}`),
  getUsersFromDB: () => api.get('/admin/users/db'),
};

// Payment API
export const paymentAPI = {
  initiate: (data) => api.post('/payment/initiate', data),
  checkStatus: (transactionId) => api.get(`/payment/status/${transactionId}`),
  getHistory: () => api.get('/payment/history'),
};

// Upload API
export const uploadAPI = {
  uploadImage: (formData) => {
    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteImage: (publicId) => api.delete(`/upload/image/${publicId.replace(/\//g, '___')}`),
};



// Live Programs API
export const liveProgramsAPI = {
  getAll: (params) => api.get('/live-programs', { params }),
  getByType: (type) => api.get(`/live-programs/type/${type}`),
  getBySlug: (slug) => api.get(`/live-programs/${slug}`),
};

// Admin Live Programs API
export const adminLiveProgramsAPI = {
  getAll: () => api.get('/admin/live-programs'),
  getById: (id) => api.get(`/admin/live-programs/${id}`),
  create: (data) => api.post('/admin/live-programs', data),
  update: (id, data) => api.put(`/admin/live-programs/${id}`, data),
  delete: (id) => api.delete(`/admin/live-programs/${id}`),
  togglePublish: (id) => api.patch(`/admin/live-programs/${id}/toggle-publish`),
};





export default api;