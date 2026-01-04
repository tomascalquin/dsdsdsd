"use client"
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PurchaseButtons({ product }: { product: any }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleBuyNow = () => {
    addToCart(product);
    router.push("/carrito"); // Redirige al flujo de checkout
  };

  return (
    <div className="flex flex-col gap-3 w-full mt-6">
      {/* Botón Compra Directa - Color Vibrante */}
      <button 
        onClick={handleBuyNow}
        className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-black py-5 rounded-2xl text-xl shadow-xl hover:shadow-orange-200 transition-all active:scale-95 uppercase tracking-tighter"
      >
        🚀 Comprar Ahora
      </button>

      {/* Botón Carrito - Color Elegante */}
      <button 
        onClick={handleAddToCart}
        className={`w-full py-4 rounded-2xl font-bold transition-all border-2 ${
          isAdding 
          ? "bg-green-500 border-green-500 text-white" 
          : "bg-white border-gray-900 text-gray-900 hover:bg-gray-50"
        }`}
      >
        {isAdding ? "¡Añadido! ✓" : "Añadir al Carrito"}
      </button>
      
      <p className="text-center text-[10px] text-gray-400 font-bold uppercase mt-2">
        📦 Envío gratis aplicado a este artículo
      </p>
    </div>
  );
}