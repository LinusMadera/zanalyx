import { Box, Container, Typography, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(6, 0),
}));

const Footer = () => {
  return (
    <FooterContainer>
      <Container maxWidth="lg">
        <Divider sx={{ mb: 4 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Zanalyx. All rights reserved.
        </Typography>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
