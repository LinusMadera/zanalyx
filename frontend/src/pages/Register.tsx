import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Link, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const RegisterContainer = styled(Paper)({
  padding: '32px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '400px',
  margin: 'auto',
  marginTop: '64px',
});

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/auth/register', { email, username, password });
      console.log('Registration successful:', response.data);
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
    }
  };

  return (
    <RegisterContainer elevation={3}>
      <Typography component="h1" variant="h5">
        Sign up
      </Typography>
      <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 1 }}>
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
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="new-password"
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
          Sign Up
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link href="#" variant="body2">
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </Box>
    </RegisterContainer>
  );
};

export default Register;
