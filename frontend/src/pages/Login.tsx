import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Link, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const LoginContainer = styled(Paper)({
  padding: '32px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '400px',
  margin: 'auto',
  marginTop: '64px',
});

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      console.log('Login successful:', response.data);
      // Handle successful login (e.g., store token, redirect)
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error('Login error:', err);
    }
  };

  return (
    <LoginContainer elevation={3}>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
        <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link href="#" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </LoginContainer>
  );
};

export default Login;