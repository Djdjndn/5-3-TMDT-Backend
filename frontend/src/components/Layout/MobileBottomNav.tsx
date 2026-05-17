import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from '@mui/material';
import {
  Home as HomeIcon,
  Storefront as StorefrontIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();
  const { itemCount } = useCart();

  if (isAdmin) {
    return null;
  }

  const path = location.pathname;
  let value = -1;
  if (path === '/') value = 0;
  else if (path.startsWith('/products')) value = 1;
  else if (path === '/cart') value = 2;
  else if (path === '/profile' || path === '/orders' || path === '/dashboard') value = 3;

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        pb: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <BottomNavigation showLabels value={value}>
        <BottomNavigationAction
          label="Trang chủ"
          icon={<HomeIcon />}
          component={Link}
          to="/"
        />
        <BottomNavigationAction
          label="Sản phẩm"
          icon={<StorefrontIcon />}
          component={Link}
          to="/products"
        />
        <BottomNavigationAction
          label="Giỏ hàng"
          icon={
            <Badge badgeContent={isAuthenticated && itemCount > 0 ? itemCount : 0} color="error">
              <CartIcon />
            </Badge>
          }
          component={Link}
          to={isAuthenticated ? '/cart' : '/login'}
        />
        <BottomNavigationAction
          label="Tài khoản"
          icon={<PersonIcon />}
          component={Link}
          to={isAuthenticated ? '/profile' : '/login'}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default MobileBottomNav;
