import React, { useState, useEffect } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref');

  useEffect(() => {
    if (referralCode) {
      setIsLogin(false);
    }
  }, [referralCode]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom textAlign="center" sx={{ mb: 4 }}>
          Referral System
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
          Earn commissions from your referral network's trading activity
        </Typography>

        {isLogin ? (
          <LoginForm
            onSwitchToRegister={() => setIsLogin(false)}
            referralCode={referralCode || undefined}
          />
        ) : (
          <RegisterForm
            onSwitchToLogin={() => setIsLogin(true)}
            referralCode={referralCode || undefined}
          />
        )}
      </Box>
    </Container>
  );
};
