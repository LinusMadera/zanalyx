import { useState } from 'react';
import { Box, Typography, Paper, Switch, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const AlertCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: `${theme.palette.background.paper}80`,
}));

const GlassButton = styled(ToggleButton)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.3)',
  backdropFilter: 'blur(5px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.text.primary,
  padding: '8px 16px',
  fontSize: '1rem',
  fontWeight: 'bold',
  '&.Mui-selected': {
    background: 'rgba(0, 0, 0, 0.7)',
    color: theme.palette.common.white,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: theme.shape.borderRadius,
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.primary,
  },
  '& .MuiInputBase-input': {
    color: theme.palette.text.primary,
  },
}));

const Alerts = () => {
  const [emailNetwork, setEmailNetwork] = useState('ALL');
  const [browserNetwork, setBrowserNetwork] = useState('ALL');
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [browserAlerts, setBrowserAlerts] = useState(false);
  const [emailMinAmount, setEmailMinAmount] = useState('10');
  const [browserMinAmount, setBrowserMinAmount] = useState('0');

  const handleEmailNetworkChange = (_: React.MouseEvent<HTMLElement>, newNetwork: string) => {
    setEmailNetwork(newNetwork);
  };

  const handleBrowserNetworkChange = (_: React.MouseEvent<HTMLElement>, newNetwork: string) => {
    setBrowserNetwork(newNetwork);
  };

  const handleEmailMinAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setEmailMinAmount(value < 10 ? '10' : e.target.value);
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontFamily: 'Lexend Mega, sans-serif' }}>
          Alert Settings
        </Typography>
      </Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AlertCard>
          <Typography variant="h5" gutterBottom>Email Alerts</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Enable Email Alerts</Typography>
              <Switch
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                inputProps={{ 'aria-label': 'email alerts' }}
              />
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom>Network</Typography>
              <ToggleButtonGroup
                value={emailNetwork}
                exclusive
                onChange={handleEmailNetworkChange}
                aria-label="email network selection"
              >
                <GlassButton value="ALL" aria-label="ALL">ALL</GlassButton>
                <GlassButton value="BTC" aria-label="BTC">BTC</GlassButton>
                <GlassButton value="ETH" aria-label="ETH">ETH</GlassButton>
              </ToggleButtonGroup>
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom>Minimum Transaction Amount (BTC)</Typography>
              <StyledTextField
                type="number"
                value={emailMinAmount}
                onChange={handleEmailMinAmountChange}
                inputProps={{ min: "10" }}
                fullWidth
              />
            </Box>
          </Box>
        </AlertCard>
        <AlertCard>
          <Typography variant="h5" gutterBottom>Browser Notifications</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Enable Browser Notifications</Typography>
              <Switch
                checked={browserAlerts}
                onChange={(e) => setBrowserAlerts(e.target.checked)}
                inputProps={{ 'aria-label': 'browser notifications' }}
              />
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom>Network</Typography>
              <ToggleButtonGroup
                value={browserNetwork}
                exclusive
                onChange={handleBrowserNetworkChange}
                aria-label="browser network selection"
              >
                <GlassButton value="ALL" aria-label="ALL">ALL</GlassButton>
                <GlassButton value="BTC" aria-label="BTC">BTC</GlassButton>
                <GlassButton value="ETH" aria-label="ETH">ETH</GlassButton>
              </ToggleButtonGroup>
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom>Minimum Transaction Amount (BTC)</Typography>
              <StyledTextField
                type="number"
                value={browserMinAmount}
                onChange={(e) => setBrowserMinAmount(e.target.value)}
                inputProps={{ min: "0" }}
                fullWidth
              />
            </Box>
          </Box>
        </AlertCard>
      </motion.div>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Note: Email alerts will be sent in groups of 5 for transactions above the minimum amount (10 BTC minimum).
        Browser notifications can be set for any size of moves.
      </Typography>
    </>
  );
};

export default Alerts;