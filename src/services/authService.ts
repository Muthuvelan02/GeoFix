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
  role: 'ROLE_CITIZEN' | 'ROLE_CONTRACTOR' | 'ROLE_ADMIN' | 'ROLE_SUPERADMIN' | 'ROLE_WORKER';
  // Documents for contractor/admin verification
  photoUrl?: string;
  aadharFrontUrl?: string;
  aadharBackUrl?: string;
  // Admin specific fields
  department?: string;
  employeeId?: string;
  // Contractor specific fields
  companyName?: string;
  specialization?: string;
  description?: string;
  // Worker specific fields (created by contractor)
  createdByContractorId?: number;
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

  // Register admin with special admin code
  async registerAdmin(adminData: {
    name: string;
    email: string;
    mobile: string;
    password: string;
    address: string;
    role: 'ROLE_ADMIN';
    isAdmin: boolean;
    adminCode: string;
    department: string;
    employeeId: string;
  }): Promise<SignupResponse> {
    try {
      console.log('Admin registration attempt with:', { 
        email: adminData.email, 
        mobile: adminData.mobile,
        department: adminData.department 
      });
      
      const response = await api.post<SignupResponse>('/auth/register-admin', adminData);
      return response.data;
    } catch (error: any) {
      console.error('Admin registration error:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.status === 400) {
        throw new Error('Invalid admin registration data. Please check all fields.');
      } else if (error.response?.status === 401) {
        throw new Error('Invalid admin authorization code.');
      } else if (error.response?.status === 409) {
        throw new Error('An admin with this email or mobile already exists.');
      } else {
        throw new Error('Admin registration failed. Please try again later.');
      }
    }
  }

  // Register superadmin with master key
  async registerSuperadmin(superadminData: {
    name: string;
    email: string;
    mobile: string;
    password: string;
    address: string;
    role: 'ROLE_SUPERADMIN';
    isAdmin: boolean;
    masterKey: string;
    organization: string;
    designation: string;
    employeeId: string;
    securityQuestions: Array<{ question: string; answer: string }>;
  }): Promise<SignupResponse> {
    try {
      console.log('Superadmin registration attempt with:', { 
        email: superadminData.email, 
        mobile: superadminData.mobile,
        organization: superadminData.organization 
      });
      
      const response = await api.post<SignupResponse>('/auth/register-superadmin', superadminData);
      return response.data;
    } catch (error: any) {
      console.error('Superadmin registration error:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.status === 400) {
        throw new Error('Invalid superadmin registration data. Please check all fields.');
      } else if (error.response?.status === 401) {
        throw new Error('Invalid master key. Access denied.');
      } else if (error.response?.status === 409) {
        throw new Error('A superadmin with this email or mobile already exists.');
      } else {
        throw new Error('Superadmin registration failed. Please try again later.');
      }
    }
  }

  // Get user profile with role-specific data
  async getUserProfile(): Promise<any> {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error: any) {
      console.error('Get profile error:', error);
      throw new Error('Failed to fetch user profile.');
    }
  }

  // Update user profile
  async updateProfile(profileData: any): Promise<any> {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw new Error('Failed to update profile.');
    }
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<any> {
    try {
      const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error: any) {
      console.error('Change password error:', error);
      if (error.response?.status === 400) {
        throw new Error('Current password is incorrect.');
      }
      throw new Error('Failed to change password.');
    }
  }

  // Admin specific methods
  async getSystemStats(): Promise<any> {
    try {
      const response = await api.get('/admin/system-stats');
      return response.data;
    } catch (error: any) {
      console.error('Get system stats error:', error);
      throw new Error('Failed to fetch system statistics.');
    }
  }

  // Superadmin specific methods
  async getAllUsers(): Promise<any> {
    try {
      const response = await api.get('/superadmin/users');
      return response.data;
    } catch (error: any) {
      console.error('Get all users error:', error);
      throw new Error('Failed to fetch users.');
    }
  }

  async approveUser(userId: number): Promise<any> {
    try {
      const response = await api.post(`/superadmin/users/${userId}/approve`);
      return response.data;
    } catch (error: any) {
      console.error('Approve user error:', error);
      throw new Error('Failed to approve user.');
    }
  }

  async suspendUser(userId: number): Promise<any> {
    try {
      const response = await api.post(`/superadmin/users/${userId}/suspend`);
      return response.data;
    } catch (error: any) {
      console.error('Suspend user error:', error);
      throw new Error('Failed to suspend user.');
    }
  }
}

export const authService = new AuthService();