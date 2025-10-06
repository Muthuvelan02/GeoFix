import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9050',
  timeout: 10000,
  // Remove default Content-Type to allow multipart/form-data
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    // Don't add auth token for signup and login endpoints
    const noAuthEndpoints = ['/auth/signup', '/auth/login'];
    const isNoAuthEndpoint = noAuthEndpoints.some(endpoint => config.url?.includes(endpoint));
    
    // Only access localStorage in browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token && !isNoAuthEndpoint) {
        config.headers.Authorization = `Bearer ${token}`;
      } else if (!token && !isNoAuthEndpoint) {
        console.warn('⚠️ No auth token found for authenticated endpoint:', config.url);
      }
    }
    
    // Only set Content-Type to application/json if not FormData and not already set
    if (!config.headers['Content-Type'] && !(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    // Remove Content-Type for FormData to let browser set it with boundary
    if (config.data instanceof FormData && config.headers['Content-Type']) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    }
    return response;
  },
  (error) => {
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status || 'Network Error'}`);
      console.error('Error details:', error.response?.data);
    }
    // Only handle localStorage operations in browser environment
    if (typeof window !== 'undefined') {
      if (error.response?.status === 401) {
        // Token expired or invalid, redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';
      }
      
      // Handle JWT expired errors specifically
      if (error.response?.status === 500 && 
          error.response?.data?.message?.includes('JWT expired')) {
        // Clear expired token
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;