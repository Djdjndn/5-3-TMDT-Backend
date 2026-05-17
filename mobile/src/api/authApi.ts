import { api } from './client';
import { User } from '../types';

export type LoginPayload = {
  username: string;
  password: string;
};

export type RegisterPayload = LoginPayload & {
  email: string;
  fullName: string;
  phoneNumber?: string;
  address?: string;
  roles?: string[];
};

export const authApi = {
  async login(payload: LoginPayload): Promise<User> {
    const response = await api.post('/auth/signin', payload);
    const data = response.data;
    return { ...data, token: data.token || data.accessToken };
  },

  async register(payload: RegisterPayload) {
    const response = await api.post('/auth/signup', {
      ...payload,
      roles: payload.roles || ['user'],
    });
    return response.data;
  },
};
