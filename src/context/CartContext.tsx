"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type CartItem = {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: number) => void; // <--- NUEVA FUNCIÓN   
  clearCart: () => void;
  cartCount: number;
  cartTotal: number; // <--- NUEVA VAR: Total en dinero
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const clearCart = () => {
    setItems([]);
  };
  const addToCart = (product: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    // Quitamos el alert para que sea más elegante
  };

  // Función para eliminar un producto completo
  const removeFromCart = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  
  // Calculamos el precio total de todo el carrito
  const cartTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de un CartProvider");
  return context;
}