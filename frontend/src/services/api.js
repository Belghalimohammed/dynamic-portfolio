import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const TOKEN_KEY = 'portfolio_token';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  delete api.defaults.headers.common['Authorization'];
};

// Initialize token if exists
const token = getToken();
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// Public Portfolio API
export const portfolioAPI = {
  getHero: () => api.get('/portfolio/hero'),
  getAbout: () => api.get('/portfolio/about'),
  getEducation: () => api.get('/portfolio/education'),
  getExperience: () => api.get('/portfolio/experience'),
  getSkills: () => api.get('/portfolio/skills'),
  getProjects: () => api.get('/portfolio/projects'),
  getCertifications: () => api.get('/portfolio/certifications'),
  getTestimonials: () => api.get('/portfolio/testimonials'),
  getBlog: () => api.get('/portfolio/blog'),
  getSettings: () => api.get('/portfolio/settings'),
  submitContact: (data) => api.post('/contact', data),
};

// Admin API
export const adminAPI = {
  // Hero section
  updateHero: (data) => api.put('/admin/hero', data),
  
  // About section
  updateAbout: (data) => api.put('/admin/about', data),
  
  // Education
  createEducation: (data) => api.post('/admin/education', data),
  updateEducation: (id, data) => api.put(`/admin/education/${id}`, data),
  deleteEducation: (id) => api.delete(`/admin/education/${id}`),
  
  // Experience
  createExperience: (data) => api.post('/admin/experience', data),
  updateExperience: (id, data) => api.put(`/admin/experience/${id}`, data),
  deleteExperience: (id) => api.delete(`/admin/experience/${id}`),
  
  // Skills
  updateSkills: (data) => api.put('/admin/skills', data),
  
  // Projects
  createProject: (data) => api.post('/admin/projects', data),
  updateProject: (id, data) => api.put(`/admin/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/admin/projects/${id}`),
  
  // Certifications
  createCertification: (data) => api.post('/admin/certifications', data),
  updateCertification: (id, data) => api.put(`/admin/certifications/${id}`, data),
  deleteCertification: (id) => api.delete(`/admin/certifications/${id}`),
  
  // Testimonials
  createTestimonial: (data) => api.post('/admin/testimonials', data),
  updateTestimonial: (id, data) => api.put(`/admin/testimonials/${id}`, data),
  deleteTestimonial: (id) => api.delete(`/admin/testimonials/${id}`),
  
  // Blog
  createBlogArticle: (data) => api.post('/admin/blog/articles', data),
  updateBlogArticle: (id, data) => api.put(`/admin/blog/articles/${id}`, data),
  deleteBlogArticle: (id) => api.delete(`/admin/blog/articles/${id}`),
  
  // Settings
  updateSettings: (data) => api.put('/admin/settings', data),
  
  // File uploads
  uploadFile: (file, subfolder = null) => {
    const formData = new FormData();
    formData.append('file', file);
    if (subfolder) {
      formData.append('subfolder', subfolder);
    }
    return api.post('/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  listFiles: (subfolder = null) => {
    const params = subfolder ? { subfolder } : {};
    return api.get('/admin/files', { params });
  },
  
  deleteFile: (filename, subfolder = null) => {
    const params = subfolder ? { subfolder } : {};
    return api.delete(`/admin/files/${filename}`, { params });
  },
  
  // Contact messages
  getContactMessages: () => api.get('/admin/contact-messages'),
};

// Request interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;