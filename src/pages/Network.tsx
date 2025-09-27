import React from 'react';
import { Typography, Box } from '@mui/material';

export const Network: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Referral Network
      </Typography>
      <Typography variant="body1" color="text.secondary">
        View your 3-level referral network and their activity
      </Typography>
    </Box>
  );
};
