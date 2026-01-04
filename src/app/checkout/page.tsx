"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Datos, 2: Pago
  
  // Estado del Formulario
  const [formData, setFormData] = useState({
    fullName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
  });

  // Actualizar email si el usuario se loguea después
  useEffect(() => {
    if (user?.email) setFormData(prev => ({ ...prev, email: user.email! }));
  }, [user]);

  // Si no hay items, volver al home
  if (items.length === 0) {
    return <div className="p-10 text-center">Tu carrito está vacío. <button onClick={() => router.push("/")} className="underline">Volver</button></div>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      // 1. Simular proceso de pago (Delay de 2 segundos)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 2. Guardar orden en Supabase
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          total: cartTotal,
          customer_email: formData.email,
          customer_name: formData.fullName, // Columnas nuevas
          phone: formData.phone,
          address: `${formData.address}, ${formData.city}`,
          status: 'pagado',
          user_id: user?.id || null // Vincula si existe usuario
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 3. Guardar items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      // 4. Éxito
      clearCart();
      alert("¡Pago Exitoso! Tu pedido ha sido procesado.");
      router.push("/"); 

    } catch (error: any) {
      console.error(error);
      alert("Error al procesar el pedido: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-black mb-6">Finalizar Compra</h2>
            
            {/* Pasos Visuales */}
            <div className="flex items-center gap-4 mb-8 text-sm font-bold text-gray-400">
              <span className={step === 1 ? "text-black" : ""}>1. Datos de Envío</span>
              <span>→</span>
              <span className={step === 2 ? "text-black" : ""}>2. Pago Seguro</span>
            </div>
          </div>

          {step === 1 ? (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-xl font-bold mb-4">Información de Contacto</h3>
              <div className="grid grid-cols-1 gap-4">
                <input 
                  name="email" value={formData.email} onChange={handleInputChange} 
                  type="email" placeholder="Correo Electrónico" className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all"
                />
                <input 
                  name="fullName" value={formData.fullName} onChange={handleInputChange} 
                  type="text" placeholder="Nombre Completo" className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all"
                />
                <input 
                  name="phone" value={formData.phone} onChange={handleInputChange} 
                  type="tel" placeholder="Teléfono Móvil" className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    name="address" value={formData.address} onChange={handleInputChange} 
                    type="text" placeholder="Dirección / Calle" className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all"
                  />
                  <input 
                    name="city" value={formData.city} onChange={handleInputChange} 
                    type="text" placeholder="Ciudad / Comuna" className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all"
                  />
                </div>
              </div>
              <button 
                onClick={() => {
                  if(!formData.fullName || !formData.address) return alert("Completa los datos obligatorios");
                  setStep(2);
                }}
                className="w-full mt-4 bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all"
              >
                Continuar al Pago
              </button>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <h3 className="text-xl font-bold mb-4">Método de Pago</h3>
              
              {/* Simulación de Tarjeta */}
              <div className="p-4 border-2 border-orange-500 bg-orange-50 rounded-xl flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💳</span>
                  <span className="font-bold text-orange-900">Tarjeta de Crédito / Débito</span>
                </div>
                <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow-sm"></div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-xl flex items-center gap-3 opacity-50 cursor-not-allowed">
                <span className="text-2xl">🏛️</span>
                <span className="font-bold text-gray-500">Transferencia Bancaria</span>
              </div>

              <div className="bg-gray-100 p-4 rounded-xl">
                 <p className="text-xs text-gray-500 font-mono mb-2">DATOS DE TARJETA (Simulados)</p>
                 <div className="flex gap-2">
                    <input type="text" placeholder="0000 0000 0000 0000" className="flex-1 p-3 rounded-lg border text-sm" />
                    <input type="text" placeholder="MM/YY" className="w-20 p-3 rounded-lg border text-sm" />
                    <input type="text" placeholder="CVC" className="w-16 p-3 rounded-lg border text-sm" />
                 </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 py-4 font-bold text-gray-500 hover:text-black">
                  Atrás
                </button>
                <button 
                  onClick={handlePayment} 
                  disabled={loading}
                  className="flex-[2] bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-500 transition-all shadow-lg disabled:opacity-70"
                >
                  {loading ? "Procesando pago..." : `Pagar $${cartTotal.toLocaleString("es-CL")}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: RESUMEN */}
        <div className="bg-white p-8 rounded-3xl shadow-lg h-fit sticky top-24 border border-gray-100">
          <h3 className="text-xl font-bold mb-6 text-gray-900">Resumen del Pedido</h3>
          <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-bold text-gray-800 line-clamp-1">{item.title}</p>
                  <p className="text-gray-500">Cant: {item.quantity}</p>
                </div>
                <p className="font-bold text-sm">${(item.price * item.quantity).toLocaleString("es-CL")}</p>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-100 pt-6 space-y-2">
            <div className="flex justify-between text-gray-500 text-sm">
              <span>Subtotal</span>
              <span>${cartTotal.toLocaleString("es-CL")}</span>
            </div>
            <div className="flex justify-between text-gray-500 text-sm">
              <span>Envío</span>
              <span className="text-green-600 font-bold">GRATIS</span>
            </div>
            <div className="flex justify-between text-2xl font-black text-gray-900 mt-4">
              <span>Total</span>
              <span>${cartTotal.toLocaleString("es-CL")}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}