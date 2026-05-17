import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import { Box, Container } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

interface LayoutDesktopProps {
  children?: React.ReactNode;
}

/** Desktop shell – unchanged layout for >= 1024px (1920×1080). */
const LayoutDesktop: React.FC<LayoutDesktopProps> = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      console.log('Layout: User is admin, redirecting to admin dashboard');
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  return (
    <Box className="desktop-shell" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="lg">
          {children || <Outlet />}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default LayoutDesktop;
