import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@mui/material';
import { Box } from '@mui/material';

const StyledAppBar = styled(AppBar)(() => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
}));

const GlassButton = styled(Button)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(5px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.text.primary,
  padding: '6px 16px',
  fontSize: '1rem',
  fontWeight: 'bold',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.2)',
  },
}));

const TopNav = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { label: 'Pricing', path: '/pricing' },
    { label: 'Questions', path: '/questions' },
    { label: 'App', path: '/app', isApp: true },
  ];

  return (
    <StyledAppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h5" component={Link} to="/" sx={{ textDecoration: 'none', color: theme.palette.text.primary, fontFamily: 'Lexend Mega, sans-serif', fontWeight: 800 }}>
          Zanalyx
        </Typography>
        {isMobile ? (
          <>
            <IconButton
              edge="start"
              aria-label="menu"
              onClick={handleMenu}
              sx={{ color: theme.palette.text.primary }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {menuItems.map((item) => (
                <MenuItem 
                  key={item.path} 
                  onClick={handleClose} 
                  component={Link} 
                  to={item.path}
                  selected={location.pathname === item.path}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex' }}>
            {menuItems.map((item) => (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <GlassButton 
                  //@ts-ignore
                  component={Link as React.ElementType}
                  to={item.path} 
                  sx={{ 
                    mr: { xs: 0, md: 2 },
                    ...(item.isApp && {
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      color: 'common.white',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      },
                    }),
                    ...(location.pathname === item.path && {
                      borderBottom: `2px solid ${theme.palette.primary.main}`,
                    }),
                  }}
                >
                  {item.label}
                </GlassButton>
              </motion.div>
            ))}
          </Box>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};

export default TopNav;