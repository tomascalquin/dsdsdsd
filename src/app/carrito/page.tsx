"use client";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-10 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-4xl">
          🛒
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Tu carrito está vacío</h1>
        <p className="text-gray-500 mb-8">Parece que aún no has agregado productos.</p>
        <Link 
          href="/" 
          className="px-8 py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg"
        >
          Volver a la Tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black mb-8 text-gray-900">Tu Carrito ({items.length})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LISTA DE PRODUCTOS */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center transition-all hover:shadow-md">
                
                {/* IMAGEN */}
                <div className="relative w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    fill
                    className="object-cover"
                  />
                </div>

                {/* DETALLES */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{item.title}</h3>
                  <p className="text-gray-500 text-sm mb-2">${item.price.toLocaleString("es-CL")}</p>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black font-bold"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black font-bold"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-red-500 font-bold hover:underline ml-2"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                {/* PRECIO TOTAL */}
                <div className="text-right hidden sm:block">
                  <p className="font-black text-lg">${(item.price * item.quantity).toLocaleString("es-CL")}</p>
                </div>
              </div>
            ))}
          </div>

          {/* RESUMEN DE PAGO */}
          <div className="h-fit">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-24">
              <h2 className="text-xl font-black mb-6">Resumen</h2>
              
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>${cartTotal.toLocaleString("es-CL")}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Envío</span>
                  <span className="text-green-600 font-bold">Gratis</span>
                </div>
                <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between text-xl font-black text-gray-900">
                  <span>Total</span>
                  <span>${cartTotal.toLocaleString("es-CL")}</span>
                </div>
              </div>

              {/* AQUÍ ESTABA EL ERROR: Cambiamos el <button> por un <Link> a /checkout */}
              <Link 
                href="/checkout"
                className="block w-full text-center bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:scale-[1.02]"
              >
                Ir a Pagar
              </Link>
              
              <p className="text-center text-xs text-gray-400 mt-4">
                🔒 Checkout seguro con WebPay
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}