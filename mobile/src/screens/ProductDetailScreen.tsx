import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { productApi } from '../api/productApi';
import { getErrorMessage } from '../api/client';
import { colors } from '../config';
import { Product, Review, RootStackParamList } from '../types';
import { Button, EmptyState, Input, LoadingState, Screen } from '../components/ui';
import { formatCurrency } from '../utils/format';
import { getProductImageUrl } from '../utils/image';
import { useCart } from '../context/CartContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

const RatingPicker = ({ value, onChange }: { value: number; onChange: (value: number) => void }) => (
  <View style={styles.stars}>
    {[1, 2, 3, 4, 5].map((star) => (
      <TouchableOpacity key={star} onPress={() => onChange(star)} activeOpacity={0.7}>
        <Text style={[styles.star, star <= value && styles.starActive]}>
          {star <= value ? '★' : '☆'}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

export const ProductDetailScreen: React.FC<Props> = ({ route }) => {
  const { addProduct } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);

  const averageRating = useMemo(() => {
    if (!reviews.length) return product?.averageRating || 0;
    return reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length;
  }, [product?.averageRating, reviews]);

  const load = async () => {
    try {
      const [detail, reviewList] = await Promise.all([
        productApi.detail(route.params.productId),
        productApi.reviews(route.params.productId),
      ]);
      setProduct(detail);
      setReviews(reviewList);
    } catch (error) {
      Alert.alert('Không tải được sản phẩm', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [route.params.productId]);

  const submitReview = async () => {
    try {
      await productApi.createReview(route.params.productId, rating, comment);
      setComment('');
      setRating(5);
      await load();
      Alert.alert('Đã gửi đánh giá', 'Cảm ơn bạn đã đánh giá sản phẩm.');
    } catch (error) {
      Alert.alert('Không gửi được đánh giá', getErrorMessage(error));
    }
  };

  if (loading) return <LoadingState />;
  if (!product) return <EmptyState title="Không tìm thấy sản phẩm" />;

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: getProductImageUrl(product) }} style={styles.hero} resizeMode="cover" />
        <View style={styles.panel}>
          <View style={styles.badgeRow}>
            <Text style={styles.badge}>{product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}</Text>
            <Text style={styles.ratingBadge}>★ {averageRating ? averageRating.toFixed(1) : 'Mới'}</Text>
          </View>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{formatCurrency(product.price)}</Text>
          <Text style={styles.meta}>Tồn kho: {product.stock ?? 0}</Text>
          <Text style={styles.description}>{product.description || 'Chưa có mô tả.'}</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Đánh giá sản phẩm</Text>
          <Text style={styles.helper}>Chọn số sao như trên web, sau đó nhập nhận xét ngắn.</Text>
          <RatingPicker value={rating} onChange={setRating} />
          <Input label="Nhận xét" value={comment} onChangeText={setComment} placeholder="Sản phẩm dùng ổn..." />
          <Button title="Gửi đánh giá" onPress={submitReview} />

          <View style={styles.reviewHeader}>
            <Text style={styles.sectionTitleSmall}>Nhận xét gần đây</Text>
            <Text style={styles.reviewCount}>{reviews.length} đánh giá</Text>
          </View>
          {reviews.length === 0 ? (
            <EmptyState title="Chưa có đánh giá" />
          ) : reviews.map((review) => (
            <View key={review.id} style={styles.review}>
              <View style={styles.reviewTop}>
                <Text style={styles.reviewName}>{review.userName || review.fullName || 'Người dùng'}</Text>
                <Text style={styles.reviewRating}>{'★'.repeat(Math.round(Number(review.rating || 0)))}</Text>
              </View>
              {review.comment ? <Text style={styles.reviewComment}>{review.comment}</Text> : null}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.stickyBar}>
        <View>
          <Text style={styles.stickyLabel}>Tạm tính</Text>
          <Text style={styles.stickyPrice}>{formatCurrency(product.price)}</Text>
        </View>
        <TouchableOpacity style={styles.stickyButton} onPress={() => addProduct(product)}>
          <Text style={styles.stickyButtonText}>Thêm vào giỏ</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 110, gap: 14 },
  hero: { width: '100%', aspectRatio: 1.15, borderRadius: 18, backgroundColor: '#EEF2F7' },
  panel: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  badge: { color: colors.success, backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, fontWeight: '900', fontSize: 12 },
  ratingBadge: { color: colors.warning, backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, fontWeight: '900', fontSize: 12 },
  name: { fontSize: 23, fontWeight: '900', color: colors.text, lineHeight: 30 },
  price: { fontSize: 24, color: colors.primary, fontWeight: '900', marginTop: 10 },
  meta: { color: colors.muted, marginTop: 6, fontWeight: '700' },
  description: { color: colors.text, lineHeight: 22, marginTop: 14 },
  sectionTitle: { fontSize: 19, fontWeight: '900', color: colors.text, marginBottom: 6 },
  sectionTitleSmall: { fontSize: 16, fontWeight: '900', color: colors.text },
  helper: { color: colors.muted, lineHeight: 20, marginBottom: 8 },
  stars: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  star: { fontSize: 34, color: '#CBD5E1' },
  starActive: { color: '#F59E0B' },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 4 },
  reviewCount: { color: colors.muted, fontWeight: '800' },
  review: { paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  reviewName: { fontWeight: '800', color: colors.text },
  reviewRating: { color: colors.warning, fontWeight: '900' },
  reviewComment: { color: colors.text, marginTop: 6, lineHeight: 20 },
  stickyBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stickyLabel: { color: colors.muted, fontWeight: '800', fontSize: 12 },
  stickyPrice: { color: colors.text, fontWeight: '900', fontSize: 17, marginTop: 2 },
  stickyButton: { backgroundColor: colors.primary, paddingHorizontal: 18, paddingVertical: 13, borderRadius: 12 },
  stickyButtonText: { color: '#fff', fontWeight: '900' },
});
