"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void; // <--- NUEVO: Función para vaciar
  total: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {}, // <--- Default vacío
  total: 0,
  isCartOpen: false,
  openCart: () => {},
  closeCart: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("dropsc_cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("dropsc_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        toast.info("Ya está en el carrito");
        setIsCartOpen(true);
        return prev;
      }
      toast.success("Agregado al carrito");
      setIsCartOpen(true);
      return [...prev, { ...product, quantity: 1, image: product.image || product.product_images?.[0]?.url }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    toast.error("Producto eliminado");
  };

  // <--- NUEVA FUNCIÓN
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("dropsc_cart");
  };

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart, // <--- La exportamos
      total,
      isCartOpen, 
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false)
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);