import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import NotificationService from '../services/NotificationService';
import { Notification } from '../types/notification';
import ProductService from '../services/productService';

export const NOTIFICATION_UPDATE_EVENT = 'notification-update-event';

function useDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timer = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        func(...args);
      }, delay);
    },
    [func, delay]
  );
}

export const refreshHeaderNotifications = () => {
  console.log('Triggering global header notification refresh');
  const event = new CustomEvent(NOTIFICATION_UPDATE_EVENT);
  window.dispatchEvent(event);
  console.log('ok123');
  try {
    NotificationService.getNotifications();
  } catch (error) {
    console.error('Error in direct notification fetch:', error);
  }
};

export function useHeaderLogic() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [cartAnchorEl, setCartAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('Auth state in Header:', { user, isAuthenticated });
  }, [user, isAuthenticated]);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      if (isAuthenticated && user) {
        try {
          const response = await NotificationService.getUnreadCount();
          setNotificationCount(response.data);
        } catch (error) {
          console.error('Error fetching notification count:', error);
        }
      } else {
        setNotificationCount(0);
      }
    };

    if (isAuthenticated) {
      fetchNotificationCount();
      const intervalId = setInterval(fetchNotificationCount, 30000);
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated, user]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    handleDrawerClose();
    navigate('/');
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleCartClick = (event: React.MouseEvent<HTMLElement>) => {
    setCartAnchorEl(event.currentTarget);
  };

  const handleCartClose = () => {
    setCartAnchorEl(null);
  };

  const handleViewAllNotifications = () => {
    handleNotificationClose();
    navigate('/notifications');
  };

  const fetchSuggestionsImpl = async (query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setLoadingSuggestions(false);
      return;
    }

    try {
      setLoadingSuggestions(true);
      const response = await ProductService.getSearchSuggestions(query);
      setSuggestions(response.data || []);
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const fetchSearchSuggestions = useDebounce(fetchSuggestionsImpl, 300);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setShowSuggestions(true);
      fetchSearchSuggestions(query);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setShowSuggestions(false);
    handleDrawerClose();
    navigate(`/products/${suggestion.id}`);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      setNotificationLoading(true);
      const response = await NotificationService.getNotifications();
      setNotifications(response.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setNotificationLoading(false);
    }
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const isNotificationRead = (notification: any) => {
    const isReadValue =
      notification.isRead !== undefined ? notification.isRead : notification.read;

    return (
      isReadValue === true ||
      (typeof isReadValue === 'number' && isReadValue === 1) ||
      (typeof isReadValue === 'string' && isReadValue === '1') ||
      (typeof isReadValue === 'string' && isReadValue === 'true')
    );
  };

  const handleNotificationsUpdate = () => {
    console.log('Refreshing notifications from NotificationMenu update');
    fetchLatestNotifications();
  };

  const fetchLatestNotifications = useCallback(() => {
    if (isAuthenticated && user) {
      console.log('Fetching latest notifications in Header component');
      setNotificationLoading(true);
      NotificationService.getNotifications()
        .then((response) => {
          setNotifications(response.data);
          const newUnreadCount = response.data.filter((n) => !isNotificationRead(n)).length;
          setNotificationCount(newUnreadCount);
          console.log(
            'Updated notifications: Total:',
            response.data.length,
            'Unread:',
            newUnreadCount
          );
        })
        .catch((error) => {
          console.error('Error refreshing notifications:', error);
        })
        .finally(() => {
          setNotificationLoading(false);
        });
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const handleNotificationRefresh = () => {
      console.log('Header received notification refresh event');
      fetchLatestNotifications();
    };

    window.addEventListener(NOTIFICATION_UPDATE_EVENT, handleNotificationRefresh);

    return () => {
      window.removeEventListener(NOTIFICATION_UPDATE_EVENT, handleNotificationRefresh);
    };
  }, [fetchLatestNotifications]);

  const handleClickAway = () => {
    setShowSuggestions(false);
  };

  const unreadCount = notifications.filter((n) => !isNotificationRead(n)).length;
  console.log(
    'Total notifications:',
    notifications.length,
    'Unread notifications:',
    unreadCount
  );

  return {
    user,
    logout,
    isAuthenticated,
    isAdmin,
    itemCount,
    navigate,
    anchorEl,
    notificationAnchorEl,
    cartAnchorEl,
    notificationCount,
    searchQuery,
    notifications,
    notificationLoading,
    drawerOpen,
    suggestions,
    showSuggestions,
    loadingSuggestions,
    searchContainerRef,
    unreadCount,
    handleMenuOpen,
    handleMenuClose,
    handleDrawerToggle,
    handleDrawerClose,
    handleLogout,
    handleNotificationClick,
    handleNotificationClose,
    handleCartClick,
    handleCartClose,
    handleViewAllNotifications,
    handleSearch,
    handleSearchChange,
    handleSuggestionClick,
    handleNotificationMenuOpen,
    handleNotificationMenuClose,
    handleNotificationsUpdate,
    handleClickAway,
    setShowSuggestions,
    setSearchQuery,
  };
}

export type HeaderLogic = ReturnType<typeof useHeaderLogic>;
