import React, { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Avatar,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Person as PersonIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Key as KeyIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthProvider';
import { useGenerateReferralCode } from '../hooks/useApi';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

export const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const generateCodeMutation = useGenerateReferralCode();
  
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Form states
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    referralAlerts: true,
    claimReminders: true,
  });

  const handleSaveProfile = () => {
    setIsEditing(false);
  };

  const handleGenerateNewCode = async () => {
    try {
      await generateCodeMutation.mutateAsync();
    } catch (error) {
      console.error('Failed to generate new referral code:', error);
    }
  };

  const handleDeleteAccount = () => {
    setDeleteDialogOpen(false);
    logout();
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
      <Typography variant="h4" gutterBottom>
          Account Settings ⚙️
      </Typography>
      <Typography variant="body1" color="text.secondary">
          Manage your account preferences and security settings
        </Typography>
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab icon={<PersonIcon />} label="Profile" />
            <Tab icon={<SecurityIcon />} label="Security" />
            <Tab icon={<NotificationsIcon />} label="Notifications" />
            <Tab icon={<KeyIcon />} label="API Keys" />
          </Tabs>
        </Box>

        {/* Profile Tab */}
        <TabPanel value={activeTab} index={0}>
          <CardContent>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 4
            }}>
              <Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Update your personal details and preferences
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
                    <PersonIcon sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{user?.name || 'User'}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Member since {new Date().toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    disabled={!isEditing}
                  />
                  <TextField
                    fullWidth
                    label="Email Address"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={!isEditing}
                    type="email"
                  />
                </Box>

                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  {isEditing ? (
                    <>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveProfile}
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  )}
                </Box>
              </Box>

              <Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Referral Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your unique referral code and link
                  </Typography>
                </Box>

                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      Your Referral Code
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Chip 
                        label={user?.referralCode || 'Loading...'} 
                        color="primary" 
                        size="medium"
                      />
                      <IconButton 
                        size="small"
                        onClick={() => user?.referralCode && navigator.clipboard.writeText(user.referralCode)}
                        disabled={!user?.referralCode}
                      >
                        <CopyIcon />
                      </IconButton>
                    </Box>
                    {!user?.referralCode && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleGenerateNewCode}
                        disabled={generateCodeMutation.isPending}
                      >
                        {generateCodeMutation.isPending ? 'Generating...' : 'Generate Code'}
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      Cashback Benefits
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Trading Fee Cashback:
                      </Typography>
                      <Chip 
                        label={`${((user?.cashbackPercentage || 0) * 100).toFixed(1)}%`}
                        color={user?.cashbackPercentage ? "success" : "default"}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {user?.cashbackPercentage 
                        ? "You receive 10% of your trading fees back as cashback thanks to your referrer!"
                        : "Sign up with a referral code to get 10% of your trading fees back as cashback."
                      }
                    </Typography>
                  </CardContent>
                </Card>

                <Alert severity="info">
                  <Typography variant="body2">
                    Your referral code is unique and permanent. Once generated, it cannot be changed.
                  </Typography>
                </Alert>
              </Box>
            </Box>
          </CardContent>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={activeTab} index={1}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Security Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Manage your account security and authentication preferences
            </Typography>

            <List>
              <ListItem>
                <ListItemIcon>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Two-Factor Authentication"
                  secondary="Add an extra layer of security to your account"
                />
                <ListItemSecondaryAction>
                  <Switch defaultChecked={false} />
                </ListItemSecondaryAction>
              </ListItem>
              
              <Divider />
              
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Login Alerts"
                  secondary="Get notified when someone logs into your account"
                />
                <ListItemSecondaryAction>
                  <Switch defaultChecked={true} />
                </ListItemSecondaryAction>
              </ListItem>
            </List>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" color="error" gutterBottom>
                Danger Zone
              </Typography>
              <Card variant="outlined" sx={{ borderColor: 'error.main' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Delete Account
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </CardContent>
        </TabPanel>

        {/* Notifications Tab */}
        <TabPanel value={activeTab} index={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Notification Preferences
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose how you want to be notified about account activity
            </Typography>

            <List>
              <ListItem>
                <ListItemText
                  primary="Email Notifications"
                  secondary="Receive notifications via email"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: e.target.checked
                    })}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem>
                <ListItemText
                  primary="Weekly Reports"
                  secondary="Get weekly summaries of your referral performance"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notificationSettings.weeklyReports}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      weeklyReports: e.target.checked
                    })}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem>
                <ListItemText
                  primary="Referral Alerts"
                  secondary="Get notified when someone uses your referral code"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notificationSettings.referralAlerts}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      referralAlerts: e.target.checked
                    })}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </CardContent>
        </TabPanel>

        {/* API Keys Tab */}
        <TabPanel value={activeTab} index={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              API Keys
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Manage API keys for programmatic access to your account
            </Typography>

            <Alert severity="info">
              <Typography variant="body2">
                API key management functionality will be available in a future update.
                Contact support if you need programmatic access to your account.
              </Typography>
            </Alert>
          </CardContent>
        </TabPanel>
      </Card>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle color="error">Delete Account</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete your account? This action will:
          </Typography>
          <Box component="ul" sx={{ mt: 2, pl: 2 }}>
            <li>Permanently delete all your data</li>
            <li>Remove your referral network</li>
            <li>Cancel any pending earnings</li>
            <li>Invalidate your referral code</li>
          </Box>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            This action cannot be undone.
      </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            color="error" 
            variant="contained"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};