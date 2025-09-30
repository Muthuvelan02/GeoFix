import api from '@/lib/axios';

// Types based on your backend DTOs
export interface LoginRequest {
  email?: string;
  mobile?: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  roles: string[];
}

export interface SignupRequest {
  name: string;
  email: string;
  mobile: string;
  password: string;
  address: string;
  role: 'ROLE_CITIZEN' | 'ROLE_CONTRACTOR' | 'ROLE_ADMIN';
  isAdmin?: boolean;
  referralCode?: string;
  storeId?: number;
  referredByDeliveryBoyId?: number;
  storeid?: number;
}

export interface SignupResponse {
  message: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  address: string;
  role: string[];
}

class AuthService {
  constructor() {
    // Clear any expired tokens on initialization
    this.clearExpiredTokens();
  }

  // Clear expired tokens
  private clearExpiredTokens() {
    // Only run in browser environment (not during SSR)
    if (typeof window === 'undefined') return;
    
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        // Check if token is expired by attempting to decode it
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        if (payload.exp && payload.exp < currentTime) {
          console.log('Found expired token, clearing...');
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      }
    } catch (error) {
      // If we can't decode the token, clear it anyway
      console.log('Invalid token found, clearing...');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
  }

  // Login with email or mobile
  async login(loginData: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('Login attempt with:', { email: loginData.email, mobile: loginData.mobile });
      const response = await api.post<LoginResponse>('/auth/login', loginData);
      
      // Store auth data in localStorage
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify({
          userId: response.data.userId,
          roles: response.data.roles
        }));
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.status === 404) {
        throw new Error('API endpoint not found. Please check if the backend is running.');
      } else if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error('Cannot connect to server. Please check if the backend is running on http://localhost:9050');
      } else {
        throw new Error(error.message || 'Login failed');
      }
    }
  }

  // Signup for different roles
  async signup(signupData: SignupRequest, files?: {
    photo?: File;
    aadharFront?: File;
    aadharBack?: File;
  }): Promise<SignupResponse> {
    try {
      console.log('Signup attempt with:', signupData);
      
      // Always use FormData as the backend expects multipart/form-data
      const formData = new FormData();
      formData.append('userData', JSON.stringify(signupData));
      
      console.log('Signup data being sent:', JSON.stringify(signupData, null, 2));
      
      if (files?.photo) {
        formData.append('photo', files.photo);
        console.log('Added photo file:', files.photo.name);
      }
      if (files?.aadharFront) {
        formData.append('aadharFront', files.aadharFront);
        console.log('Added aadharFront file:', files.aadharFront.name);
      }
      if (files?.aadharBack) {
        formData.append('aadharBack', files.aadharBack);
        console.log('Added aadharBack file:', files.aadharBack.name);
      }

      // Log FormData contents
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await api.post<SignupResponse>('/auth/signup', formData, {
        headers: {
          // Let browser set Content-Type with boundary for multipart/form-data
        }
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Signup error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.status === 404) {
        console.error('API endpoint not found. Request URL:', error.config?.url);
        console.error('Base URL:', error.config?.baseURL);
        console.error('Full URL:', `${error.config?.baseURL}${error.config?.url}`);
        throw new Error(`Signup API endpoint not found. Please verify the backend endpoint exists.`);
      } else if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error('Cannot connect to server. Please check if the backend is running on http://localhost:9050');
      } else {
        throw new Error(error.message || 'Signup failed');
      }
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on backend, clear local storage
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
  }

  // Get user profile
  async getProfile(): Promise<User> {
    try {
      const response = await api.get<User>('/auth/profile');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch profile');
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('authToken');
  }

  // Get current user data from localStorage
  getCurrentUser(): { userId: number; roles: string[] } | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  // Get auth token
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  }
}

export const authService = new AuthService();