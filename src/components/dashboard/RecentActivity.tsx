import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Box,
  Avatar,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material';

interface ActivityItem {
  id: string;
  type: 'referral' | 'commission' | 'trade' | 'claim';
  title: string;
  subtitle: string;
  amount?: string;
  timestamp: string;
  user?: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'referral',
    title: 'New referral joined',
    subtitle: 'john.doe@example.com signed up with your code',
    timestamp: '2 hours ago',
    user: 'John Doe',
  },
  {
    id: '2',
    type: 'commission',
    title: 'Commission earned',
    subtitle: 'From Alice Smith trading activity',
    amount: '+$24.50',
    timestamp: '5 hours ago',
  },
  {
    id: '3',
    type: 'trade',
    title: 'Level 2 referral trade',
    subtitle: 'Bob Wilson completed a trade',
    amount: '+$3.20',
    timestamp: '1 day ago',
  },
  {
    id: '4',
    type: 'claim',
    title: 'Commissions claimed',
    subtitle: 'Successfully claimed to wallet',
    amount: '-$156.80',
    timestamp: '2 days ago',
  },
  {
    id: '5',
    type: 'referral',
    title: 'New referral joined',
    subtitle: 'sarah.jones@example.com signed up with your code',
    timestamp: '3 days ago',
    user: 'Sarah Jones',
  },
];

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'referral':
      return <PersonAddIcon />;
    case 'commission':
      return <MoneyIcon />;
    case 'trade':
      return <TrendingUpIcon />;
    case 'claim':
      return <AccountBalanceIcon />;
    default:
      return <MoneyIcon />;
  }
};

const getActivityColor = (type: ActivityItem['type']) => {
  switch (type) {
    case 'referral':
      return 'primary';
    case 'commission':
      return 'success';
    case 'trade':
      return 'info';
    case 'claim':
      return 'warning';
    default:
      return 'default';
  }
};

export const RecentActivity: React.FC = () => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Recent Activity"
        action={
          <Chip
            label={`${mockActivities.length} activities`}
            size="small"
            color="primary"
            variant="outlined"
          />
        }
      />
      <CardContent sx={{ pt: 0 }}>
        <List sx={{ width: '100%' }}>
          {mockActivities.map((activity, index) => (
            <ListItem
              key={activity.id}
              sx={{
                px: 0,
                borderBottom: index < mockActivities.length - 1 ? '1px solid' : 'none',
                borderColor: 'divider',
                py: 2,
              }}
            >
              <ListItemIcon>
                <Avatar
                  sx={{
                    bgcolor: `${getActivityColor(activity.type)}.light`,
                    color: `${getActivityColor(activity.type)}.main`,
                    width: 40,
                    height: 40,
                  }}
                >
                  {getActivityIcon(activity.type)}
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ component: 'div' }}
                secondaryTypographyProps={{ component: 'div' }}
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" component="div">
                      {activity.title}
                    </Typography>
                    {activity.amount && (
                      <Typography
                        variant="subtitle2"
                        component="div"
                        sx={{
                          color: activity.amount.startsWith('+') ? 'success.main' : 'warning.main',
                          fontWeight: 'bold',
                        }}
                      >
                        {activity.amount}
                      </Typography>
                    )}
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary" component="div">
                      {activity.subtitle}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" component="div">
                      {activity.timestamp}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};
