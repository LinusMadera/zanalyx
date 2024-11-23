import { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { MonitorHeart, Analytics, AccountTree, Notifications } from '@mui/icons-material';
import GradientBackground from '../components/GradientBackground';
import WhaleTracking from '../components/WhaleTracking';
import Alerts from '../components/Alerts';
import { Chip } from '@mui/material';
import PageAnalytics from './PageAnalytics';
const DashboardContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  maxWidth: '80% !important',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2)
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  backgroundColor: 'rgba(255, 255, 255, 0.4)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'transform 0.3s ease-in-out, outline 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
  '&.selected': {
    outline: '2px solid rgba(255, 255, 255, 0.5)',
  },
}));

type DashboardItem = {
  title: string;
  icon: JSX.Element;
  description: string;
  disabled?: boolean;
};

const MainAppPage = () => {
  const [btcPrice, setBtcPrice] = useState<string>('');
  const [ethPrice, setEthPrice] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<string>('Whale Tracking');

  useEffect(() => {
    setBtcPrice('$30,000');
    setEthPrice('$2,000');
  }, []);

  const dashboardItems: DashboardItem[] = [
    { title: 'Whale Tracking', icon: <MonitorHeart sx={{ fontSize: 40, color: '#1976d2' }} />, description: 'Monitor large-scale crypto movements' },
    { title: 'Alerts', icon: <Notifications sx={{ fontSize: 40, color: '#ff9800' }} />, description: 'Get notifications for whale activities' },
    { title: 'Analytics', icon: <Analytics sx={{ fontSize: 40, color: '#9c27b0' }} />, description: 'Get insights into your crypto portfolio' },
    { title: 'Multi-chain', icon: <AccountTree sx={{ fontSize: 40, color: '#4caf50' }} />, description: 'Coming soon', disabled: true },
  ];

  const renderSelectedComponent = () => {
    switch (selectedItem) {
      case 'Whale Tracking':
        return <WhaleTracking />;
      case 'Analytics':
        return <PageAnalytics />;
      case 'Multi-chain':
        return <h1>Multi-chain</h1>;
      case 'Alerts':
        return <Alerts />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      <GradientBackground />
      <DashboardContainer maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h2" sx={{ fontFamily: 'Lexend Mega, sans-serif', fontWeight: 800 }}>
            Dashboard
          </Typography>
          <Box>
            <Chip
              label={<Typography variant="h6"><span style={{ color: '#f7931a' }}>BTC:</span> {btcPrice}</Typography>}
              sx={{ mr: 2, backgroundColor: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(10px)' }}
            />
            <Chip
              label={<Typography variant="h6"><span style={{ color: '#3c3c3d' }}>ETH:</span> {ethPrice}</Typography>}
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(10px)' }}
            />
          </Box>
        </Box>
        <Grid container spacing={4}>
          {dashboardItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard
                  onClick={() => !item.disabled && setSelectedItem(item.title)}
                  className={selectedItem === item.title ? 'selected' : ''}
                  sx={{ opacity: item.disabled ? 0.5 : 1, cursor: item.disabled ? 'not-allowed' : 'pointer' }}
                >
                  {item.icon}
                  <Typography variant="h6" component="h3" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </GlassCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 4 }}>
          {renderSelectedComponent()}
        </Box>
      </DashboardContainer>
    </Box>
  );
};

export default MainAppPage;