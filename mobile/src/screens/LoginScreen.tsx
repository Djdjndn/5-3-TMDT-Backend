import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Input, Screen, Title } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../api/client';
import { RootStackParamList } from '../types';
import { colors } from '../config';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tài khoản và mật khẩu.');
      return;
    }
    setLoading(true);
    try {
      await login({ username: username.trim(), password });
    } catch (error) {
      Alert.alert('Không đăng nhập được', getErrorMessage(error, 'Sai tài khoản hoặc mật khẩu.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <Screen>
        <Title subtitle="Đăng nhập để mua hàng, theo dõi đơn và chat hỗ trợ.">TMDT Mobile</Title>
        <Input label="Tài khoản hoặc email" value={username} onChangeText={setUsername} autoCapitalize="none" />
        <Input label="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry />
        <Button title="Đăng nhập" onPress={submit} loading={loading} />
        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: 18, alignItems: 'center' }}>
          <Text style={{ color: colors.primary, fontWeight: '800' }}>Chưa có tài khoản? Đăng ký</Text>
        </TouchableOpacity>
      </Screen>
    </KeyboardAvoidingView>
  );
};
