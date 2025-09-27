import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const mockData = [
  { name: 'Jan', earnings: 120, referrals: 5 },
  { name: 'Feb', earnings: 180, referrals: 8 },
  { name: 'Mar', earnings: 240, referrals: 12 },
  { name: 'Apr', earnings: 320, referrals: 15 },
  { name: 'May', earnings: 280, referrals: 18 },
  { name: 'Jun', earnings: 380, referrals: 22 },
  { name: 'Jul', earnings: 450, referrals: 28 },
];

export const EarningsChart: React.FC = () => {
  const theme = useTheme();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 2,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            boxShadow: 2,
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography
              key={index}
              variant="body2"
              sx={{ color: entry.color }}
            >
              {entry.name === 'earnings' ? 'Earnings' : 'Referrals'}: {entry.value}
              {entry.name === 'earnings' ? ' USDC' : ' users'}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Earnings Trend"
        subheader="Last 7 months performance"
      />
      <CardContent>
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke={theme.palette.primary.main}
                strokeWidth={3}
                dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: theme.palette.primary.main, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="referrals"
                stroke={theme.palette.secondary.main}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: theme.palette.secondary.main, strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 3,
                bgcolor: theme.palette.primary.main,
                borderRadius: 1,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Earnings (USDC)
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 3,
                bgcolor: theme.palette.secondary.main,
                borderRadius: 1,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Referrals Count
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
