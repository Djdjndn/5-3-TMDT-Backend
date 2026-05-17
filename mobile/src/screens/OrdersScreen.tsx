import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { orderApi } from '../api/orderApi';
import { getErrorMessage } from '../api/client';
import { colors } from '../config';
import { EmptyState, LoadingState, Screen, Title } from '../components/ui';
import { Order, RootStackParamList } from '../types';
import { formatCurrency, formatDate, getStatusLabel } from '../utils/format';

type Nav = NativeStackScreenProps<RootStackParamList>['navigation'];

const getStatusStyle = (status?: string) => {
  if (status === 'DELIVERED' || status === 'COMPLETED') return { bg: '#DCFCE7', fg: colors.success };
  if (status === 'CANCELLED' || status === 'RETURNED') return { bg: '#FEE2E2', fg: colors.danger };
  if (status === 'PENDING' || status === 'PROCESSING') return { bg: '#FEF3C7', fg: colors.warning };
  return { bg: '#DBEAFE', fg: colors.primary };
};

export const OrdersScreen = () => {
  const navigation = useNavigation<Nav>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setOrders(await orderApi.myOrders());
    } catch (error) {
      Alert.alert('Không tải được đơn hàng', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (loading) return <LoadingState />;

  return (
    <Screen padded={false}>
      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        ListHeaderComponent={<Title subtitle="Theo dõi trạng thái và tổng tiền của từng đơn.">Đơn hàng của tôi</Title>}
        ListEmptyComponent={<EmptyState title="Chưa có đơn hàng" description="Sau khi checkout, đơn sẽ xuất hiện ở đây." />}
        renderItem={({ item }) => {
          const chip = getStatusStyle(item.status);
          const itemCount = item.items?.reduce((sum, orderItem) => sum + orderItem.quantity, 0) || 0;
          return (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}>
              <View style={styles.row}>
                <Text style={styles.id}>Đơn #{item.id}</Text>
                <Text style={[styles.status, { backgroundColor: chip.bg, color: chip.fg }]}>{getStatusLabel(item.status)}</Text>
              </View>
              <Text style={styles.meta}>Ngày đặt: {formatDate(item.createdAt || item.orderDate)}</Text>
              <View style={styles.bottomRow}>
                <Text style={styles.count}>{itemCount || 'Nhiều'} sản phẩm</Text>
                <Text style={styles.total}>{formatCurrency(item.totalAmount || item.total || 0)}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, alignItems: 'center' },
  id: { fontSize: 17, fontWeight: '900', color: colors.text },
  status: { overflow: 'hidden', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, fontWeight: '900', fontSize: 12 },
  meta: { color: colors.muted, marginTop: 10, fontWeight: '700' },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 14 },
  count: { color: colors.muted, fontWeight: '800' },
  total: { color: colors.text, fontWeight: '900', fontSize: 18 },
});
