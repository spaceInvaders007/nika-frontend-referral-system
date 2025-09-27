export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  ENDPOINTS: {
    // Authentication
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    REGISTER: '/api/auth/register',
    
    // Referral
    GENERATE_REFERRAL_CODE: '/api/referral/generate',
    GET_REFERRAL_NETWORK: '/api/referral/network',
    GET_REFERRAL_EARNINGS: '/api/referral/earnings',
    CLAIM_EARNINGS: '/api/referral/claim',
    
    SIMULATE_TRADE: '/api/webhook/trade',
  },
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Helper function to get auth token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    ...API_CONFIG.HEADERS,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};
