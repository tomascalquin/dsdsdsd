"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  // 👇 ESTA ES LA LÍNEA MÁGICA. TIENE QUE DECIR 'cart', NO 'items'
  const { cart, removeFromCart, total } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h1>
        <Link href="/" className="bg-black text-white px-8 py-3 rounded-xl font-bold mt-4">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-8">Carrito</h1>
      <div className="space-y-4">
        {cart.map((product) => (
          <div key={product.id} className="flex justify-between items-center border p-4 rounded-xl">
             <div className="flex items-center gap-4">
               <img src={product.image || "/placeholder.png"} className="w-16 h-16 object-cover rounded" />
               <div>
                 <p className="font-bold">{product.title}</p>
                 <p className="text-gray-500">${product.price}</p>
               </div>
             </div>
             <button onClick={() => removeFromCart(product.id)} className="text-red-500 font-bold">
               Eliminar
             </button>
          </div>
        ))}
        
        <div className="mt-8 border-t pt-4 text-right">
          <p className="text-xl font-black">Total: ${total}</p>
          <Link href="/checkout" className="inline-block bg-black text-white px-6 py-3 rounded-xl font-bold mt-4">
            Pagar Ahora
          </Link>
        </div>
      </div>
    </div>
  );
}