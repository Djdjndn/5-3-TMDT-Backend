import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { orderApi } from '../api/orderApi';
import { getErrorMessage } from '../api/client';
import { colors } from '../config';
import { Button, Input, Screen, Title } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { RootStackParamList } from '../types';
import { formatCurrency } from '../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

export const CheckoutScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const { items, total, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    recipientName: user?.fullName || user?.username || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
    paymentMethod: 'cod',
  });

  const setField = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async () => {
    if (!items.length) {
      Alert.alert('Giỏ hàng trống', 'Vui lòng thêm sản phẩm trước khi checkout.');
      return;
    }
    if (!form.recipientName || !form.phoneNumber || !form.address) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đủ người nhận, số điện thoại và địa chỉ.');
      return;
    }

    const payload = {
      recipientName: form.recipientName,
      phoneNumber: form.phoneNumber,
      shippingAddress: form.address,
      paymentMethod: form.paymentMethod,
      total,
      items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
    };

    setLoading(true);
    try {
      if (form.paymentMethod === 'credit') {
        const url = await orderApi.pay(payload);
        if (!url.includes('vnp_ResponseCode=00')) {
          throw new Error('Cổng thanh toán chưa trả trạng thái thành công.');
        }
      }
      const order = await orderApi.create(payload);
      clear();
      Alert.alert('Đặt hàng thành công', `Mã đơn #${order.id}`, [
        { text: 'Xem đơn', onPress: () => navigation.replace('OrderDetail', { orderId: order.id }) },
      ]);
    } catch (error) {
      Alert.alert('Không đặt được hàng', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Title subtitle="Thanh toán mock sẽ tạo đơn ngay trong app, không dùng tiền thật.">Checkout</Title>
        <View style={styles.panel}>
          <Text style={styles.section}>Thông tin giao hàng</Text>
          <Input label="Người nhận" value={form.recipientName} onChangeText={(v) => setField('recipientName', v)} />
          <Input label="Số điện thoại" value={form.phoneNumber} onChangeText={(v) => setField('phoneNumber', v)} keyboardType="phone-pad" />
          <Input label="Địa chỉ" value={form.address} onChangeText={(v) => setField('address', v)} multiline />
        </View>
        <View style={styles.panel}>
          <Text style={styles.section}>Phương thức thanh toán</Text>
          {[
            ['cod', 'Thanh toán khi nhận hàng'],
            ['credit', 'Thanh toán mock VNPay'],
          ].map(([value, label]) => (
            <TouchableOpacity
              key={value}
              onPress={() => setField('paymentMethod', value)}
              style={[styles.payment, form.paymentMethod === value && styles.paymentActive]}
            >
              <Text style={[styles.paymentText, form.paymentMethod === value && styles.paymentTextActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.panel}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{items.length} sản phẩm</Text>
            <Text style={styles.total}>{formatCurrency(total)}</Text>
          </View>
          <Button title="Đặt hàng" onPress={submit} loading={loading} />
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  panel: { backgroundColor: colors.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 14 },
  section: { fontSize: 17, fontWeight: '900', color: colors.text, marginBottom: 12 },
  payment: { padding: 13, borderRadius: 10, borderWidth: 1, borderColor: colors.border, marginBottom: 10 },
  paymentActive: { borderColor: colors.primary, backgroundColor: '#EFF6FF' },
  paymentText: { color: colors.text, fontWeight: '800' },
  paymentTextActive: { color: colors.primary },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  totalLabel: { color: colors.muted, fontWeight: '800' },
  total: { color: colors.text, fontWeight: '900', fontSize: 20 },
});
