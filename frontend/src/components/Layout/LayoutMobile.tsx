import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import MobileBottomNav from './MobileBottomNav';
import { Box, Container } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

interface LayoutMobileProps {
  children?: React.ReactNode;
}

/** Mobile shell – touch-friendly layout for < 1024px (iPhone 15 portrait). */
const LayoutMobile: React.FC<LayoutMobileProps> = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      console.log('Layout: User is admin, redirecting to admin dashboard');
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const showBottomNav = !isAdmin;

  return (
    <Box
      className="mobile-shell"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
        pb: showBottomNav ? 'calc(56px + env(safe-area-inset-bottom, 0px))' : 0,
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 2,
          px: 0,
          width: '100%',
          overflowX: 'hidden',
        }}
      >
        <Container maxWidth={false} disableGutters sx={{ px: 1.5, width: '100%' }}>
          {children || <Outlet />}
        </Container>
      </Box>
      <Footer />
      {showBottomNav && <MobileBottomNav />}
    </Box>
  );
};

export default LayoutMobile;
