import { Box, Typography, Button, Container, useTheme, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Paper } from '@mui/material';
import GradientBackground from '../components/GradientBackground';
import { useState, useEffect } from 'react';
import { MonitorHeart, Analytics, AccountTree, Notifications, ArrowForward } from '@mui/icons-material';

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '50vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    paddingTop: theme.spacing(15),
  },
}));

const HeroContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  maxWidth: '600px',
  position: 'relative',
  zIndex: 1,
  [theme.breakpoints.up('md')]: {
    padding: 0,
    maxWidth: '100%',
  },
}));

// @ts-ignore
const AnimatedTypography = motion(Typography);
// @ts-ignore
const AnimatedButton = motion(Button);

const FlexContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '32px',
});

const FlexItem = styled(Box)({
  flex: '1 1 300px',
});

const StarLine = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 2 }}>
    <Box sx={{ width: '33%', height: '1px', bgcolor: 'black' }} />
    <Box sx={{ mx: 2, width: 24, height: 24, border: '1px solid black', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography sx={{ color: 'black', fontSize: '0.875rem' }}>★</Typography>
    </Box>
    <Box sx={{ width: '33%', height: '1px', bgcolor: 'black' }} />
  </Box>
);

const Landing = () => {
  const theme = useTheme();
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const texts = [
    "Advanced Crypto Whale Tracking",
    "Real-time Monitoring",
    "Multi-chain Support",
    "Customizable Alerts",
    "Powerful Analytics"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);


  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      <HeroSection>
        <GradientBackground/>
        <Container maxWidth="md" sx={{ 
          display: 'flex', 
          flexDirection: 'column',  
          justifyContent: 'center', 
          minHeight: '75vh',
          [theme.breakpoints.up('md')]: {
            justifyContent: 'flex-start',
            paddingTop: theme.spacing(5),
          },
        }}>
          <StarLine/>
          <Typography
            variant="h1"
            gutterBottom
            sx={{ 
              fontFamily: 'Lexend Mega, sans-serif', 
              textAlign: 'center', 
              mb: 1,
              fontWeight: 800,
              letterSpacing: '-0.05em',
              [theme.breakpoints.up('md')]: {
                fontSize: '5rem',
                mb: 3,
              },
            }}
          >
            Zanalyx
          </Typography>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ 
              fontFamily: 'Anaheim, sans-serif', 
              textAlign: 'center', 
              mb: 4,
              maxWidth: '80%',
              margin: '0 auto',
              [theme.breakpoints.up('md')]: {
                fontSize: '1.5rem',
                mb: 6,
              },
            }}
          >
            Empowering traders teste with advanced crypto whale tracking and analytics
          </Typography>
          <HeroContent>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ 
                    fontFamily: 'Anaheim, sans-serif', 
                    height: '1rem', 
                    textAlign: 'center',
                    [theme.breakpoints.up('md')]: {
                      fontSize: '2.5rem',
                      height: '4rem',
                      mb: 4,
                    },
                  }}
                >
                  {texts[currentTextIndex]}
                </Typography>
            <StarLine />
            <AnimatedButton
              variant="outlined"
              size="large"
              color="primary"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              sx={{ 
                fontFamily: 'Anaheim, sans-serif',
                mt: 1,
                [theme.breakpoints.up('md')]: {
                  fontSize: '1.2rem',
                  padding: '12px 36px',
                  mt: 3,
                },
              }}
              href="https://waitlist.zanalyx.com"
              // @ts-ignore
              target="_blank"
              rel="noopener noreferrer"
              endIcon={
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowForward />
                </motion.div>
              }
            >
              Join the Waitlist
            </AnimatedButton>
          </HeroContent>
        </Container>
      </HeroSection>

      <Divider sx={{ borderWidth: '1px', borderColor: 'black' }} />

      <Container sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Typography variant="h2" align="center" gutterBottom>
            Features
          </Typography>
          <FlexContainer>
            {[
              { title: 'Real-time Tracking', description: 'Monitor whale movements as they happen', icon: <MonitorHeart fontSize="large" /> },
              { title: 'Advanced Analytics', description: 'Gain insights with our powerful analytical tools', icon: <Analytics fontSize="large" /> },
              { title: 'Multi-chain Support', description: 'Track whales across various blockchain networks', icon: <AccountTree fontSize="large" /> },
              { title: 'Customizable Alerts', description: 'Set up personalized notifications for whale activities', icon: <Notifications fontSize="large" /> },
            ].map((feature, index) => (
              <FlexItem key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <FeatureCard elevation={3}>
                    <FeatureIcon>
                      {feature.icon}
                    </FeatureIcon>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1">
                      {feature.description}
                    </Typography>
                  </FeatureCard>
                </motion.div>
              </FlexItem>
            ))}
          </FlexContainer>
        </motion.div>
      </Container>

      <Divider sx={{ borderWidth: '1px', borderColor: 'black' }} />

      <Box sx={{ bgcolor: theme.palette.background.paper, py: 8 }}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Typography variant="h2" align="center" gutterBottom>
              Why Choose Zanalyx?
            </Typography>
            <FlexContainer alignItems="center" justifyContent="center">
              <FlexItem sx={{ textAlign: 'center', maxWidth: '600px' }}>
                <Typography variant="body1" paragraph>
                  Zanalyx provides unparalleled insights into the movements of crypto whales, giving you a competitive edge in the market. Our advanced algorithms and real-time data processing ensure you're always one step ahead.
                </Typography>
                <Typography variant="body1" paragraph>
                  With customizable alerts, multi-chain support, and in-depth analytics, Zanalyx is the ultimate tool for serious crypto traders and researchers.
                </Typography>
                <AnimatedButton
                  variant="contained"
                  size="large"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  sx={{ bgcolor: 'black', color: 'white', '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' } }}
                >
                  Learn More
                </AnimatedButton>
              </FlexItem>
            </FlexContainer>
          </motion.div>
        </Container>
      </Box>

      <Divider sx={{ borderWidth: '1px', borderColor: 'black' }} />

      <Container sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Typography variant="h2" align="center" gutterBottom>
            Pricing
          </Typography>
          <FlexContainer justifyContent="center">
            {[
              { 
                title: 'Standard', 
                price: '$10/month', 
                features: [
                  'Real-time whale transaction alerts',
                  'Basic analytics dashboard',
                  'Single blockchain support',
                  '',
                  '',
                ]
              },
              { 
                title: 'Pro', 
                price: '$99/month', 
                features: [
                  'Advanced predictive analytics',
                  'Multi-chain tracking and analysis',
                  'Custom alert configurations',
                  'API access for integration',
                  'Priority customer support',
                ]
              },
            ].map((plan, index) => (
              <FlexItem key={index} sx={{ width: '300px', height: '400px' }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  style={{ height: '100%' }}
                >
                  <FeatureCard elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" component="h3" gutterBottom>
                        {plan.title}
                      </Typography>
                      <Typography variant="h5" color="primary" gutterBottom>
                        {plan.price}
                      </Typography>
                      <Box>
                        {plan.features.map((feature, fIndex) => (
                          <Typography key={fIndex} variant="body1" paragraph>
                            {feature}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                    <Button variant="outlined" color="primary" disabled>
                      Coming Soon
                    </Button>
                  </FeatureCard>
                </motion.div>
              </FlexItem>
            ))}
          </FlexContainer>
        </motion.div>
      </Container>

      <Divider sx={{ borderWidth: '1px', borderColor: 'black' }} />

      <Box sx={{ bgcolor: theme.palette.background.paper, py: 8 }}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Typography variant="h2" align="center" gutterBottom>
              Get Started Today
            </Typography>
            <Typography variant="body1" align="center" paragraph>
              Join the growing community of traders and researchers who trust Zanalyx for their crypto whale tracking needs.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <AnimatedButton
                variant="contained"
                size="large"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{ bgcolor: 'black', color: 'white', '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' } }}
              >
                Sign Up Now
              </AnimatedButton>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
}));

export default Landing;