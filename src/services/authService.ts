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
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await api.post<SignupResponse>('/auth/signup', formData);
      // Note: Don't set Content-Type header for FormData - browser will set it automatically with boundary
      
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
    return !!localStorage.getItem('authToken');
  }

  // Get current user data from localStorage
  getCurrentUser(): { userId: number; roles: string[] } | null {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Get dashboard path based on user role
  getDashboardPath(): string {
    const userData = this.getCurrentUser();
    const userRole = userData?.roles[0];
    
    switch (userRole) {
      case 'ROLE_ADMIN':
        return '/dashboard/admin';
      case 'ROLE_CONTRACTOR':
        return '/dashboard/contractor';
      case 'ROLE_CITIZEN':
        return '/dashboard/citizen';
      default:
        return '/login'; // Redirect to login if role is not recognized
    }
  }
}

export const authService = new AuthService();