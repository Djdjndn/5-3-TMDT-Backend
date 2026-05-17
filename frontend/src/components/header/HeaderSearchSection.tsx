import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  List,
  ListItem,
  Typography,
  Divider,
  CircularProgress,
  ClickAwayListener,
  useTheme,
} from '@mui/material';
import SearchBar from '../SearchBar';
import type { HeaderLogic } from '../../hooks/useHeaderLogic';

interface HeaderSearchSectionProps {
  logic: HeaderLogic;
  fullWidth?: boolean;
}

const HeaderSearchSection: React.FC<HeaderSearchSectionProps> = ({ logic, fullWidth }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const {
    searchQuery,
    showSuggestions,
    loadingSuggestions,
    suggestions,
    searchContainerRef,
    handleClickAway,
    handleSearchChange,
    handleSearch,
    handleSuggestionClick,
    setShowSuggestions,
  } = logic;

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box
        ref={searchContainerRef}
        sx={{
          position: 'relative',
          flexGrow: fullWidth ? 0 : 1,
          maxWidth: fullWidth ? '100%' : '50%',
          width: fullWidth ? '100%' : undefined,
          mx: fullWidth ? 0 : 'auto',
        }}
      >
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={handleSearchChange}
          handleSearch={handleSearch}
        />

        {showSuggestions && searchQuery.trim().length > 1 && (
          <Paper
            elevation={3}
            sx={{
              position: 'absolute',
              zIndex: 1300,
              width: '100%',
              maxHeight: '300px',
              overflow: 'auto',
              mt: 0.5,
            }}
          >
            {loadingSuggestions ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={24} />
              </Box>
            ) : suggestions.length > 0 ? (
              <List dense>
                {suggestions.map((suggestion, index) => (
                  <ListItem
                    button
                    key={suggestion.id || index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      minHeight: 48,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    {suggestion.imageUrl && (
                      <Box
                        component="img"
                        src={suggestion.imageUrl}
                        alt={suggestion.name}
                        sx={{
                          width: 40,
                          height: 40,
                          objectFit: 'cover',
                          mr: 1,
                          borderRadius: 1,
                        }}
                      />
                    )}
                    <Box>
                      <Typography variant="body2">{suggestion.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {suggestion.price && `${suggestion.price.toLocaleString('vi-VN')}đ`}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
                <Divider />
                <ListItem
                  button
                  onClick={() => {
                    setShowSuggestions(false);
                    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                  }}
                  sx={{
                    justifyContent: 'center',
                    color: theme.palette.primary.main,
                    fontWeight: 'bold',
                    minHeight: 48,
                  }}
                >
                  <Typography variant="body2">
                    Xem tất cả kết quả cho "{searchQuery}"
                  </Typography>
                </ListItem>
              </List>
            ) : (
              <Box p={2}>
                <Typography variant="body2" color="text.secondary">
                  Không tìm thấy sản phẩm phù hợp
                </Typography>
              </Box>
            )}
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default HeaderSearchSection;
