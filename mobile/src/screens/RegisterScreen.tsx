import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, Input, Screen, Title } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../api/client';

export const RegisterScreen = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);

  const setField = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async () => {
    if (!form.username || !form.email || !form.password || !form.fullName) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tài khoản, email, tên và mật khẩu.');
      return;
    }
    setLoading(true);
    try {
      await register({ ...form, roles: ['user'] });
    } catch (error) {
      Alert.alert('Không đăng ký được', getErrorMessage(error, 'Vui lòng kiểm tra lại thông tin.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <Screen padded={false}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Title subtitle="Tạo tài khoản khách hàng để bắt đầu mua sắm.">Đăng ký</Title>
          <Input label="Tên đăng nhập" value={form.username} onChangeText={(v) => setField('username', v)} autoCapitalize="none" />
          <Input label="Email" value={form.email} onChangeText={(v) => setField('email', v)} autoCapitalize="none" keyboardType="email-address" />
          <Input label="Mật khẩu" value={form.password} onChangeText={(v) => setField('password', v)} secureTextEntry />
          <Input label="Họ tên" value={form.fullName} onChangeText={(v) => setField('fullName', v)} />
          <Input label="Số điện thoại" value={form.phoneNumber} onChangeText={(v) => setField('phoneNumber', v)} keyboardType="phone-pad" />
          <Input label="Địa chỉ" value={form.address} onChangeText={(v) => setField('address', v)} />
          <Button title="Tạo tài khoản" onPress={submit} loading={loading} />
        </ScrollView>
      </Screen>
    </KeyboardAvoidingView>
  );
};
