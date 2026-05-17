import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { productApi } from '../api/productApi';
import { getErrorMessage } from '../api/client';
import { buildApiUrl, colors } from '../config';
import { Product, RootStackParamList } from '../types';
import { EmptyState, Input, LoadingState, Screen } from '../components/ui';
import { formatCurrency } from '../utils/format';
import { getProductImageUrl } from '../utils/image';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

type Nav = NativeStackScreenProps<RootStackParamList>['navigation'];

const categories = ['Tất cả', 'Điện thoại', 'Laptop', 'Phụ kiện', 'Tai nghe'];

const getCategoryName = (product: Product) => {
  if (typeof product.category === 'string') return product.category;
  return product.category?.name || '';
};

export const HomeScreen = () => {
  const navigation = useNavigation<Nav>();
  const { addProduct } = useCart();
  const { user } = useAuth();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sort, setSort] = useState<'default' | 'priceAsc' | 'priceDesc'>('default');
  const [category, setCategory] = useState('Tất cả');

  const load = useCallback(async () => {
    try {
      setAllProducts(await productApi.list());
    } catch (error) {
      Alert.alert('Không tải được sản phẩm', getErrorMessage(error));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const suggestions = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (keyword.length < 2) return [];
    return allProducts
      .filter((product) => `${product.name} ${getCategoryName(product)}`.toLowerCase().includes(keyword))
      .slice(0, 5);
  }, [allProducts, query]);

  const visibleProducts = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    let next = [...allProducts];
    if (category !== 'Tất cả') {
      next = next.filter((product) => getCategoryName(product).toLowerCase().includes(category.toLowerCase()));
    }
    if (keyword) {
      next = next.filter((product) => `${product.name} ${getCategoryName(product)}`.toLowerCase().includes(keyword));
    }
    if (sort === 'priceAsc') next.sort((a, b) => a.price - b.price);
    if (sort === 'priceDesc') next.sort((a, b) => b.price - a.price);
    return next;
  }, [allProducts, category, query, sort]);

  if (loading) return <LoadingState />;

  return (
    <Screen padded={false}>
      <FlatList
        data={visibleProducts}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        contentContainerStyle={styles.list}
        columnWrapperStyle={{ gap: 12 }}
        ListHeaderComponent={
          <View>
            <View style={styles.hero}>
              <Text style={styles.hello}>Xin chào, {user?.fullName || user?.username}</Text>
              <Text style={styles.heroTitle}>Bạn muốn mua gì hôm nay?</Text>
              <Text style={styles.heroDesc}>Tìm nhanh sản phẩm, thêm vào giỏ và checkout mock để demo.</Text>
            </View>

            <View style={styles.searchBox}>
              <Input
                value={query}
                onChangeText={setQuery}
                placeholder="Tìm iPhone, laptop, phụ kiện..."
                returnKeyType="search"
              />
              {query.length > 0 ? (
                <TouchableOpacity onPress={() => setQuery('')} style={styles.clearButton}>
                  <Text style={styles.clearText}>Xóa tìm kiếm</Text>
                </TouchableOpacity>
              ) : null}
              {suggestions.length > 0 ? (
                <View style={styles.suggestions}>
                  <Text style={styles.suggestionTitle}>Gợi ý</Text>
                  {suggestions.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.suggestionItem}
                      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                    >
                      <Text numberOfLines={1} style={styles.suggestionName}>{item.name}</Text>
                      <Text style={styles.suggestionPrice}>{formatCurrency(item.price)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}
            </View>

            <FlatList
              horizontal
              data={categories}
              keyExtractor={(item) => item}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.categoryChip, category === item && styles.categoryChipActive]}
                  onPress={() => setCategory(item)}
                >
                  <Text style={[styles.categoryText, category === item && styles.categoryTextActive]}>{item}</Text>
                </TouchableOpacity>
              )}
            />

            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Sản phẩm nổi bật</Text>
                <Text style={styles.sectionDesc}>{visibleProducts.length} sản phẩm phù hợp</Text>
              </View>
              <View style={styles.sorts}>
                {[
                  ['default', 'Mặc định'],
                  ['priceAsc', 'Giá thấp'],
                  ['priceDesc', 'Giá cao'],
                ].map(([value, label]) => (
                  <TouchableOpacity
                    key={value}
                    style={[styles.sortChip, sort === value && styles.sortChipActive]}
                    onPress={() => setSort(value as typeof sort)}
                  >
                    <Text style={[styles.sortText, sort === value && styles.sortTextActive]}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={<EmptyState title="Không có sản phẩm" description="Thử từ khóa hoặc danh mục khác." />}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.card, index % 2 === 0 ? styles.cardLeft : styles.cardRight]}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
          >
            <View style={styles.imageWrap}>
              <Image source={{ uri: getProductImageUrl(item) }} style={styles.image} resizeMode="cover" />
              <Text style={[styles.stockBadge, (item.stock || 0) <= 0 && styles.outBadge]}>
                {(item.stock || 0) > 0 ? 'Còn hàng' : 'Hết hàng'}
              </Text>
            </View>
            <Text numberOfLines={2} style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{formatCurrency(item.price)}</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => addProduct(item)}>
              <Text style={styles.addText}>Thêm giỏ</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  list: { padding: 16, gap: 12 },
  hero: { backgroundColor: '#111827', borderRadius: 18, padding: 18, marginBottom: 14 },
  hello: { color: '#BFDBFE', fontWeight: '800', marginBottom: 8 },
  heroTitle: { color: '#fff', fontSize: 25, fontWeight: '900', lineHeight: 31 },
  heroDesc: { color: '#D1D5DB', marginTop: 8, lineHeight: 20 },
  searchBox: { backgroundColor: colors.surface, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
  clearButton: { alignSelf: 'flex-end', marginBottom: 8 },
  clearText: { color: colors.primary, fontWeight: '800' },
  suggestions: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 8 },
  suggestionTitle: { color: colors.muted, fontWeight: '900', marginBottom: 4 },
  suggestionItem: { paddingVertical: 9, flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  suggestionName: { flex: 1, color: colors.text, fontWeight: '800' },
  suggestionPrice: { color: colors.primary, fontWeight: '900' },
  categoryList: { gap: 8, paddingBottom: 12 },
  categoryChip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  categoryChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryText: { color: colors.muted, fontWeight: '800' },
  categoryTextActive: { color: '#fff' },
  sectionHeader: { gap: 10, marginBottom: 12 },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: '900' },
  sectionDesc: { color: colors.muted, marginTop: 3, fontWeight: '700' },
  sorts: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sortChip: { paddingHorizontal: 11, paddingVertical: 7, borderRadius: 999, backgroundColor: '#E5E7EB' },
  sortChipActive: { backgroundColor: '#DBEAFE' },
  sortText: { color: colors.muted, fontWeight: '800', fontSize: 12 },
  sortTextActive: { color: colors.primary },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardLeft: { marginRight: 0 },
  cardRight: { marginLeft: 0, transform: [{ translateY: 10 }] },
  imageWrap: { position: 'relative' },
  image: { width: '100%', aspectRatio: 1, borderRadius: 13, backgroundColor: '#EEF2F7' },
  stockBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#DCFCE7', color: colors.success, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, fontWeight: '900', fontSize: 11 },
  outBadge: { backgroundColor: '#FEE2E2', color: colors.danger },
  name: { color: colors.text, fontWeight: '900', fontSize: 14, minHeight: 40, marginTop: 10, lineHeight: 20 },
  price: { color: colors.primary, fontWeight: '900', marginTop: 6, fontSize: 15 },
  addButton: { marginTop: 10, backgroundColor: '#EFF6FF', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  addText: { color: colors.primary, fontWeight: '900' },
});
