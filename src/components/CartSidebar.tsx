"use client";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartSidebar() {
  const { cart, removeFromCart, total, isCartOpen, closeCart } = useCart();
  const [isVisible, setIsVisible] = useState(false);

  // Truco para animar la entrada/salida suavemente
  useEffect(() => {
    if (isCartOpen) setIsVisible(true);
    else setTimeout(() => setIsVisible(false), 300); // Espera que termine la animación para desmontar
  }, [isCartOpen]);

  if (!isVisible && !isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      
      {/* FONDO OSCURO (Al hacer click cierra) */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isCartOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeCart}
      />

      {/* PANEL LATERAL */}
      <aside 
        className={`relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transition-transform duration-300 transform ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        
        {/* HEADER */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white z-10">
          <h2 className="text-xl font-black text-gray-900">Tu Carrito ({cart.length})</h2>
          <button 
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            ✕
          </button>
        </div>

        {/* LISTA DE PRODUCTOS */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-4">
              <span className="text-6xl">🛒</span>
              <p>Tu carrito está vacío.</p>
              <button 
                onClick={closeCart} 
                className="text-orange-500 font-bold hover:underline"
              >
                Seguir explorando
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                {/* Imagen */}
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200">
                  <img 
                    src={item.image || "/placeholder.png"} 
                    alt={item.title} 
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-bold text-gray-900">
                      <h3 className="line-clamp-2 leading-tight">{item.title}</h3>
                      <p className="ml-4">${item.price.toLocaleString("es-CL")}</p>
                    </div>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <p className="text-gray-500">Cant: 1</p>
                    <button 
                      type="button" 
                      onClick={() => removeFromCart(item.id)}
                      className="font-medium text-red-500 hover:text-red-700 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER (Total y Botón Pagar) */}
        {cart.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-gray-50">
            <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
              <p>Subtotal</p>
              <p className="text-xl font-black">${total.toLocaleString("es-CL")}</p>
            </div>
            <p className="mt-0.5 text-xs text-gray-500 mb-6">
              El envío se calcula en el siguiente paso.
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex items-center justify-center rounded-xl border border-transparent bg-black px-6 py-4 text-base font-bold text-white shadow-sm hover:bg-gray-800 transition-all hover:scale-[1.02] active:scale-95"
            >
              Ir a Pagar
            </Link>
            <div className="mt-6 flex justify-center text-center text-xs text-gray-500">
              <button onClick={closeCart} className="font-medium text-orange-600 hover:text-orange-500">
                O Seguir Comprando
                <span aria-hidden="true"> &rarr;</span>
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}