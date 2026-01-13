import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: number;
  type: 'product' | 'tour';
  name: string;
  price: number;
  quantity: number;
  image?: string;
  // Tour-specific fields
  tourDate?: string;
  tourTime?: string;
  guests?: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number, type: 'product' | 'tour') => void;
  updateQuantity: (id: number, type: 'product' | 'tour', quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  couponCode: string | null;
  setCouponCode: (code: string | null) => void;
  discount: number;
  setDiscount: (discount: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'letitride_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        i => i.id === item.id && i.type === item.type
      );
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        if (item.type === 'product') {
          updated[existingIndex].quantity += item.quantity;
        }
        return updated;
      }
      
      return [...prev, item];
    });
  };

  const removeItem = (id: number, type: 'product' | 'tour') => {
    setItems(prev => prev.filter(item => !(item.id === id && item.type === type)));
  };

  const updateQuantity = (id: number, type: 'product' | 'tour', quantity: number) => {
    if (quantity <= 0) {
      removeItem(id, type);
      return;
    }
    
    setItems(prev => prev.map(item => 
      item.id === id && item.type === type 
        ? { ...item, quantity } 
        : item
    ));
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode(null);
    setDiscount(0);
  };

  const getTotal = () => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return subtotal - discount;
  };

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotal,
      getItemCount,
      couponCode,
      setCouponCode,
      discount,
      setDiscount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
