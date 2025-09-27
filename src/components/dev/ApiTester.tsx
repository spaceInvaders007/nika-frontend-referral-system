import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Alert,
  Divider,
} from '@mui/material';
import { useSimulateTrade, useUserStats, useReferralEarnings } from '../../hooks/useApi';
import { useAuth } from '../../contexts/AuthProvider';

export const ApiTester: React.FC = () => {
  const { user } = useAuth();
  const [volume, setVolume] = useState('1000');
  const [fees, setFees] = useState('10');
  const [testResult, setTestResult] = useState<string>('');

  const simulateTradeMutation = useSimulateTrade();
  const { refetch: refetchStats } = useUserStats();
  const { refetch: refetchEarnings } = useReferralEarnings();

  const handleSimulateTrade = async () => {
    if (!user) return;
    
    console.log('🧪 Trade simulation - User ID:', user.id);
    console.log('🧪 Trade simulation - Full user object:', user);
    
    try {
      await simulateTradeMutation.mutateAsync({
        userId: user.id,
        volume: parseFloat(volume),
        fees: parseFloat(fees),
      });
      setTestResult(`Trade simulated successfully! Used userId: ${user.id}`);
      // Refresh data
      refetchStats();
      refetchEarnings();
    } catch (error) {
      setTestResult(`Failed to simulate trade with userId ${user.id}: ` + (error as Error).message);
    }
  };

  const testApiConnection = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/health');
      if (response.ok) {
        setTestResult('✅ Backend API is connected and running!');
      } else {
        setTestResult('❌ Backend API responded with error: ' + response.status);
      }
    } catch (error) {
      setTestResult('❌ Cannot connect to backend API. Make sure it\'s running on port 3000.\n\n🔧 For now, the frontend is using mock data so you can test all features!');
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card sx={{ mb: 4, border: '2px solid #ff9800' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="warning.main">
          🔧 Development API Tester
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Test your backend API integration (only visible in development)
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Button variant="outlined" onClick={testApiConnection}>
            Test API Connection
          </Button>
          
          <Button variant="outlined" onClick={() => refetchStats()}>
            Refresh Stats
          </Button>
          
          <Button variant="outlined" onClick={() => refetchEarnings()}>
            Refresh Earnings
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="subtitle2" gutterBottom>
          Simulate Trading Activity
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            label="Volume"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            size="small"
            type="number"
            sx={{ width: 120 }}
          />
          <TextField
            label="Fees"
            value={fees}
            onChange={(e) => setFees(e.target.value)}
            size="small"
            type="number"
            sx={{ width: 120 }}
          />
          <Button
            variant="contained"
            onClick={handleSimulateTrade}
            disabled={simulateTradeMutation.isPending}
            size="small"
          >
            {simulateTradeMutation.isPending ? 'Simulating...' : 'Simulate Trade'}
          </Button>
        </Box>

        {testResult && (
          <Alert 
            severity={testResult.includes('✅') ? 'success' : testResult.includes('❌') ? 'error' : 'info'}
            sx={{ mt: 2 }}
          >
            {testResult}
          </Alert>
        )}

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Current API URL: {process.env.REACT_APP_API_URL || 'http://localhost:3000'}
        </Typography>
      </CardContent>
    </Card>
  );
};
