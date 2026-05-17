import { api } from './client';
import { Product, Review } from '../types';

const normalizeProducts = (data: any): Product[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.products)) return data.products;
  return [];
};

export const productApi = {
  async list(): Promise<Product[]> {
    const response = await api.get('/products');
    return normalizeProducts(response.data);
  },

  async search(keyword: string): Promise<Product[]> {
    const response = await api.get('/products/search', { params: { keyword } });
    return normalizeProducts(response.data);
  },

  async detail(id: number): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async reviews(productId: number): Promise<Review[]> {
    const response = await api.get(`/reviews/product/${productId}`);
    return Array.isArray(response.data) ? response.data : [];
  },

  async createReview(productId: number, rating: number, comment: string) {
    const response = await api.post(`/reviews/product/${productId}/simple`, undefined, {
      params: { rating, comment },
    });
    return response.data;
  },
};
