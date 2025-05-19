"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { productVariants } from '../components/productVariants';

export interface CartItem {
  id: string; // product or variant id
  name: string;
  color: string;
  logo: string;
  size: string;
  price: number;
  quantity: number;
  image?: string;
  variantId?: number;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size: string, color: string, logo: string) => void;
  updateQuantity: (id: string, size: string, color: string, logo: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  shippingMethod: ShippingMethod | null;
  setShippingMethod: (method: ShippingMethod | null) => void;
  shippingCost: number;
}

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  currency: string;
  delivery_time: string;
  is_express: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod | null>(null);
  const [shippingCost, setShippingCost] = useState(0);

  const addItem = (item: CartItem) => {
    // Failsafe: check stock status if possible
    let stockStatus = 'In Stock';
    if (item.variantId) {
      // Try to find the stock status in productVariants
      for (const productId in productVariants) {
        for (const color in productVariants[productId]) {
          for (const size in productVariants[productId][color]) {
            const variant = productVariants[productId][color][size];
            if (variant.variant_id === item.variantId) {
              stockStatus = variant.stock_status;
              break;
            }
          }
        }
      }
    }
    if (stockStatus === 'Out of Stock') {
      alert('This item is out of stock and cannot be added to the cart.');
      return;
    }
    setItems(prev => {
      // Check if item with same id, size, color, logo exists
      const existing = prev.find(
        i => i.id === item.id && i.size === item.size && i.color === item.color && i.logo === item.logo
      );
      if (existing) {
        // Update quantity
        return prev.map(i =>
          i.id === item.id && i.size === item.size && i.color === item.color && i.logo === item.logo
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (id: string, size: string, color: string, logo: string) => {
    setItems(prev => prev.filter(i => !(i.id === id && i.size === size && i.color === color && i.logo === logo)));
  };

  const updateQuantity = (id: string, size: string, color: string, logo: string, quantity: number) => {
    setItems(prev =>
      prev.map(i =>
        i.id === id && i.size === size && i.color === color && i.logo === logo
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart, subtotal,
      isCartOpen, setIsCartOpen, shippingMethod, setShippingMethod, shippingCost
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
} 
