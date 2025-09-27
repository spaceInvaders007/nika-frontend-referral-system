import axios from 'axios';
import { API_CONFIG, getAuthHeaders } from '../config/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth headers
apiClient.interceptors.request.use(
  (config) => {
    const headers = getAuthHeaders();
    Object.assign(config.headers, headers);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export interface SignupResponse {
  success: true;
  data: {
    token: string;
    userId: string;
    referralCode: string;
    hasReferrer: boolean;
  };
}

export interface LoginResponse {
  success: true;
  data: {
    token: string;
    userId: string;
  };
}

export interface User {
  id: string;
  email: string;
  name?: string;
  referralCode: string;
  hasReferrer?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  referralCode?: string | null;
}

export const apiService = {
  // Authentication
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, data);
    return response.data;
  },

  signup: async (data: RegisterRequest): Promise<SignupResponse> => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.SIGNUP, data);
    return response.data;
  },

  // Simple user data extraction from JWT
  getMe: async (): Promise<User> => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No token found');
    
    try {
      // Decode JWT token to get user info
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.id && payload.email) {
        return {
          id: payload.id,
          email: payload.email,
          referralCode: 'TEMP123', // Will be populated later
        };
      }
    } catch (error) {
      console.warn('Failed to decode JWT token:', error);
    }
    
    // Fallback to mock data
    return {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'user@example.com',
      referralCode: 'TEMP123',
    };
  },
};