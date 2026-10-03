"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/data/products';
import { api } from '@/services/api';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalBoxes: number;
  totalUniqueItems: number;
  totalMRP: number;
  totalWholesale: number;
  totalSavings: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  lastAddedItem: { product: Product; qty: number } | null;
  moqTarget: number;
  moqMet: boolean;
  moqProgress: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [moqTarget, setMoqTarget] = useState<number>(3000);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<{ product: Product; qty: number } | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage and load dynamic minimum cart value from backend
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sivaji_cart_v1');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    }
    setIsInitialized(true);

    api.getSettings().then((s) => {
      if (s?.minimum_cart_value) {
        setMoqTarget(s.minimum_cart_value);
      }
    }).catch(() => {});
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('sivaji_cart_v1', JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save cart to storage', e);
      }
    }
  }, [items, isInitialized]);

  const addToCart = (product: Product, quantity = 1) => {
    if (quantity <= 0) return;
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    setLastAddedItem({ product, qty: quantity });
    setTimeout(() => {
      setLastAddedItem((cur) => (cur?.product.id === product.id ? null : cur));
    }, 2800);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalBoxes = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalUniqueItems = items.length;
  const totalMRP = items.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0);
  const totalWholesale = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalSavings = totalMRP - totalWholesale;

  const moqMet = totalWholesale >= moqTarget;
  const moqProgress = Math.min(100, Math.round((totalWholesale / moqTarget) * 100));

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalBoxes,
        totalUniqueItems,
        totalMRP,
        totalWholesale,
        totalSavings,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        lastAddedItem,
        moqTarget,
        moqMet,
        moqProgress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
