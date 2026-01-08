"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number; // Agregamos cantidad
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  total: number;
  isCartOpen: boolean;      // NUEVO
  openCart: () => void;     // NUEVO
  closeCart: () => void;    // NUEVO
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  total: 0,
  isCartOpen: false,
  openCart: () => {},
  closeCart: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false); // Estado del menú lateral

  // Cargar carrito del localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem("dropsc_cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Guardar en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem("dropsc_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any) => {
    setCart((prev) => {
      // Si ya existe, no lo duplicamos (o podrías sumar cantidad)
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        toast.info("Este producto ya está en el carrito");
        setIsCartOpen(true); // Abrimos el carrito para que lo vea
        return prev;
      }
      toast.success("Agregado al carrito");
      setIsCartOpen(true); // Abrimos el carrito automáticamente al comprar
      return [...prev, { ...product, quantity: 1, image: product.image || product.product_images?.[0]?.url }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    toast.error("Producto eliminado");
  };

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
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