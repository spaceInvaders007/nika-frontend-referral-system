import React, { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  Pagination,
  Skeleton,
  Alert,
  IconButton,
  Tooltip,
  Collapse,
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  ExpandMore as ExpandMoreIcon,
  AccountTree as TreeIcon,
} from '@mui/icons-material';
import { useReferralNetwork } from '../hooks/useApi';
import { ReferralUser } from '../services/api';

interface NetworkNodeProps {
  user: ReferralUser;
  level: number;
  isExpanded: boolean;
  onToggleExpand: (userId: string) => void;
  expandedNodes: Set<string>;
}

const NetworkNode: React.FC<NetworkNodeProps> = ({
  user,
  level,
  isExpanded,
  onToggleExpand,
  expandedNodes,
}) => {
  const levelColors = {
    1: 'primary',
    2: 'secondary', 
    3: 'warning',
  } as const;

  const levelCommissions = {
    1: '30%',
    2: '3%',
    3: '2%',
  } as const;

  const hasChildren = user.referees && user.referees.length > 0;

  return (
    <Card 
      sx={{ 
        mb: 2, 
        ml: level * 3,
        border: level === 1 ? 2 : 1,
        borderColor: level === 1 ? 'primary.main' : 'divider',
        position: 'relative',
        '&::before': level > 1 ? {
          content: '""',
          position: 'absolute',
          left: -24,
          top: '50%',
          width: 20,
          height: 1,
          bgcolor: 'divider',
        } : {},
      }}
    >
      <CardContent sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: `${levelColors[user.level as keyof typeof levelColors]}.main` }}>
              <PersonIcon />
            </Avatar>
            
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="h6" component="div">
                  {user.email}
                </Typography>
                <Chip 
                  label={`Level ${user.level}`}
                  color={levelColors[user.level as keyof typeof levelColors]}
                  size="small"
                />
                <Chip 
                  label={`${levelCommissions[user.level as keyof typeof levelCommissions]} Commission`}
                  variant="outlined"
                  size="small"
                />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <EmailIcon fontSize="small" />
                  <Typography variant="body2">
                    Code: {user.referralCode}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarIcon fontSize="small" />
                  <Typography variant="body2">
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                {hasChildren && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TreeIcon fontSize="small" />
                    <Typography variant="body2">
                      {user.referees?.length || 0} referral{(user.referees?.length || 0) !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          {hasChildren && (
            <Tooltip title={isExpanded ? 'Collapse' : 'Expand'}>
              <IconButton 
                onClick={() => onToggleExpand(user.id)}
                sx={{ 
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Collapse in={isExpanded && hasChildren}>
          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            {user.referees?.map((referee) => (
              <NetworkNode
                key={referee.id}
                user={referee}
                level={level + 1}
                isExpanded={expandedNodes.has(referee.id)}
                onToggleExpand={onToggleExpand}
                expandedNodes={expandedNodes}
              />
            )) || []}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export const Network: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const limit = 10;

  const { data: networkData, isLoading, error } = useReferralNetwork(page, limit);


  const handleToggleExpand = (userId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleExpandAll = () => {
    if (!referees) return;
    
    const allIds = new Set<string>();
    const collectIds = (users: ReferralUser[]) => {
      users.forEach(user => {
        allIds.add(user.id);
        if (user.referees) {
          collectIds(user.referees);
        }
      });
    };
    collectIds(referees);
    setExpandedNodes(allIds);
  };

  const handleCollapseAll = () => {
    setExpandedNodes(new Set());
  };

  // Filter referees based on search term
  // Backend returns data in data.data array, not data.data.referees
  const referees = networkData?.data?.data || [];
  const filteredReferees = referees.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.referralCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Referral Network
        </Typography>
        <Box sx={{ mb: 4 }}>
          {[...Array(3)].map((_, i) => (
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
          Referral Network
        </Typography>
        <Alert severity="error" sx={{ mb: 4 }}>
          Failed to load referral network. Please try again later.
        </Alert>
      </Box>
    );
  }

  const totalReferrals = referees.length;
  const totalPages = Math.ceil(totalReferrals / limit);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Referral Network 🌳
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and view your 3-level referral network
        </Typography>
      </Box>

      {/* Network Overview */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
        gap: 3,
        mb: 4 
      }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="h5">{totalReferrals}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Referrals
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                <TrendingUpIcon />
              </Avatar>
              <Box>
                <Typography variant="h5">
                  {referees.filter(u => u.level === 1).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Level 1 (30%)
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'warning.main' }}>
                <TrendingUpIcon />
              </Avatar>
              <Box>
                <Typography variant="h5">
                  {referees.filter(u => u.level === 2).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Level 2 (3%)
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'error.main' }}>
                <TrendingUpIcon />
              </Avatar>
              <Box>
                <Typography variant="h5">
                  {referees.filter(u => u.level === 3).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Level 3 (2%)
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Search and Controls */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search by email or referral code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1, minWidth: 300 }}
        />
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip 
            label="Expand All" 
            onClick={handleExpandAll}
            clickable
            variant="outlined"
          />
          <Chip 
            label="Collapse All" 
            onClick={handleCollapseAll}
            clickable
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Your Referral Code - Backend doesn't return user object, so we'll show a generic message */}
      <Card sx={{ mb: 4, bgcolor: 'primary.50', border: 2, borderColor: 'primary.main' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" color="primary.main">
                Your Referral Network
              </Typography>
              <Typography variant="body1">
                Total Referrals: <strong>{totalReferrals}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Level 0 - Network Root
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Network Tree */}
      <Box>
        {filteredReferees.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <TreeIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {searchTerm ? 'No matching referrals found' : 'No referrals yet'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Share your referral link to start building your network'
                }
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <>
            {filteredReferees.map((user) => (
              <NetworkNode
                key={user.id}
                user={user}
                level={1}
                isExpanded={expandedNodes.has(user.id)}
                onToggleExpand={handleToggleExpand}
                expandedNodes={expandedNodes}
              />
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, newPage) => setPage(newPage)}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};