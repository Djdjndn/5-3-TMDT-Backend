import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EmptyState, Screen, Title } from '../components/ui';
import { colors } from '../config';
import { useCart } from '../context/CartContext';
import { RootStackParamList } from '../types';
import { formatCurrency } from '../utils/format';

type Nav = NativeStackScreenProps<RootStackParamList>['navigation'];

export const CartScreen = () => {
  const navigation = useNavigation<Nav>();
  const { items, total, updateQuantity, remove } = useCart();

  return (
    <Screen padded={false}>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.productId)}
        contentContainerStyle={{ padding: 16, paddingBottom: items.length ? 118 : 16, flexGrow: 1 }}
        ListHeaderComponent={<Title subtitle="Kiểm tra số lượng và tổng tiền trước khi checkout.">Giỏ hàng</Title>}
        ListEmptyComponent={<EmptyState title="Giỏ hàng đang trống" description="Thêm sản phẩm từ trang danh sách để tiếp tục." />}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.image} /> : null}
            <View style={{ flex: 1 }}>
              <Text numberOfLines={2} style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{formatCurrency(item.price)}</Text>
              <View style={styles.row}>
                <TouchableOpacity style={styles.step} onPress={() => updateQuantity(item.productId, item.quantity - 1)}>
                  <Text style={styles.stepText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qty}>{item.quantity}</Text>
                <TouchableOpacity style={styles.step} onPress={() => updateQuantity(item.productId, item.quantity + 1)}>
                  <Text style={styles.stepText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => remove(item.productId)} style={styles.removeButton}>
                  <Text style={styles.remove}>Xóa</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
      {items.length > 0 ? (
        <View style={styles.stickyBar}>
          <View>
            <Text style={styles.totalLabel}>{items.length} sản phẩm</Text>
            <Text style={styles.total}>{formatCurrency(total)}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={() => navigation.navigate('Checkout')}>
            <Text style={styles.checkoutText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </Screen>
  );
};

const styles = StyleSheet.create({
  item: { flexDirection: 'row', gap: 12, backgroundColor: colors.surface, borderRadius: 16, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  image: { width: 82, height: 82, borderRadius: 12, backgroundColor: '#EEF2F7' },
  name: { fontWeight: '900', color: colors.text, lineHeight: 20 },
  price: { color: colors.primary, fontWeight: '900', marginTop: 5 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 8 },
  step: { width: 32, height: 32, borderRadius: 9, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
  stepText: { color: colors.primary, fontWeight: '900', fontSize: 18 },
  qty: { minWidth: 28, textAlign: 'center', fontWeight: '900', color: colors.text },
  removeButton: { marginLeft: 'auto', paddingHorizontal: 8, paddingVertical: 5 },
  remove: { color: colors.danger, fontWeight: '900' },
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: { color: colors.muted, fontWeight: '800', fontSize: 12 },
  total: { color: colors.text, fontSize: 19, fontWeight: '900', marginTop: 2 },
  checkoutButton: { backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 22, paddingVertical: 13 },
  checkoutText: { color: '#fff', fontWeight: '900' },
});
