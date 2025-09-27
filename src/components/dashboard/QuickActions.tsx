import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Box,
} from '@mui/material';
import {
  Share as ShareIcon,
  AccountBalance as ClaimIcon,
  People as NetworkIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Share Referral Link',
      icon: <ShareIcon />,
      color: 'primary' as const,
      onClick: () => navigate('/referral'),
    },
    {
      label: 'View Network',
      icon: <NetworkIcon />,
      color: 'secondary' as const,
      onClick: () => navigate('/network'),
    },
    {
      label: 'View Earnings',
      icon: <AnalyticsIcon />,
      color: 'info' as const,
      onClick: () => navigate('/earnings'),
    },
    {
      label: 'Claim Rewards',
      icon: <ClaimIcon />,
      color: 'success' as const,
      onClick: () => {
        alert('Claim functionality will be implemented when backend is integrated!');
      },
    },
  ];

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="Quick Actions" />
      <CardContent>
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          {actions.map((action, index) => (
            <Button
              key={index}
              fullWidth
              variant="outlined"
              color={action.color}
              startIcon={action.icon}
              onClick={action.onClick}
              sx={{
                py: 1.5,
                justifyContent: 'flex-start',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  transition: 'transform 0.2s ease-in-out',
                },
              }}
            >
              {action.label}
            </Button>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
