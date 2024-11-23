import { Box, Typography, Button, Container, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import GradientBackground from '../components/GradientBackground';
import CheckIcon from '@mui/icons-material/Check';

const PricingSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const PricingCard = styled(motion.div)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: theme.shape.borderRadius,
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const FeatureItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
}));

const Pricing = () => {

  const plans = [
    {
      title: 'Standard',
      price: '$10',
      features: [
        'Real-time whale transaction alerts',
        'Basic analytics dashboard',
        'Single blockchain support',
      ],
    },
    {
      title: 'Pro',
      price: '$99',
      features: [
        'Advanced predictive analytics',
        'Multi-chain tracking and analysis',
        'Custom alert configurations',
        'API access for integration',
        'Priority customer support',
      ],
    },
  ];

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      <GradientBackground />
      <PricingSection>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{
              fontFamily: 'Lexend Mega, sans-serif',
              fontWeight: 800,
              mb: 6,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            Choose Your Plan
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'center', 
            alignItems: 'center',
            gap: 4 
          }}>
            {plans.map((plan, index) => (
              <PricingCard
                key={plan.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                sx={{ 
                  flex: { xs: '1', md: '0 1 350px' }, 
                  width: '100%',
                  maxWidth: '350px', 
                  height: { xs: 'auto', md: '500px' },
                  mb: { xs: 4, md: 0 }
                }}
              >
                <Typography variant="h4" component="h3" gutterBottom>
                  {plan.title}
                </Typography>
                <Typography variant="h3" color="primary" gutterBottom>
                  {plan.price}
                  <Typography variant="subtitle1" component="span">
                    /month
                  </Typography>
                </Typography>
                <Divider sx={{ width: '100%', my: 3, borderColor: 'text.primary' }} />
                <Box sx={{ mb: 4, width: '100%', flexGrow: 1, overflowY: 'auto' }}>
                  {plan.features.map((feature, fIndex) => (
                    <FeatureItem key={fIndex}>
                      <CheckIcon color="primary" sx={{ mr: 2, flexShrink: 0 }} />
                      <Typography variant="body1">{feature}</Typography>
                    </FeatureItem>
                  ))}
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled
                    sx={{ borderColor: 'text.primary', color: 'text.primary' }}
                  >
                    Coming Soon
                  </Button>
                </Box>
              </PricingCard>
            ))}
          </Box>
        </Container>
      </PricingSection>
    </Box>
  );
};

export default Pricing;
