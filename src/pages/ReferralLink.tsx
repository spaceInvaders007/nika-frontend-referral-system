import React from 'react';
import { Typography, Box } from '@mui/material';

export const ReferralLink: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Referral Link
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Generate and share your referral links here.
      </Typography>
    </Box>
  );
};