import { Platform } from 'react-native';

const localHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const API_URL = process.env.EXPO_PUBLIC_API_URL || `http://${localHost}:8080`;

export const buildApiUrl = (path: string) => {
  const base = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};

export const colors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  text: '#111827',
  muted: '#6B7280',
  border: '#E5E7EB',
  danger: '#DC2626',
  success: '#16A34A',
  warning: '#D97706',
};
