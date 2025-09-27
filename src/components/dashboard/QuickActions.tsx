import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Share as ShareIcon,
  AccountBalance as ClaimIcon,
  People as NetworkIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useReferralEarnings, useClaimEarnings } from '../../hooks/useApi';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);
  const [tokenType, setTokenType] = useState('XP');
  
  const { data: earningsData } = useReferralEarnings();
  const claimMutation = useClaimEarnings();

  const totalUnclaimed = parseFloat(earningsData?.data?.totalUnclaimed || '0');

  const handleClaim = async () => {
    try {
      await claimMutation.mutateAsync(tokenType);
      setClaimDialogOpen(false);
    } catch (error) {
      console.error('Claim failed:', error);
    }
  };

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
      label: totalUnclaimed > 0 ? `Claim $${totalUnclaimed.toFixed(2)}` : 'Claim Rewards',
      icon: <ClaimIcon />,
      color: totalUnclaimed > 0 ? 'success' as const : 'inherit' as const,
      onClick: () => {
        if (totalUnclaimed > 0) {
          setClaimDialogOpen(true);
        } else {
          navigate('/earnings');
        }
      },
      disabled: totalUnclaimed === 0,
    },
  ];

  return (
    <>
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
                disabled={action.disabled}
                sx={{
                  py: 1.5,
                  justifyContent: 'flex-start',
                  '&:hover': {
                    transform: action.disabled ? 'none' : 'translateY(-2px)',
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

      {/* Claim Dialog */}
      <Dialog open={claimDialogOpen} onClose={() => setClaimDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Claim Earnings</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" gutterBottom>
              You are about to claim <strong>${totalUnclaimed.toFixed(2)}</strong> in earnings.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose the token type for your claim:
            </Typography>
          </Box>

          <FormControl fullWidth>
            <InputLabel>Token Type</InputLabel>
            <Select
              value={tokenType}
              onChange={(e) => setTokenType(e.target.value)}
              label="Token Type"
            >
              <MenuItem value="XP">XP (Experience Points)</MenuItem>
              <MenuItem value="USDC">USDC (USD Coin)</MenuItem>
              <MenuItem value="ETH">ETH (Ethereum)</MenuItem>
            </Select>
          </FormControl>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Claims are processed on-chain and may take a few minutes to complete.
              You will receive a transaction hash for tracking.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClaimDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleClaim}
            disabled={claimMutation.isPending}
          >
            {claimMutation.isPending ? 'Processing...' : 'Claim Now'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
