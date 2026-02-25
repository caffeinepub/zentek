import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PRODUCTS, LocalProduct } from '../data/products';

export interface CartItem {
  productId: string;
  quantity: number;
  product: LocalProduct;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'zentek_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: { productId: string; quantity: number }[] = JSON.parse(stored);
        return parsed
          .map((item) => {
            const product = PRODUCTS.find((p) => p.id === item.productId);
            if (!product) return null;
            return { productId: item.productId, quantity: item.quantity, product };
          })
          .filter(Boolean) as CartItem[];
      }
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    const toStore = items.map(({ productId, quantity }) => ({ productId, quantity }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [items]);

  const addToCart = useCallback((productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { productId, quantity: 1, product }];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
      );
    }
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
