"use client";

import { useCart } from "@/context/CartContext";

// Recibimos los datos del producto que queremos agregar
export default function AddToCartBtn({ id, title, price, image }: any) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart({ id, title, price, image, quantity: 1 })}
      className="flex-1 bg-black text-white py-4 px-8 rounded-xl text-lg font-bold hover:bg-gray-800 transition-transform active:scale-95 shadow-xl shadow-black/10"
    >
      Agregar al Carrito
    </button>
  );
}