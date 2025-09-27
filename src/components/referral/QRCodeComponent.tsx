import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import QRCode from 'qrcode';

interface QRCodeComponentProps {
  value: string;
  size?: number;
}

export const QRCodeComponent: React.FC<QRCodeComponentProps> = ({ 
  value, 
  size = 200 
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateQR = async () => {
      try {
        setLoading(true);
        const url = await QRCode.toDataURL(value, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        });
        setQrCodeUrl(url);
      } catch (error) {
        console.error('Error generating QR code:', error);
      } finally {
        setLoading(false);
      }
    };

    if (value) {
      generateQR();
    }
  }, [value, size]);

  const downloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = 'referral-qr-code.png';
      link.href = qrCodeUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={size}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          QR Code
        </Typography>
        <Box sx={{ mb: 2 }}>
          {qrCodeUrl && (
            <img
              src={qrCodeUrl}
              alt="Referral QR Code"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          )}
        </Box>
        <Button variant="outlined" onClick={downloadQR} disabled={!qrCodeUrl}>
          Download QR Code
        </Button>
      </CardContent>
    </Card>
  );
};