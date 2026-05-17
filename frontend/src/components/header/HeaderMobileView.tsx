import React from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Menu,
  Button,
  MenuItem,
  Badge,
  IconButton,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  Notifications as NotificationsIcon,
  History as HistoryIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  FileCopy as FileCopyIcon,
  Storefront as StorefrontIcon,
} from '@mui/icons-material';
import NotificationMenu from '../NotificationMenu';
import HeaderSearchSection from './HeaderSearchSection';
import type { HeaderLogic } from '../../hooks/useHeaderLogic';

interface HeaderMobileViewProps {
  logic: HeaderLogic;
}

const HeaderMobileView: React.FC<HeaderMobileViewProps> = ({ logic }) => {
  const theme = useTheme();
  const {
    isAdmin,
    isAuthenticated,
    itemCount,
    anchorEl,
    notificationAnchorEl,
    cartAnchorEl,
    drawerOpen,
    unreadCount,
    handleMenuOpen,
    handleMenuClose,
    handleLogout,
    handleDrawerToggle,
    handleDrawerClose,
    handleCartClick,
    handleCartClose,
    handleNotificationMenuOpen,
    handleNotificationMenuClose,
    handleNotificationsUpdate,
  } = logic;

  const closeDrawerAndNavigate = () => {
    handleDrawerClose();
    handleMenuClose();
  };

  const drawerContent = (
    <Box sx={{ width: 280, pt: 1 }} role="presentation">
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/" onClick={closeDrawerAndNavigate}>
            <ListItemText primary="Trang chủ" primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItemButton>
        </ListItem>
        {!isAdmin && (
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/products"
              onClick={closeDrawerAndNavigate}
            >
              <ListItemIcon>
                <StorefrontIcon />
              </ListItemIcon>
              <ListItemText primary="Sản phẩm" />
            </ListItemButton>
          </ListItem>
        )}
        {isAuthenticated && !isAdmin && (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/profile"
                onClick={closeDrawerAndNavigate}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Hồ sơ" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/orders"
                onClick={closeDrawerAndNavigate}
              >
                <ListItemIcon>
                  <HistoryIcon />
                </ListItemIcon>
                <ListItemText primary="Đơn hàng" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/wishlist"
                onClick={closeDrawerAndNavigate}
              >
                <ListItemIcon>
                  <FavoriteIcon />
                </ListItemIcon>
                <ListItemText primary="Yêu thích" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/refund-requests"
                onClick={closeDrawerAndNavigate}
              >
                <ListItemIcon>
                  <FileCopyIcon />
                </ListItemIcon>
                <ListItemText primary="Đổi/trả hàng" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/notifications"
                onClick={closeDrawerAndNavigate}
              >
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText primary="Thông báo" />
              </ListItemButton>
            </ListItem>
          </>
        )}
        {isAuthenticated && isAdmin && (
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/admin/dashboard"
              onClick={closeDrawerAndNavigate}
            >
              <ListItemIcon>
                <AdminPanelSettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Quản lý hệ thống" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
      <Divider />
      <List>
        {isAuthenticated ? (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="Đăng xuất" />
            </ListItemButton>
          </ListItem>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/login"
                onClick={closeDrawerAndNavigate}
              >
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Đăng nhập" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/register"
                onClick={closeDrawerAndNavigate}
              >
                <ListItemText primary="Đăng ký" sx={{ pl: 7 }} />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ width: '100%' }}>
        <Toolbar sx={{ minHeight: 56, px: 1.5, gap: 0.5 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            aria-label="menu"
            sx={{ minWidth: 44, minHeight: 44 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 'bold',
              fontSize: '1.1rem',
            }}
          >
            Home
          </Typography>

          {!isAdmin && isAuthenticated && (
            <IconButton
              color="inherit"
              onClick={handleCartClick}
              sx={{ minWidth: 44, minHeight: 44 }}
            >
              <Badge badgeContent={itemCount} color="error">
                <CartIcon />
              </Badge>
            </IconButton>
          )}

          {isAuthenticated && !isAdmin && (
            <IconButton
              color="inherit"
              onClick={handleNotificationMenuOpen}
              sx={{ minWidth: 44, minHeight: 44 }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          )}

          {isAuthenticated && !isAdmin && (
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              sx={{ minWidth: 44, minHeight: 44 }}
            >
              <PersonIcon />
            </IconButton>
          )}
        </Toolbar>

        {!isAdmin && (
          <Box sx={{ px: 1.5, pb: 1.5, width: '100%' }}>
            <HeaderSearchSection logic={logic} fullWidth />
          </Box>
        )}
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerClose}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ sx: { width: 280 } }}
      >
        {drawerContent}
      </Drawer>

      <Menu anchorEl={cartAnchorEl} open={Boolean(cartAnchorEl)} onClose={handleCartClose} sx={{ mt: 2 }}>
        <Box sx={{ width: 'min(100vw - 32px, 300px)', maxHeight: 400, overflow: 'auto', p: 2 }}>
          <Typography variant="h6">Giỏ hàng của bạn</Typography>
          <Divider sx={{ my: 1 }} />
          {itemCount === 0 ? (
            <Typography variant="body2">Giỏ hàng trống</Typography>
          ) : (
            <Typography variant="body2">{itemCount} sản phẩm trong giỏ hàng</Typography>
          )}
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              variant="outlined"
              size="medium"
              fullWidth
              component={Link}
              to="/cart"
              onClick={handleCartClose}
            >
              Xem giỏ hàng
            </Button>
            <Button
              variant="contained"
              size="medium"
              fullWidth
              component={Link}
              to="/checkout"
              onClick={handleCartClose}
              disabled={itemCount === 0}
              sx={{ bgcolor: theme.palette.success.main }}
            >
              Thanh toán
            </Button>
          </Box>
        </Box>
      </Menu>

      <NotificationMenu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationMenuClose}
        onNotificationsUpdate={handleNotificationsUpdate}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{ sx: { minWidth: 220 } }}
      >
        <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
          <PersonIcon sx={{ mr: 1 }} /> Hồ sơ
        </MenuItem>
        <MenuItem component={Link} to="/orders" onClick={handleMenuClose}>
          <HistoryIcon sx={{ mr: 1 }} /> Đơn hàng
        </MenuItem>
        <MenuItem component={Link} to="/wishlist" onClick={handleMenuClose}>
          <FavoriteIcon sx={{ mr: 1 }} /> Yêu thích
        </MenuItem>
        <MenuItem component={Link} to="/refund-requests" onClick={handleMenuClose}>
          <FileCopyIcon sx={{ mr: 1 }} /> Đổi/trả hàng
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} /> Đăng xuất
        </MenuItem>
      </Menu>
    </>
  );
};

export default HeaderMobileView;
