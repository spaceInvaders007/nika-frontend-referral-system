import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, LoginRequest, RegisterRequest, SignupResponse, LoginResponse } from '../services/api';

// Query Keys
export const QUERY_KEYS = {
  USER: 'user',
  USER_STATS: 'userStats',
  REFERRAL_NETWORK: 'referralNetwork',
  REFERRAL_EARNINGS: 'referralEarnings',
} as const;

// Auth Hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => apiService.login(data),
    onSuccess: (response: LoginResponse) => {
      console.log('useLogin onSuccess, response:', response);
      if (response.success && response.data.token) {
        console.log('useLogin saving token:', response.data.token);
        localStorage.setItem('authToken', response.data.token);
        console.log('Token saved successfully:', localStorage.getItem('authToken'));
      } else {
        console.error('No token in response!', response);
      }
    },
    onError: (error) => {
      console.error('useLogin error:', error);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => apiService.signup(data),
    onSuccess: (response: SignupResponse) => {
      console.log('useRegister onSuccess, response:', response);
      if (response.success && response.data.token) {
        console.log('useRegister saving token:', response.data.token);
        localStorage.setItem('authToken', response.data.token);
        console.log('Token saved successfully:', localStorage.getItem('authToken'));
      } else {
        console.error('No token in response!', response);
      }
    },
    onError: (error) => {
      console.error('useRegister error:', error);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => apiService.logout(),
    onSuccess: () => {
      localStorage.removeItem('authToken');
      queryClient.clear(); // Clear all cached data
    },
  });
};

// User Hooks
export const useUser = () => {
  const token = localStorage.getItem('authToken');
  
  return useQuery({
    queryKey: [QUERY_KEYS.USER],
    queryFn: () => apiService.getMe(),
    enabled: !!token,
    retry: false,
    // Don't throw errors, let AuthProvider handle them
    throwOnError: false,
    // Reasonable cache time to prevent excessive refetching
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useUserStats = () => {
  const token = localStorage.getItem('authToken');
  
  return useQuery({
    queryKey: [QUERY_KEYS.USER_STATS],
    queryFn: () => apiService.getUserStats(),
    enabled: !!token,
    retry: false,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Referral Hooks
export const useReferralNetwork = (page = 1, limit = 10) => {
  const token = localStorage.getItem('authToken');
  
  return useQuery({
    queryKey: [QUERY_KEYS.REFERRAL_NETWORK, page, limit],
    queryFn: () => apiService.getReferralNetwork(page, limit),
    enabled: !!token,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useReferralEarnings = (startDate?: string, endDate?: string) => {
  const token = localStorage.getItem('authToken');
  
  return useQuery({
    queryKey: [QUERY_KEYS.REFERRAL_EARNINGS, startDate, endDate],
    queryFn: () => apiService.getReferralEarnings(startDate, endDate),
    enabled: !!token,
    retry: false,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGenerateReferralCode = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => apiService.generateReferralCode(),
    onSuccess: (response) => {
      console.log('Referral code generated:', response.data.referralCode);
      
      // Update the user data in the cache with the referral code from backend
      queryClient.setQueryData([QUERY_KEYS.USER], (oldData: any) => {
        if (oldData) {
          return {
            ...oldData,
            referralCode: response.data.referralCode,
          };
        }
        return oldData;
      });
      
      console.log('✅ User data updated with referral code:', response.data.referralCode);
    },
  });
};

export const useClaimEarnings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (tokenType?: string) => apiService.claimEarnings(tokenType || 'XP'),
    onSuccess: (response) => {
      console.log('Earnings claimed:', response.data);
      // Invalidate earnings and stats to refetch updated data
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REFERRAL_EARNINGS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_STATS] });
    },
  });
};

// Development/Testing Hooks
export const useSimulateTrade = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, volume, fees }: { userId: string; volume: number; fees: number }) =>
      apiService.simulateTrade(userId, volume, fees),
    onSuccess: (response) => {
      console.log('Trade simulated:', response);
      // Invalidate all relevant data after simulating a trade
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REFERRAL_EARNINGS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_STATS] });
    },
  });
};
