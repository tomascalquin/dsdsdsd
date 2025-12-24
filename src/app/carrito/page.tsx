"use client";

import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase"; // Importamos supabase
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Para redirigir al éxito

export default function CartPage() {
  const { items, removeFromCart, clearCart, cartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    setLoading(true);

    try {
      // 1. Crear la orden en la tabla 'orders'
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          total: cartTotal,
          customer_email: "cliente@ejemplo.com", // Aquí podrías poner un input real
          status: 'paid'
        })
        .select()
        .single(); // Nos devuelve el objeto creado para tener su ID

      if (orderError) throw orderError;

      // 2. Preparar los items para guardarlos
      const orderItems = items.map((item) => ({
        order_id: order.id, // Usamos el ID de la orden que acabamos de crear
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      // 3. Guardar los items en 'order_items'
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 4. Todo salió bien: Limpiar carrito y redirigir
      clearCart();
      alert("¡Compra exitosa! Revisa la consola de Supabase.");
      router.push("/"); // O podrías crear una página /exito

    } catch (error: any) {
      console.error("Error al comprar:", error);
      alert("Hubo un error procesando tu pedido.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío 😢</h2>
        <Link href="/" className="bg-black text-white px-6 py-3 rounded-lg font-bold">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Tu Carrito</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
              <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                </div>
                <div className="flex justify-between items-end">
                  <span className="font-medium">${(item.price * item.quantity).toLocaleString("es-CL")}</span>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm font-medium hover:underline">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit p-6 bg-gray-50 rounded-2xl border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Resumen</h2>
          <div className="border-t border-gray-200 my-4 pt-4 flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>${cartTotal.toLocaleString("es-CL")}</span>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Procesando..." : "Confirmar Compra"}
          </button>
        </div>
      </div>
    </div>
  );
}