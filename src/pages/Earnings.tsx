import React, { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  MenuItem,
  Alert,
  Skeleton,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as BalanceIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useReferralEarnings, useClaimEarnings } from '../hooks/useApi';
import { EarningsByUser } from '../services/api';

interface ClaimDialogProps {
  open: boolean;
  onClose: () => void;
  unclaimedAmount: number;
}

const ClaimDialog: React.FC<ClaimDialogProps> = ({ open, onClose, unclaimedAmount }) => {
  const [tokenType, setTokenType] = useState('XP');
  const claimMutation = useClaimEarnings();

  const handleClaim = async () => {
    try {
      await claimMutation.mutateAsync(tokenType);
      onClose();
    } catch (error) {
      console.error('Claim failed:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Claim Earnings</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" gutterBottom>
            You are about to claim <strong>${unclaimedAmount.toFixed(2)}</strong> in earnings.
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
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleClaim}
          disabled={claimMutation.isPending}
        >
          {claimMutation.isPending ? 'Processing...' : 'Claim Now'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const Earnings: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);

  const startDateStr = startDate?.toISOString().split('T')[0];
  const endDateStr = endDate?.toISOString().split('T')[0];

  const { data: earningsData, isLoading, error, refetch } = useReferralEarnings(startDateStr, endDateStr);

  // Debug logging

  const handleExport = () => {
    if (!earningsData?.data) return;

    const csvData = [];
    csvData.push(['Level', 'User Email', 'User ID', 'Total Earned', 'Total Claimed', 'Total Unclaimed', 'Commission Count']);

    Object.entries(earningsData.data.earningsByLevel).forEach(([level, users]) => {
      users.forEach((user: EarningsByUser) => {
        csvData.push([
          level.replace('level', ''),
          user.sourceEmail || user.sourceUserEmail || '',
          user.sourceUserId,
          user.xpAmount || user.totalEarned || '0',
          user.totalClaimed || '0',
          user.xpAmount || user.totalUnclaimed || '0',
          (user.commissionCount || 0).toString(),
        ]);
      });
    });

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `earnings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setLevelFilter('all');
  };

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Earnings
        </Typography>
        <Box sx={{ mb: 4 }}>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={120} sx={{ mb: 2 }} />
          ))}
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Earnings
        </Typography>
        <Alert severity="error" sx={{ mb: 4 }}>
          Failed to load earnings data. Please try again later.
        </Alert>
      </Box>
    );
  }

  const earnings = earningsData?.data;
  
  // Safe parsing with fallback to 0
  const parseEarningsValue = (value: any): number => {
    if (value === null || value === undefined || value === '') return 0;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };
  
  const totalEarned = parseEarningsValue(earnings?.totalEarned);
  const totalClaimed = parseEarningsValue(earnings?.totalClaimed);
  const totalUnclaimed = parseEarningsValue(earnings?.totalUnclaimed);
  

  // Filter earnings by level
  const getFilteredEarnings = () => {
    if (!earnings) return [];
    
    const allEarnings: Array<EarningsByUser & { level: number }> = [];
    
    Object.entries(earnings.earningsByLevel).forEach(([level, users]) => {
      const levelNum = parseInt(level.replace('level', ''));
      
      if (levelFilter === 'all' || levelFilter === levelNum.toString()) {
        users.forEach(user => {
          allEarnings.push({ ...user, level: levelNum });
        });
      }
    });
    
    return allEarnings.sort((a, b) => parseEarningsValue(b.totalEarned) - parseEarningsValue(a.totalEarned));
  };

  const filteredEarnings = getFilteredEarnings();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Earnings Dashboard 💰
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your commission earnings and manage claims
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
          gap: 3,
          mb: 4 
        }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <MoneyIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5">${totalEarned.toFixed(2)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Earned
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <BalanceIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5">${totalClaimed.toFixed(2)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Claimed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ border: totalUnclaimed > 0 ? 2 : 1, borderColor: totalUnclaimed > 0 ? 'warning.main' : 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <TrendingUpIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5">${totalUnclaimed.toFixed(2)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Available to Claim
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5">{filteredEarnings.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Earning Sources
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Claim Button */}
        {totalUnclaimed > 0 && (
          <Alert severity="success" sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6">Ready to Claim!</Typography>
                <Typography variant="body2">
                  You have ${totalUnclaimed.toFixed(2)} available for claiming.
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                color="success"
                onClick={() => setClaimDialogOpen(true)}
                sx={{ ml: 2 }}
              >
                Claim Now
              </Button>
            </Box>
          </Alert>
        )}

        {/* Filters */}
        <Card sx={{ mb: 4 }}>
          <CardHeader 
            title="Filters & Controls"
            action={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Refresh Data">
                  <IconButton onClick={() => refetch()}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Export CSV">
                  <IconButton onClick={handleExport}>
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            }
          />
          <CardContent>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
              gap: 3,
              alignItems: 'center'
            }}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              />
              <TextField
                select
                label="Level Filter"
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                fullWidth
                size="small"
              >
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="1">Level 1 (30%)</MenuItem>
                <MenuItem value="2">Level 2 (3%)</MenuItem>
                <MenuItem value="3">Level 3 (2%)</MenuItem>
              </TextField>
              <Button 
                variant="outlined" 
                onClick={clearFilters}
                fullWidth
                startIcon={<FilterIcon />}
              >
                Clear Filters
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Earnings Table */}
        <Card>
          <CardHeader title="Earnings Breakdown" />
          <CardContent sx={{ p: 0 }}>
            {filteredEarnings.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <MoneyIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No earnings breakdown found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {levelFilter !== 'all' || startDate || endDate
                    ? 'Try adjusting your filters'
                    : 'You need referrals to see individual earnings breakdown. The table shows earnings from users you referred.'
                  }
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  💡 <strong>Tip:</strong> To see earnings here, you need to refer other users, then simulate trades for those referred users.
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Level</TableCell>
                      <TableCell align="right">Total Earned</TableCell>
                      <TableCell align="right">Claimed</TableCell>
                      <TableCell align="right">Unclaimed</TableCell>
                      <TableCell align="right">Commissions</TableCell>
                      <TableCell align="right">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredEarnings.map((earning, index) => {
                      // Handle the actual backend data structure
                      const earned = parseEarningsValue(earning.xpAmount || earning.totalEarned);
                      const claimed = parseEarningsValue(earning.totalClaimed || '0');
                      const unclaimed = parseEarningsValue(earning.xpAmount || earning.totalUnclaimed);
                      const hasUnclaimed = unclaimed > 0;
                      

                      return (
                        <TableRow key={earning.sourceUserId} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ width: 32, height: 32 }}>
                                <PersonIcon fontSize="small" />
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {earning.sourceEmail || earning.sourceUserEmail}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  ID: {earning.sourceUserId.slice(0, 8)}...
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={`Level ${earning.level}`}
                              color={earning.level === 1 ? 'primary' : earning.level === 2 ? 'secondary' : 'warning'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="medium">
                              ${earned.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" color="success.main">
                              ${claimed.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography 
                              variant="body2" 
                              color={hasUnclaimed ? 'warning.main' : 'text.secondary'}
                              fontWeight={hasUnclaimed ? 'medium' : 'normal'}
                            >
                              ${unclaimed.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {earning.commissionCount || 0}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            {earning.status === 'pending' ? (
                              <Chip label="Pending" color="warning" size="small" />
                            ) : earning.status === 'claimed' ? (
                              <Chip label="Claimed" color="success" size="small" />
                            ) : hasUnclaimed ? (
                              <Chip label="Claimable" color="warning" size="small" />
                            ) : (
                              <Chip label="Claimed" color="success" size="small" />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Claim Dialog */}
        <ClaimDialog
          open={claimDialogOpen}
          onClose={() => setClaimDialogOpen(false)}
          unclaimedAmount={totalUnclaimed}
        />
      </Box>
    </LocalizationProvider>
  );
};