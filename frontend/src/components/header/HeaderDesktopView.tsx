import React from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Menu,
  Container,
  Button,
  Tooltip,
  MenuItem,
  Badge,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  History as HistoryIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  FileCopy as FileCopyIcon,
} from '@mui/icons-material';
import NotificationMenu from '../NotificationMenu';
import HeaderSearchSection from './HeaderSearchSection';
import type { HeaderLogic } from '../../hooks/useHeaderLogic';

interface HeaderDesktopViewProps {
  logic: HeaderLogic;
}

const HeaderDesktopView: React.FC<HeaderDesktopViewProps> = ({ logic }) => {
  const theme = useTheme();
  const {
    isAdmin,
    isAuthenticated,
    itemCount,
    anchorEl,
    notificationAnchorEl,
    cartAnchorEl,
    unreadCount,
    handleMenuOpen,
    handleMenuClose,
    handleLogout,
    handleCartClick,
    handleCartClose,
    handleNotificationMenuOpen,
    handleNotificationMenuClose,
    handleNotificationsUpdate,
  } = logic;

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}
          >
            Home
          </Typography>

          {!isAdmin && <HeaderSearchSection logic={logic} />}

          <Box sx={{ display: 'flex', ml: 'auto' }}>
            {!isAdmin && (
              <Button color="inherit" component={Link} to="/products" sx={{ mr: 1 }}>
                Sản Phẩm
              </Button>
            )}

            {!isAdmin && isAuthenticated && (
              <IconButton color="inherit" onClick={handleCartClick} sx={{ mx: 0.5 }}>
                <Badge badgeContent={itemCount} color="error">
                  <CartIcon />
                </Badge>
              </IconButton>
            )}

            <Menu
              anchorEl={cartAnchorEl}
              open={Boolean(cartAnchorEl)}
              onClose={handleCartClose}
              sx={{ mt: 2 }}
            >
              <Box sx={{ width: 300, maxHeight: 400, overflow: 'auto', p: 2 }}>
                <Typography variant="h6">Giỏ hàng của bạn</Typography>
                <Divider sx={{ my: 1 }} />
                {itemCount === 0 ? (
                  <Typography variant="body2">Giỏ hàng trống</Typography>
                ) : (
                  <Typography variant="body2">{itemCount} sản phẩm trong giỏ hàng</Typography>
                )}
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    component={Link}
                    to="/cart"
                    onClick={handleCartClose}
                  >
                    Xem giỏ hàng
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
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

            {isAuthenticated ? (
              isAdmin ? (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/admin/dashboard"
                    sx={{
                      mx: 0.5,
                      border: '1px solid white',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                      bgcolor: theme.palette.primary.dark,
                    }}
                    startIcon={<AdminPanelSettingsIcon />}
                  >
                    Quản lý hệ thống
                  </Button>
                  <Button
                    color="inherit"
                    onClick={handleLogout}
                    sx={{
                      mx: 0.5,
                      border: '1px solid white',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                      bgcolor: theme.palette.error.dark,
                    }}
                    startIcon={<LogoutIcon />}
                  >
                    Đăng xuất
                  </Button>
                </>
              ) : (
                <>
                  <Tooltip title="Notifications">
                    <IconButton
                      onClick={handleNotificationMenuOpen}
                      size="large"
                      color="inherit"
                      sx={{ mr: 1 }}
                    >
                      <Badge badgeContent={unreadCount} color="error">
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>

                  <NotificationMenu
                    anchorEl={notificationAnchorEl}
                    open={Boolean(notificationAnchorEl)}
                    onClose={handleNotificationMenuClose}
                    onNotificationsUpdate={handleNotificationsUpdate}
                  />

                  <IconButton color="inherit" onClick={handleMenuOpen} sx={{ mx: 0.5 }}>
                    <PersonIcon />
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                      <PersonIcon sx={{ mr: 1 }} /> Hồ sơ
                    </MenuItem>
                    <MenuItem component={Link} to="/orders" onClick={handleMenuClose}>
                      <HistoryIcon sx={{ mr: 1 }} /> Đơn hàng
                    </MenuItem>
                    <MenuItem component={Link} to="/wishlist" onClick={handleMenuClose}>
                      <FavoriteIcon sx={{ mr: 1 }} /> Danh sách yêu thích
                    </MenuItem>
                    <MenuItem component={Link} to="/refund-requests" onClick={handleMenuClose}>
                      <FileCopyIcon sx={{ mr: 1 }} /> Yêu cầu đổi/trả hàng
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon sx={{ mr: 1 }} /> Đăng xuất
                    </MenuItem>
                  </Menu>
                </>
              )
            ) : (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                  sx={{
                    mx: 0.5,
                    border: '1px solid white',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                    bgcolor: theme.palette.primary.dark,
                  }}
                >
                  Đăng Nhập
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/register"
                  sx={{
                    mx: 0.5,
                    bgcolor: theme.palette.secondary.main,
                    '&:hover': { bgcolor: theme.palette.secondary.dark },
                  }}
                >
                  Đăng Ký
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default HeaderDesktopView;
