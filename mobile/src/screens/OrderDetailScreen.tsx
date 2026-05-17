import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { orderApi } from '../api/orderApi';
import { getErrorMessage } from '../api/client';
import { colors } from '../config';
import { EmptyState, LoadingState, Screen } from '../components/ui';
import { Order, RootStackParamList } from '../types';
import { formatCurrency, formatDate, getStatusLabel } from '../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderDetail'>;

export const OrderDetailScreen: React.FC<Props> = ({ route }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.detail(route.params.orderId)
      .then(setOrder)
      .catch((error) => Alert.alert('Không tải được đơn hàng', getErrorMessage(error)))
      .finally(() => setLoading(false));
  }, [route.params.orderId]);

  if (loading) return <LoadingState />;
  if (!order) return <EmptyState title="Không tìm thấy đơn hàng" />;

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={styles.panel}>
          <Text style={styles.title}>Đơn #{order.id}</Text>
          <Text style={styles.status}>{getStatusLabel(order.status)}</Text>
          <Text style={styles.meta}>Ngày đặt: {formatDate(order.createdAt || order.orderDate)}</Text>
          <Text style={styles.meta}>Thanh toán: {order.paymentMethod || 'Không rõ'} - {order.paymentStatus || 'Chưa rõ'}</Text>
          <Text style={styles.total}>{formatCurrency(order.totalAmount || order.total || 0)}</Text>
        </View>
        <View style={styles.panel}>
          <Text style={styles.section}>Giao hàng</Text>
          <Text style={styles.text}>{order.recipientName || 'Người nhận'}</Text>
          <Text style={styles.text}>{order.phoneNumber || ''}</Text>
          <Text style={styles.text}>{order.shippingAddress || 'Không có địa chỉ'}</Text>
        </View>
        <View style={styles.panel}>
          <Text style={styles.section}>Sản phẩm</Text>
          {(order.items || []).map((item, index) => (
            <View key={item.id || index} style={styles.item}>
              <Text style={styles.itemName}>{item.product?.name || item.productName || `Sản phẩm #${item.productId || ''}`}</Text>
              <Text style={styles.itemMeta}>x{item.quantity} {item.price ? `- ${formatCurrency(item.price)}` : ''}</Text>
            </View>
          ))}
          {!order.items?.length ? <Text style={styles.meta}>Không có dữ liệu sản phẩm.</Text> : null}
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  panel: { backgroundColor: colors.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 14 },
  title: { fontSize: 22, fontWeight: '900', color: colors.text },
  status: { color: colors.primary, fontWeight: '900', marginTop: 6 },
  meta: { color: colors.muted, marginTop: 8 },
  total: { color: colors.text, fontSize: 22, fontWeight: '900', marginTop: 14 },
  section: { color: colors.text, fontWeight: '900', fontSize: 17, marginBottom: 10 },
  text: { color: colors.text, lineHeight: 22 },
  item: { paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border },
  itemName: { color: colors.text, fontWeight: '800' },
  itemMeta: { color: colors.muted, marginTop: 4 },
});
