import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
} from '@mui/material';
import {
  LaptopMac,
  PhoneIphone,
  Headphones,
  Monitor,
  SportsEsports,
  Home as HomeIcon,
  CameraAlt,
  Cable,
  LocalShipping,
  Security,
  SupportAgent,
  Verified,
  ArrowForward,
} from '@mui/icons-material';
import TopProducts from '../components/Products/TopProducts';

const categories = [
  { label: 'Laptop', icon: <LaptopMac />, to: '/products?category=laptop' },
  { label: 'Điện thoại', icon: <PhoneIphone />, to: '/products?category=điện thoại' },
  { label: 'Tai nghe', icon: <Headphones />, to: '/products?category=tai nghe' },
  { label: 'Màn hình', icon: <Monitor />, to: '/products?category=màn hình' },
  { label: 'Gaming', icon: <SportsEsports />, to: '/products?search=gaming' },
  { label: 'Smart Home', icon: <HomeIcon />, to: '/products?search=smart home' },
  { label: 'Camera', icon: <CameraAlt />, to: '/products?category=camera' },
  { label: 'Phụ kiện', icon: <Cable />, to: '/products?category=phụ kiện' },
];

const benefits = [
  { icon: <LocalShipping />, title: 'Giao hàng nhanh', description: 'Theo dõi trạng thái đơn hàng rõ ràng.' },
  { icon: <Security />, title: 'Thanh toán an toàn', description: 'Hỗ trợ COD, ví và mock payment cho demo.' },
  { icon: <SupportAgent />, title: 'Hỗ trợ khách hàng', description: 'Chat hỗ trợ và thông báo đơn hàng.' },
  { icon: <Verified />, title: 'Đổi trả minh bạch', description: 'Quản lý yêu cầu hoàn đơn trong hệ thống.' },
];

const brands = ['Samsung', 'Dell', 'ASUS', 'Apple', 'Sony', 'Anker'];

const Home: React.FC = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', pb: 8 }}>
      <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip
                label="Clean Tech E-commerce"
                color="secondary"
                sx={{ mb: 2, fontWeight: 700 }}
              />
              <Typography variant="h1" sx={{ fontSize: { xs: 36, md: 48 }, mb: 2 }}>
                Latest Tech Collection
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
                Khám phá laptop, điện thoại, tai nghe và phụ kiện công nghệ mới nhất với trải nghiệm mua sắm đơn giản.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to="/products"
                  endIcon={<ArrowForward />}
                >
                  Mua ngay
                </Button>
                <Button variant="outlined" size="large" component={RouterLink} to="/products?sort=popular">
                  Xem khuyến mãi
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  minHeight: { xs: 300, md: 390 },
                  borderRadius: 4,
                  bgcolor: '#F8FAFC',
                  border: '1px solid',
                  borderColor: 'divider',
                  p: { xs: 2, md: 4 },
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 24,
                    borderRadius: 4,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                  }}
                />
                {[
                  { label: 'Laptop', icon: <LaptopMac sx={{ fontSize: 58 }} />, top: '15%', left: '10%' },
                  { label: 'Điện thoại', icon: <PhoneIphone sx={{ fontSize: 54 }} />, top: '18%', right: '12%' },
                  { label: 'Tai nghe', icon: <Headphones sx={{ fontSize: 56 }} />, bottom: '18%', left: '18%' },
                  { label: 'Smart Watch', icon: <Verified sx={{ fontSize: 50 }} />, bottom: '16%', right: '12%' },
                ].map((item) => (
                  <Card
                    key={item.label}
                    sx={{
                      position: 'absolute',
                      top: item.top,
                      bottom: item.bottom,
                      left: item.left,
                      right: item.right,
                      width: { xs: 120, md: 150 },
                      p: 2,
                      textAlign: 'center',
                      transition: 'transform 0.2s ease',
                      '&:hover': { transform: 'translateY(-4px)' },
                    }}
                  >
                    <Box sx={{ color: 'primary.main', mb: 1 }}>{item.icon}</Box>
                    <Typography variant="body2" fontWeight={700}>
                      {item.label}
                    </Typography>
                  </Card>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h2" sx={{ fontSize: { xs: 28, md: 36 } }}>
            Danh mục sản phẩm
          </Typography>
          <Typography color="text.secondary">Chọn nhanh nhóm thiết bị cần mua.</Typography>
        </Box>
        <Grid container spacing={2}>
          {categories.map((category) => (
            <Grid item xs={6} sm={4} md={3} key={category.label}>
              <Card
                component={RouterLink}
                to={category.to}
                sx={{
                  display: 'block',
                  height: '100%',
                  textDecoration: 'none',
                  color: 'text.primary',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{category.icon}</Box>
                  <Typography fontWeight={700}>{category.label}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Card
          sx={{
            bgcolor: 'secondary.light',
            borderColor: 'secondary.light',
            p: { xs: 3, md: 4 },
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md>
              <Chip label="Flash Sale" color="secondary" sx={{ mb: 1 }} />
              <Typography variant="h3">Ưu đãi thiết bị công nghệ</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Săn sản phẩm nổi bật, giá tốt và còn hàng để demo luồng mua sắm.
              </Typography>
            </Grid>
            <Grid item xs={12} md="auto">
              <Button variant="contained" color="secondary" component={RouterLink} to="/products">
                Xem sản phẩm
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Container>

      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <TopProducts title="Sản phẩm nổi bật" maxItems={8} />
      </Container>

      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Typography variant="h3" sx={{ mb: 3 }}>
          Thương hiệu nổi bật
        </Typography>
        <Grid container spacing={2}>
          {brands.map((brand) => (
            <Grid item xs={6} sm={4} md={2} key={brand}>
              <Card sx={{ textAlign: 'center' }}>
                <CardContent>
                  <Typography fontWeight={800}>{brand}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container maxWidth="lg">
        <Grid container spacing={2}>
          {benefits.map((feature) => (
            <Grid item xs={12} sm={6} md={3} key={feature.title}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6">{feature.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
