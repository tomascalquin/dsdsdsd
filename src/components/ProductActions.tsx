"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function ProductActions({ product }: { product: any }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  // Normalizamos la imagen para evitar errores
  const productImage = product.product_images?.[0]?.url || product.image || "/placeholder.png";

  const handleAddToCart = () => {
    setAdding(true);
    addToCart({ ...product, image: productImage });
    
    // Pequeño feedback visual
    setTimeout(() => setAdding(false), 500);
  };

  const handleBuyNow = () => {
    addToCart({ ...product, image: productImage });
    router.push("/carrito"); // O "/checkout" si prefieres ir directo al pago
  };

  return (
    <div className="flex flex-col gap-4 mt-8">
      <div className="flex gap-4">
        {/* BOTÓN 1: AGREGAR AL CARRITO */}
        <button 
          onClick={handleAddToCart}
          className={`flex-1 py-4 px-6 rounded-xl font-bold uppercase tracking-widest border-2 transition-all ${
            adding 
              ? "bg-green-500 border-green-500 text-white" 
              : "border-black text-black hover:bg-black hover:text-white"
          }`}
        >
          {adding ? "¡Agregado!" : "Agregar al Carrito"}
        </button>

        {/* BOTÓN 2: COMPRAR AHORA (Destacado) */}
        <button 
          onClick={handleBuyNow}
          className="flex-1 py-4 px-6 bg-orange-600 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-orange-500 shadow-lg shadow-orange-500/30 transition-all transform hover:scale-[1.02]"
        >
          Comprar Ahora
        </button>
      </div>
      
      <p className="text-center text-xs text-gray-400 mt-2">
        🔒 Pago seguro procesado vía WebPay / MercadoPago
      </p>
    </div>
  );
}