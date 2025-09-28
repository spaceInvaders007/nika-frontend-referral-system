import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import {
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as BalanceIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthProvider';
import { useUserStats, useReferralEarnings } from '../hooks/useApi';
import { StatsCard } from '../components/dashboard/StatsCard';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { EarningsChart } from '../components/dashboard/EarningsChart';
import { QuickActions } from '../components/dashboard/QuickActions';
import { ApiTester } from '../components/dev/ApiTester';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: userStats, isLoading: statsLoading, refetch: refetchStats } = useUserStats();
  const { data: earningsData, isLoading: earningsLoading, refetch: refetchEarnings } = useReferralEarnings();

  // Use only real API data - no mock data fallbacks
  const stats = {
    // Use real earnings data from API
    totalEarnings: earningsData?.data ? parseFloat(earningsData.data.totalEarned || '0') : 0,
    totalReferrals: userStats?.totalReferrals || 0,
    thisMonthEarnings: userStats?.thisMonthEarnings || 0,
    pendingClaims: earningsData?.data ? parseFloat(earningsData.data.totalUnclaimed || '0') : 0,
  };

  // Debug logging to see what data we're getting

  const isLoading = statsLoading || earningsLoading;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Typography variant="h6" color="text.secondary">
          Loading your dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Welcome back, {user?.name}! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Here's an overview of your referral performance and earnings
            </Typography>
          </Box>
          <Button 
            variant="outlined" 
            onClick={() => {
              refetchStats();
              refetchEarnings();
            }}
            sx={{ ml: 2 }}
          >
            Refresh Data
          </Button>
        </Box>
      </Box>

      {/* Development API Tester */}
      <ApiTester />

      <Box 
        sx={{ 
          mb: 4,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
          gap: 3,
        }}
      >
        <StatsCard
          title="Total Earnings"
          value={`$${stats.totalEarnings.toLocaleString()}`}
          subtitle="All-time commission earnings"
          icon={<MoneyIcon />}
          color="success"
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard
          title="Total Referrals"
          value={stats.totalReferrals}
          subtitle="Active referral network"
          icon={<PeopleIcon />}
          color="primary"
          trend={{ value: 8.3, isPositive: true }}
        />
        <StatsCard
          title="This Month"
          value={`$${stats.thisMonthEarnings.toLocaleString()}`}
          subtitle="Current month earnings"
          icon={<TrendingUpIcon />}
          color="secondary"
          trend={{ value: 23.1, isPositive: true }}
        />
        <StatsCard
          title="Pending Claims"
          value={`$${stats.pendingClaims.toLocaleString()}`}
          subtitle="Ready to claim"
          icon={<BalanceIcon />}
          color="warning"
        />
      </Box>

      <Box 
        sx={{ 
          mb: 4,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: 3,
        }}
      >
        <EarningsChart />
        <QuickActions />
      </Box>

      <Box>
        <RecentActivity />
      </Box>
    </Box>
  );
};
