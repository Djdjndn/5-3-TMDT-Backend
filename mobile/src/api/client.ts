import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const raw = await AsyncStorage.getItem('authUser');
  if (raw) {
    const user = JSON.parse(raw);
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

export const getErrorMessage = (error: unknown, fallback = 'Đã xảy ra lỗi') => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as any;
    return data?.message || data?.error || error.message || fallback;
  }
  return fallback;
};
