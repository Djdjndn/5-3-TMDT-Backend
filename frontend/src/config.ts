export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const buildApiUrl = (path: string): string => {
  const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  if (!path) {
    return baseUrl;
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};

// Log API URL cho mục đích debug
console.log('API URL configured as:', API_URL);

export const WS_URL = process.env.REACT_APP_WS_URL || 
  'ws://localhost:8089';
console.log('WebSocket URL configured as:', WS_URL);

// API Routes for authentication
export const AUTH_SIGNIN = '/auth/signin';
export const AUTH_SIGNUP = '/auth/signup';

// Lưu ý: Các endpoint trong backend đã bao gồm tiền tố '/api'
// Ví dụ: '/api/chat/sessions', '/api/auth/signin'
// Do đó không cần thêm '/api' vào API_URL
