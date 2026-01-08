"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  // 🚨 CAMBIO IMPORTANTE: Ahora usamos 'cart' en vez de 'items'
  const { cart, removeFromCart, total } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-gray-100 p-6 rounded-full mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h1>
        <p className="text-gray-500 mb-8">Parece que aún no has agregado nada.</p>
        <Link href="/" className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Resumen de Compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LISTA DE PRODUCTOS (Izquierda) */}
        <div className="lg:col-span-8 space-y-6">
          {cart.map((product) => (
            <div key={product.id} className="flex gap-6 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              
              {/* Imagen */}
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200">
                <img
                  src={product.image || "/placeholder.png"}
                  alt={product.title}
                  className="h-full w-full object-cover object-center"
                />
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-900">
                      <Link href={`/producto/${product.id}`} className="hover:underline">
                        {product.title}
                      </Link>
                    </h3>
                    <p className="text-lg font-bold text-gray-900 ml-4">
                      ${product.price.toLocaleString("es-CL")}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Cantidad: 1</p>
                </div>

                <div className="flex items-end justify-between text-sm">
                  <div className="flex items-center gap-2 text-green-600 font-medium">
                    <span>✓ Disponible</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    className="font-bold text-red-500 hover:text-red-700 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RESUMEN DE PAGO (Derecha) */}
        <div className="lg:col-span-4">
          <div className="bg-gray-50 rounded-3xl p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Detalle del Pedido</h2>
            
            <div className="flow-root space-y-4">
              <div className="flex items-center justify-between text-gray-600">
                <p>Subtotal</p>
                <p>${total.toLocaleString("es-CL")}</p>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <p>Envío estimado</p>
                <p className="text-green-600 font-bold">Gratis</p>
              </div>
              
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between font-black text-xl text-gray-900">
                <p>Total</p>
                <p>${total.toLocaleString("es-CL")}</p>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full mt-8 bg-black text-white py-4 rounded-xl font-bold text-center block hover:bg-gray-800 transition-all shadow-lg hover:scale-[1.02] active:scale-95"
            >
              Ir a Pagar
            </Link>
            
            <div className="mt-6 flex justify-center gap-4 text-gray-400">
              <span className="text-2xl">💳</span>
              <span className="text-2xl">🔒</span>
              <span className="text-2xl">🚚</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}