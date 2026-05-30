import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  Box,
  Button,
  IconButton,
  Chip,
  Tooltip,
  CardActions
} from '@mui/material';
import {
  Add as AddIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  BrokenImage as BrokenImageIcon
} from '@mui/icons-material';
import { Product } from '../../types/product';
import { useCart } from '../../contexts/CartContext';
import ProductService from '../../services/productService';
import { buildApiUrl } from '../../config';

interface ProductCardProps {
  product: Product;
}

// URL de imagem padrão quando a imagem do produto não está disponível
const DEFAULT_IMAGE_URL = '/assets/images/product-placeholder.jpg';

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [imageError, setImageError] = useState(false);

  // Verificar se o produto está nos favoritos quando o componente montar
  React.useEffect(() => {
    const checkFavorite = async () => {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const response = await ProductService.checkInFavorites(product.id);
          setIsFavorite(response.data);
        } catch (error) {
          console.error('Error checking favorite status:', error);
        }
      }
    };

    checkFavorite();
  }, [product.id]);

  const handleProductClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = (event: React.MouseEvent) => {
    event.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: imageError ? DEFAULT_IMAGE_URL : getImageUrl(product),
      quantity: 1,
      stock: product.stock
    });
  };

  const handleToggleFavorite = async (event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!localStorage.getItem('user')) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    try {
      if (isFavorite) {
        await ProductService.removeFromFavorites(product.id);
        setIsFavorite(false);
      } else {
        await ProductService.addToFavorites(product.id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Formatter para preço em VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Update the getImageUrl function to use our standardized approach
  const getImageUrl = (product: Product) => {
    if (!product || !product.id) {
      return DEFAULT_IMAGE_URL;
    }

    // Always use the direct product image endpoint which handles all server-side logic
    return buildApiUrl(`/products/images/product/${product.id}`);
  };

  // Use the getImageUrl function with the product object
  const displayImageUrl = getImageUrl(product);

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
        transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 16px 40px rgba(15, 23, 42, 0.14)',
          borderColor: 'primary.light'
        },
        cursor: 'pointer'
      }}
      onClick={handleProductClick}
    >
      {imageError ? (
        <Box 
          sx={{ 
            height: 200, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: 'grey.100'
          }}
        >
          <BrokenImageIcon sx={{ fontSize: 80, color: 'grey.500' }} />
        </Box>
      ) : (
      <CardMedia
          component="img"
          height="200"
          image={displayImageUrl}
          alt={product.name}
          sx={{
            objectFit: 'contain',
            bgcolor: '#F8FAFC',
            p: 1.5,
            transition: 'transform 0.2s ease',
            '.MuiCard-root:hover &': { transform: 'scale(1.05)' },
          }}
          onError={handleImageError}
        />
      )}
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography gutterBottom variant="h6" component="h2" noWrap sx={{ fontWeight: 700 }}>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ 
          mb: 2,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {product.description}
        </Typography>
        <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
          <Rating value={product.rating || 0} readOnly precision={0.5} size="small" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({product.reviews?.length || 0})
          </Typography>
        </Box>
        <Chip
          label="SALE"
          color="secondary"
          size="small"
          sx={{ position: 'absolute', top: 12, left: 12, zIndex: 1 }}
        />
        <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
          <Typography variant="h6" color="error.main" sx={{ fontWeight: 800 }}>
            {formatPrice(product.price)}
          </Typography>
          <Chip 
            label={product.stock > 0 ? 'Còn hàng' : 'Hết hàng'} 
            color={product.stock > 0 ? 'success' : 'error'} 
            size="small" 
          />
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2, pt: 1 }}>
        <Button
          size="small"
          variant="contained"
          startIcon={<AddIcon />}
          disabled={product.stock <= 0}
          onClick={handleAddToCart}
          sx={{ borderRadius: 2, fontWeight: 700 }}
        >
          Thêm vào giỏ
        </Button>
        <Tooltip title={isFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}>
          <IconButton 
            color="primary" 
            onClick={handleToggleFavorite}
          >
            {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default ProductCard; 
