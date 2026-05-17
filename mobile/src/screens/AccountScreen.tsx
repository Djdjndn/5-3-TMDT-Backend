import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Screen, Title } from '../components/ui';
import { colors } from '../config';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const AccountScreen = () => {
  const { user, logout } = useAuth();
  const { clear } = useCart();

  const handleLogout = async () => {
    clear();
    await logout();
  };

  return (
    <Screen>
      <Title subtitle="Thông tin tài khoản đang đăng nhập trên app mobile.">Tài khoản</Title>
      <View style={styles.card}>
        <Text style={styles.name}>{user?.fullName || user?.username}</Text>
        <Text style={styles.meta}>{user?.email}</Text>
        <Text style={styles.meta}>{user?.phoneNumber || 'Chưa có số điện thoại'}</Text>
        <Text style={styles.meta}>{user?.address || 'Chưa có địa chỉ'}</Text>
        <Text style={styles.role}>{user?.primaryRole || user?.roles?.join(', ') || 'ROLE_USER'}</Text>
      </View>
      <Button title="Đăng xuất" variant="danger" onPress={handleLogout} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 10 },
  name: { fontSize: 22, fontWeight: '900', color: colors.text },
  meta: { color: colors.muted, marginTop: 8 },
  role: { marginTop: 12, color: colors.primary, fontWeight: '900' },
});
