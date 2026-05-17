import React, { createContext, useContext, useMemo, useState } from 'react';
import { CartItem, Product } from '../types';
import { getProductImageUrl } from '../utils/image';

type CartContextValue = {
  items: CartItem[];
  total: number;
  itemCount: number;
  addProduct: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    addProduct(product, quantity = 1) {
      setItems((current) => {
        const found = current.find((item) => item.productId === product.id);
        if (found) {
          return current.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: Math.min((item.stock || 99), item.quantity + quantity) }
              : item
          );
        }
        return [
          ...current,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            stock: product.stock,
            imageUrl: getProductImageUrl(product),
          },
        ];
      });
    },
    updateQuantity(productId, quantity) {
      setItems((current) =>
        current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(1, Math.min(item.stock || 99, quantity)) }
            : item
        )
      );
    },
    remove(productId) {
      setItems((current) => current.filter((item) => item.productId !== productId));
    },
    clear() {
      setItems([]);
    },
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
};
