import { buildApiUrl } from '../config';
import { Product } from '../types';

export const getProductImageUrl = (product: Pick<Product, 'id' | 'imageUrl' | 'updatedAt'>) => {
  const source = product.imageUrl
    ? buildApiUrl(product.imageUrl.startsWith('/') ? product.imageUrl : `/${product.imageUrl}`)
    : buildApiUrl(`/products/images/product/${product.id}`);
  const version = product.updatedAt ? encodeURIComponent(product.updatedAt) : String(product.id);
  return `${source}${source.includes('?') ? '&' : '?'}v=${version}`;
};
