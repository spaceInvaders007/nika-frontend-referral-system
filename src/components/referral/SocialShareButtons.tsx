import React from 'react';
import {
  Box,
  Button,
  Typography,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  LinkedIn,
  WhatsApp,
  Telegram,
} from '@mui/icons-material';

interface SocialShareButtonsProps {
  url: string;
  message?: string;
}

export const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ 
  url, 
  message = "Join me on this amazing referral program!" 
}) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedMessage = encodeURIComponent(message);

  const shareLinks = [
    {
      name: 'Twitter',
      icon: <Twitter />,
      url: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`,
      color: '#1DA1F2',
    },
    {
      name: 'Facebook',
      icon: <Facebook />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: '#4267B2',
    },
    {
      name: 'LinkedIn',
      icon: <LinkedIn />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: '#0077B5',
    },
    {
      name: 'WhatsApp',
      icon: <WhatsApp />,
      url: `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`,
      color: '#25D366',
    },
    {
      name: 'Telegram',
      icon: <Telegram />,
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedMessage}`,
      color: '#0088CC',
    },
  ];

  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Share on Social Media
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {shareLinks.map((platform) => (
          <Button
            key={platform.name}
            variant="outlined"
            startIcon={platform.icon}
            onClick={() => handleShare(platform.url)}
            sx={{
              borderColor: platform.color,
              color: platform.color,
              '&:hover': {
                backgroundColor: platform.color,
                color: 'white',
                borderColor: platform.color,
              },
            }}
          >
            {platform.name}
          </Button>
        ))}
      </Box>
    </Box>
  );
};