import { api } from './client';
import { Order, OrderPayload } from '../types';

export const orderApi = {
  async create(payload: OrderPayload): Promise<Order> {
    const response = await api.post('/orders', payload);
    return response.data;
  },

  async pay(payload: OrderPayload): Promise<string> {
    const response = await api.post('/orders/pay', payload);
    return response.data;
  },

  async myOrders(): Promise<Order[]> {
    const response = await api.get('/orders/my-orders');
    return Array.isArray(response.data) ? response.data : [];
  },

  async detail(orderId: number): Promise<Order> {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },
};
