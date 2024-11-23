import React, { useState } from 'react';
import { Box, Typography, Button, Container, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import GradientBackground from '../components/GradientBackground';
import axios from 'axios';

const QuestionsSection = styled(Box)(({ theme }) => ({
  minHeight: '80vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  padding: theme.spacing(8, 0),
}));

const QuestionForm = styled(motion.form)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: '600px',
  margin: '0 auto',
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

const Questions = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/questions', { name, email, question });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting question:', error);
    }
  };

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      <GradientBackground />
      <QuestionsSection>
        <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{
              fontFamily: 'Lexend Mega, sans-serif',
              fontWeight: 800,
              mb: 6,
            }}
          >
            Ask Us Anything
          </Typography>
          <QuestionForm
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
          >
            {!submitted ? (
              <>
                <StyledTextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  margin="normal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <StyledTextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  margin="normal"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <StyledTextField
                  fullWidth
                  label="Your Question"
                  variant="outlined"
                  margin="normal"
                  multiline
                  rows={4}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  variant="outlined"
                  color="primary"
                  size="large"
                  sx={{ 
                    mt: 3, 
                    borderColor: 'rgba(255, 255, 255, 0.3)', 
                    color: 'text.primary',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  }}
                >
                  Submit Question
                </Button>
              </>
            ) : (
              <Typography variant="h6" align="center">
                Thank you for your question! We'll get back to you soon.
              </Typography>
            )}
          </QuestionForm>
        </Container>
      </QuestionsSection>
    </Box>
  );
};

export default Questions;
