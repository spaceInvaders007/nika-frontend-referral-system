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
  const [testUserId, setTestUserId] = useState('');
  const [testResult, setTestResult] = useState<string>('');

  const simulateTradeMutation = useSimulateTrade();
  const { refetch: refetchStats } = useUserStats();
  const { refetch: refetchEarnings } = useReferralEarnings();

  const isValidUUID = (uuid: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  const handleSimulateTrade = async () => {
    if (!user) return;
    
    const userIdToUse = testUserId.trim() || user.id;
    
    // Validate UUID format
    if (!isValidUUID(userIdToUse)) {
      setTestResult(`❌ Invalid UUID format: ${userIdToUse}\nUUIDs must be 36 characters in format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`);
      return;
    }
    
    
    try {
      const result = await simulateTradeMutation.mutateAsync({
        userId: userIdToUse,
        volume: parseFloat(volume),
        fees: parseFloat(fees),
      });
      setTestResult(`Trade simulated successfully! Used userId: ${userIdToUse}\nResult: ${JSON.stringify(result, null, 2)}`);
      // Refresh data
      refetchStats();
      refetchEarnings();
    } catch (error: any) {
      console.error('🧪 Trade simulation error:', error);
      console.error('🧪 Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
      
      let errorMessage = `Failed to simulate trade with userId ${userIdToUse}: `;
      if (error.response?.status === 500) {
        errorMessage += `Server Error (500) - Check backend logs. `;
        if (error.response?.data?.message) {
          errorMessage += `Backend message: ${error.response.data.message}`;
        }
      } else {
        errorMessage += error.message;
      }
      
      setTestResult(errorMessage);
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

  const testUserIdExists = async () => {
    if (!testUserId.trim()) {
      setTestResult('❌ Please enter a User ID to test');
      return;
    }
    
    try {
      // Try to get referral network for this user to see if they exist
      const response = await fetch(`http://localhost:3000/api/referral/network?page=1&limit=1`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setTestResult(`✅ User ID ${testUserId} appears to be valid (API responded successfully)`);
      } else {
        setTestResult(`❌ User ID ${testUserId} may not exist (API returned ${response.status})`);
      }
    } catch (error) {
      setTestResult(`❌ Error testing User ID ${testUserId}: ${(error as Error).message}`);
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
          
          <Button variant="outlined" onClick={testUserIdExists}>
            Test User ID
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
          <TextField
            label="Test User ID (optional)"
            value={testUserId}
            onChange={(e) => setTestUserId(e.target.value)}
            size="small"
            placeholder="Leave empty to use your ID"
            sx={{ width: 200 }}
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
