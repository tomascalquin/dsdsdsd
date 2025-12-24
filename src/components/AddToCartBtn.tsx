"use client";

import { useCart } from "@/context/CartContext";

// Recibimos los datos del producto que queremos agregar
export default function AddToCartBtn({ id, title, price, image }: any) {
  const { addToCart } = useCart();

  return (
   
    <div className="flex flex-col gap-3 w-full">
      <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold py-4 rounded-xl text-xl transition-all transform hover:scale-105 shadow-orange-200 shadow-lg">
        COMPRAR AHORA 
      </button>
      <p className="text-center text-xs text-gray-500 animate-pulse">
        🔥 12 personas están viendo este producto ahora
      </p>
    </div>
  );
}