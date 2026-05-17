import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Container
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Inventory,
  LocalShipping,
  Person,
  Logout,
  Home
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useDevice } from '../hooks/useDevice';
import ShipperHeader from './ShipperHeader';

const drawerWidth = 240;

const ShipperLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useDevice();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  const handleMenu = (event: React.SyntheticEvent) => {
    setAnchorEl(event.currentTarget as HTMLElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

 

  return (
    <Box className={isMobile ? 'mobile-shell' : 'desktop-shell'} sx={{ display: 'flex', width: '100%', overflowX: 'hidden' }}>
      <CssBaseline />
      {isMobile ? (
        <ShipperHeader />
      ) : (
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% )` }
            
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Shipper Dashboard
            </Typography>
            <Box>
              <Tooltip title="Account settings">
                <IconButton onClick={handleMenu} size="small" sx={{ ml: 2 }}>
                  <Avatar 
                    alt={user?.username || 'Shipper'} 
                    src="/static/images/avatar/1.jpg"
                    sx={{ bgcolor: 'primary.dark' }}
                  >
                    {user?.username?.charAt(0) || 'S'}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Đăng xuất
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
      )}
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 8, sm: 8 }
        }}
      >
        <Toolbar sx={{ display: { xs: 'none', sm: 'block' } }} />
        <Container maxWidth={isMobile ? false : 'lg'} disableGutters={isMobile} sx={{ px: isMobile ? 1.5 : undefined, maxWidth: '100%' }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default ShipperLayout; 