import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

// Mock the API service to avoid axios import issues
jest.mock('./services/api', () => ({
  login: jest.fn(),
  signup: jest.fn(),
  generateReferralCode: jest.fn(),
}));

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = createTestQueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

test('renders referral system', () => {
  render(
    <TestWrapper>
      <App />
    </TestWrapper>
  );
  const titleElement = screen.getByText(/referral system/i);
  expect(titleElement).toBeInTheDocument();
});
