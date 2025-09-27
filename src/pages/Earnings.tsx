import React from 'react';
import { Typography, Box } from '@mui/material';

export const Earnings: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Earnings
      </Typography>
      <Typography variant="body1" color="text.secondary">
        View your earnings and commission history here.
      </Typography>
    </Box>
  );
};