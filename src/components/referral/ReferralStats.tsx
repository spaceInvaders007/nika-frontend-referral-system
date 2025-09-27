import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
} from '@mui/material';

interface ReferralStatsProps {
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  conversionRate: number;
}

export const ReferralStats: React.FC<ReferralStatsProps> = ({
  totalReferrals,
  activeReferrals,
  totalEarnings,
  conversionRate,
}) => {
  const milestones = [
    { target: 10, reward: '$50 Bonus', achieved: totalReferrals >= 10 },
    { target: 25, reward: '$150 Bonus', achieved: totalReferrals >= 25 },
    { target: 50, reward: '$400 Bonus', achieved: totalReferrals >= 50 },
    { target: 100, reward: '$1000 Bonus', achieved: totalReferrals >= 100 },
  ];

  const nextMilestone = milestones.find(m => !m.achieved);
  const progress = nextMilestone 
    ? (totalReferrals / nextMilestone.target) * 100 
    : 100;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Referral Statistics
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Total Referrals
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {totalReferrals}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Active Referrals
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {activeReferrals}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Conversion Rate
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {(conversionRate * 100).toFixed(1)}%
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Total Earnings
            </Typography>
            <Typography variant="body2" fontWeight="bold" color="success.main">
              ${totalEarnings.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        {nextMilestone && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Next Milestone: {nextMilestone.target} Referrals
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(progress, 100)} 
              sx={{ mb: 1, height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" color="text.secondary">
              {nextMilestone.target - totalReferrals} more referrals to earn {nextMilestone.reward}
            </Typography>
          </Box>
        )}

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Commission Structure
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label="Level 1: 30%" color="primary" size="small" />
            <Chip label="Level 2: 3%" color="secondary" size="small" />
            <Chip label="Level 3: 2%" color="default" size="small" />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};