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

// Backend Response Types
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

export interface ReferralNetworkResponse {
  success: true;
  data: {
    user: {
      id: string;
      email: string;
      referralCode: string;
      level: 0;
    };
    referees: ReferralUser[];
  };
}

export interface ReferralUser {
  id: string;
  email: string;
  referralCode: string;
  level: 1 | 2 | 3;
  createdAt: string;
  referees: ReferralUser[];
}

export interface EarningsResponse {
  success: true;
  data: {
    totalEarned: string;
    totalClaimed: string;
    totalUnclaimed: string;
    earningsByLevel: {
      level1: EarningsByUser[];
      level2: EarningsByUser[];
      level3: EarningsByUser[];
    };
  };
}

export interface EarningsByUser {
  sourceUserId: string;
  sourceUserEmail: string;
  totalEarned: string;
  totalClaimed: string;
  totalUnclaimed: string;
  commissionCount: number;
}

export interface GenerateCodeResponse {
  success: true;
  data: {
    referralCode: string;
  };
}

export interface ClaimResponse {
  success: true;
  message: string;
  data: {
    claimableAmount: string;
    txHash: string | null;
  };
}

export interface UserStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  thisMonthEarnings: number;
  conversionRate: number;
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

  register: async (data: RegisterRequest): Promise<SignupResponse> => {
    return apiService.signup(data);
  },


  logout: async (): Promise<void> => {
    return Promise.resolve();
  },

  getMe: async (): Promise<User> => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No token found');
    
    try {
      // Decode JWT to get basic user info
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('🔍 getMe - decoded JWT payload:', payload);
      
      if (payload.id && payload.email) {
        // Get referral code from backend by calling the endpoint directly
        try {
          console.log('🔍 getMe - calling generateReferralCode to get current code...');
          const response = await apiClient.post(API_CONFIG.ENDPOINTS.GENERATE_REFERRAL_CODE);
          const referralResponse = response.data;
          const user = {
            id: payload.id, 
            email: payload.email,
            referralCode: referralResponse.data.referralCode,
          };
          console.log('🔍 getMe - user with referral code:', user);
          return user;
        } catch (referralError) {
          console.warn('Failed to get referral code from backend:', referralError);
          // Don't fallback to hardcoded code - throw error instead
          throw new Error('Failed to get referral code from backend');
        }
      }
    } catch (error) {
      console.warn('Failed to decode JWT token:', error);
    }
    
    // If we get here, something went wrong - throw error instead of returning hardcoded data
    throw new Error('Failed to get user data');
  },

  // Referral
  generateReferralCode: async (): Promise<GenerateCodeResponse> => {
    console.log('🔍 Calling generateReferralCode API...');
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.GENERATE_REFERRAL_CODE);
    console.log('🔍 generateReferralCode API response:', response.data);
    return response.data;
  },

  getReferralNetwork: async (page = 1, limit = 50): Promise<ReferralNetworkResponse> => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.GET_REFERRAL_NETWORK, {
      params: { page, limit },
    });
    return response.data;
  },

  getReferralEarnings: async (startDate?: string, endDate?: string): Promise<EarningsResponse> => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.GET_REFERRAL_EARNINGS, {
      params: { startDate, endDate },
    });
    return response.data;
  },

  claimEarnings: async (tokenType = 'XP'): Promise<ClaimResponse> => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CLAIM_EARNINGS, { tokenType });
    return response.data;
  },

  getUserStats: async (): Promise<UserStats> => {
    // Backend doesn't have user stats endpoint yet
    // Return mock data to avoid circular dependency with getReferralEarnings
    try {
      // In a real implementation, this would call a separate stats endpoint
      // For now, return reasonable mock data
      return {
        totalReferrals: 28,
        activeReferrals: 25, 
        totalEarnings: 1247.50,
        thisMonthEarnings: 387.20, 
        conversionRate: 0.85, 
      };
    } catch {
      return {
        totalReferrals: 0,
        activeReferrals: 0,
        totalEarnings: 0,
        thisMonthEarnings: 0,
        conversionRate: 0,
      };
    }
  },

  simulateTrade: async (userId: string, volume: number, fees: number): Promise<any> => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.SIMULATE_TRADE, {
      userId, 
      volume,
      fees,
      chain: 'arbitrum', 
      tokenPair: 'ETH/USDC', 
      tradeType: 'buy' as const, 
    });
    return response.data;
  },
};
