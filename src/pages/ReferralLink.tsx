import React, { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Snackbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Share as ShareIcon,
  QrCode as QrCodeIcon,
  Link as LinkIcon,
  Refresh as RefreshIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthProvider';
import { useGenerateReferralCode, useUserStats, useReferralEarnings } from '../hooks/useApi';
import { QRCodeComponent } from '../components/referral/QRCodeComponent';
import { SocialShareButtons } from '../components/referral/SocialShareButtons';

export const ReferralLink: React.FC = () => {
  const { user, isLoading: userLoading } = useAuth();
  const generateCodeMutation = useGenerateReferralCode();
  const { data: userStats, isLoading: statsLoading } = useUserStats();
  const { isLoading: earningsLoading } = useReferralEarnings();
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const baseUrl = window.location.origin;
  const referralCode = user?.referralCode;
  const referralLink = referralCode ? `${baseUrl}/auth?ref=${referralCode}` : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleGenerateNewCode = async () => {
    try {
      await generateCodeMutation.mutateAsync();
    } catch (error) {
      console.error('Failed to generate new referral code:', error);
    }
  };

  const shareData = {
    title: 'Join me on Nika Trading Platform',
    text: `Join me on Nika and start earning referral commissions! Use my code: ${referralCode}`,
    url: referralLink,
  };

  // Calculate real stats from API data
  const totalReferrals = userStats?.totalReferrals || 0;
  const activeReferrals = userStats?.activeReferrals || 0;
  const totalEarnings = userStats?.totalEarnings || 0;
  const thisMonthEarnings = userStats?.thisMonthEarnings || 0;

  const referralStats = [
    { label: 'Total Referrals', value: totalReferrals.toString(), icon: '👥' },
    { label: 'Active Referrals', value: activeReferrals.toString(), icon: '✅' },
    { label: 'Total Earnings', value: `$${totalEarnings.toFixed(2)}`, icon: '💰' },
    { label: 'This Month', value: `$${thisMonthEarnings.toFixed(2)}`, icon: '📈' },
  ];

  const commissionRates = [
    { level: 'Level 1 (Direct)', rate: '30%', description: 'From users you directly refer' },
    { level: 'Level 2', rate: '3%', description: 'From your referrals\' referrals' },
    { level: 'Level 3', rate: '2%', description: 'From third-level referrals' },
  ];

  if (userLoading || statsLoading || earningsLoading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Referral Link & Sharing 🔗
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Loading your referral information...
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (!user || !referralCode) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Referral Link & Sharing 🔗
        </Typography>
        <Alert severity="error" sx={{ mb: 4 }}>
          <Typography variant="body1">
            Unable to load your referral information. Please try refreshing the page or contact support.
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Referral Link & Sharing 🔗
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Generate, customize, and share your referral links to start earning commissions
        </Typography>
      </Box>

      {/* Referral Stats */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
        gap: 2,
        mb: 4 
      }}>
        {referralStats.map((stat, index) => (
          <Card key={index}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ mb: 1 }}>
                {stat.icon}
              </Typography>
              <Typography variant="h5" gutterBottom>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
        gap: 4 
      }}>
        {/* Main Referral Link Section */}
        <Box>
          <Card sx={{ mb: 3 }}>
            <CardHeader 
              title="Your Referral Link"
              action={
                !referralCode ? (
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={handleGenerateNewCode}
                    disabled={generateCodeMutation.isPending}
                    size="small"
                  >
                    {generateCodeMutation.isPending ? 'Generating...' : 'Generate Code'}
                  </Button>
                ) : null
              }
            />
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Referral Code
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Chip 
                    label={referralCode} 
                    color="primary" 
                    size="medium"
                    sx={{ fontSize: '1rem', py: 2 }}
                  />
                  <Tooltip title="Copy Code">
                    <IconButton 
                      onClick={() => navigator.clipboard.writeText(referralCode)}
                      color="primary"
                    >
                      <CopyIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Complete Referral Link
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    value={referralLink}
                    InputProps={{
                      readOnly: true,
                      startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                    variant="outlined"
                    size="small"
                  />
                  <Tooltip title="Copy Link">
                    <IconButton 
                      onClick={handleCopyLink}
                      color="primary"
                      sx={{ minWidth: 48 }}
                    >
                      {copied ? <CheckIcon /> : <CopyIcon />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Share this link with friends and family. When they sign up using your link, 
                  you'll earn commissions from their trading activity!
                </Typography>
              </Alert>

              {referralCode && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    ✅ Your referral code is active and ready to share!
                  </Typography>
                </Alert>
              )}

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<QrCodeIcon />}
                  onClick={() => setShowQR(!showQR)}
                >
                  {showQR ? 'Hide QR Code' : 'Show QR Code'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ShareIcon />}
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share(shareData);
                    } else {
                      handleCopyLink();
                    }
                  }}
                >
                  Share Link
                </Button>
              </Box>

              {/* QR Code */}
              {showQR && (
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <QRCodeComponent 
                    value={referralLink}
                    size={200}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Scan to join with your referral code
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Social Sharing */}
          <Card>
            <CardHeader title="Share on Social Media" />
            <CardContent>
              <SocialShareButtons 
                referralLink={referralLink}
                referralCode={referralCode}
              />
            </CardContent>
          </Card>
        </Box>

        {/* Sidebar */}
        <Box>
          {/* Commission Structure */}
          <Card sx={{ mb: 3 }}>
            <CardHeader title="Commission Structure" />
            <CardContent>
              <List dense>
                {commissionRates.map((rate, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Box sx={{ 
                        width: 32, 
                        height: 32, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.main', 
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.875rem',
                        fontWeight: 'bold'
                      }}>
                        {index + 1}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2">
                            {rate.level}
                          </Typography>
                          <Chip 
                            label={rate.rate} 
                            color="primary" 
                            size="small"
                          />
                        </Box>
                      }
                      secondary={rate.description}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card>
            <CardHeader title="How It Works" />
            <CardContent>
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Box sx={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      bgcolor: 'success.main', 
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem'
                    }}>
                      1
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary="Share Your Link"
                    secondary="Send your referral link to friends and family"
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Box sx={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      bgcolor: 'success.main', 
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem'
                    }}>
                      2
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary="They Sign Up"
                    secondary="They create an account using your referral link"
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Box sx={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      bgcolor: 'success.main', 
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem'
                    }}>
                      3
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary="You Earn"
                    secondary="Earn commissions from their trading activity"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        message="Referral link copied to clipboard!"
      />
    </Box>
  );
};