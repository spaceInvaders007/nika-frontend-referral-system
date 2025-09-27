import React from 'react';
import { Typography, Box } from '@mui/material';

export const Dashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Welcome to your referral dashboard! This page will show your stats and recent activity.
      </Typography>
    </Box>
  );
};