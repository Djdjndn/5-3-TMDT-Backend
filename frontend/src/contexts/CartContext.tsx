import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { CartItem } from '../types/cart';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'tmdt_cart_items';

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Failed to restore cart:', error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const clampQuantity = (item: CartItem, quantity: number) => {
    const normalized = Math.max(1, quantity);
    return item.stock ? Math.min(item.stock, normalized) : normalized;
  };

  const addToCart = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((cartItem) => cartItem.id === item.id);

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingItemIndex];
        const mergedItem = { ...existingItem, stock: item.stock ?? existingItem.stock };
        updatedItems[existingItemIndex] = {
          ...mergedItem,
          quantity: clampQuantity(mergedItem, existingItem.quantity + (item.quantity || 1)),
        };
        return updatedItems;
      }

      return [...prevItems, { ...item, quantity: clampQuantity(item, item.quantity || 1) }];
    });
  };

  const removeFromCart = useCallback((id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity: clampQuantity(item, quantity) } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
