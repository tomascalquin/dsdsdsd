"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-10 text-center">
        <p className="text-xl mb-4">Tu carrito está vacío.</p> 
        <button 
          onClick={() => router.push("/")} 
          className="underline font-bold text-orange-600 hover:text-black"
        >
          Volver a la tienda
        </button>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      // 1. Generar ID de orden único y legible (Ej: ORDER_171562...)
      const orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      // 2. Guardar orden en Supabase (Estado pendiente)
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_id: orderId, // <--- CAMPO CLAVE
          total: cartTotal,
          customer_email: formData.email,
          customer_name: formData.fullName,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city}`,
          status: 'pendiente',
          user_id: user?.id || null,
          payment_method: 'webpay'
        })
        .select()
        .single();

      if (orderError) throw new Error(`Error al crear orden: ${orderError.message}`);

      // 3. Guardar los items asociados a la orden
      const orderItems = items.map((item) => ({
        order_id: order.id, // Usamos el UUID interno de la base de datos para la relación
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw new Error(`Error al guardar productos: ${itemsError.message}`);

      // 4. Crear transacción en WebPay (Llamada a tu API)
      const webpayResponse = await fetch('/api/webpay/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: cartTotal,
          orderId: orderId,
          returnUrl: `${window.location.origin}/webpay/return`,
          finalUrl: `${window.location.origin}/webpay/final`
        }),
      });

      const webpayData = await webpayResponse.json();

      if (webpayData.error) {
        throw new Error(webpayData.error);
      }

      // 5. Actualizar la orden con el token recibido
      await supabase
        .from('orders')
        .update({ webpay_token: webpayData.token })
        .eq('id', order.id);

      // 6. REDIRECCIÓN SEGURA A WEBPAY (Formulario POST)
      // Esto reemplaza el window.location.href para cumplir con el estándar de Transbank
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = webpayData.url;

      const tokenInput = document.createElement('input');
      tokenInput.type = 'hidden';
      tokenInput.name = 'token_ws';
      tokenInput.value = webpayData.token;

      form.appendChild(tokenInput);
      document.body.appendChild(form);
      form.submit(); // Enviamos al usuario a pagar

    } catch (error: any) {
      console.error(error);
      alert("Error al procesar el pago: " + error.message);
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
            
            {/* Indicador de Pasos */}
            <div className="flex items-center gap-4 mb-8 text-sm font-bold text-gray-400">
              <span className={step === 1 ? "text-black border-b-2 border-black pb-1" : ""}>1. Datos de Envío</span>
              <span>→</span>
              <span className={step === 2 ? "text-black border-b-2 border-black pb-1" : ""}>2. Pago Seguro</span>
            </div>
          </div>

          {step === 1 ? (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-xl font-bold mb-4">Información de Contacto</h3>
              <div className="grid grid-cols-1 gap-4">
                <input 
                  name="email" value={formData.email} onChange={handleInputChange} 
                  type="email" placeholder="Correo Electrónico" 
                  className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all"
                />
                <input 
                  name="fullName" value={formData.fullName} onChange={handleInputChange} 
                  type="text" placeholder="Nombre Completo" 
                  className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all"
                />
                <input 
                  name="phone" value={formData.phone} onChange={handleInputChange} 
                  type="tel" placeholder="Teléfono Móvil" 
                  className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    name="address" value={formData.address} onChange={handleInputChange} 
                    type="text" placeholder="Dirección / Calle" 
                    className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all"
                  />
                  <input 
                    name="city" value={formData.city} onChange={handleInputChange} 
                    type="text" placeholder="Ciudad / Comuna" 
                    className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all"
                  />
                </div>
              </div>
              <button 
                onClick={() => {
                  if(!formData.fullName || !formData.address || !formData.email) return alert("Por favor completa los datos obligatorios.");
                  setStep(2);
                }}
                className="w-full mt-6 bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg"
              >
                Continuar al Pago
              </button>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <h3 className="text-xl font-bold mb-4">Método de Pago</h3>
              
              {/* Tarjeta WebPay Plus Seleccionada */}
              <div className="p-4 border-2 border-blue-600 bg-blue-50/50 rounded-xl flex items-center justify-between cursor-pointer transition-all">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">💳</span>
                  <div>
                    <span className="font-black text-blue-900 block text-lg">WebPay Plus</span>
                    <span className="text-sm text-blue-700 font-medium">Débito, Crédito y Prepago</span>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full bg-blue-600 border-[3px] border-white shadow-sm ring-1 ring-blue-200"></div>
              </div>
              
              {/* Opción Deshabilitada (Ejemplo) */}
              <div className="p-4 border border-gray-100 rounded-xl flex items-center gap-4 opacity-50 cursor-not-allowed grayscale">
                <span className="text-3xl">🏛️</span>
                <span className="font-bold text-gray-400">Transferencia Bancaria</span>
              </div>

              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 text-sm space-y-2">
                 <p className="font-bold text-gray-700 flex items-center gap-2">
                    🔒 Transacción Segura
                 </p>
                 <p className="text-gray-500 leading-relaxed">
                    Serás redirigido al sitio oficial de Transbank para completar tu pago de forma segura. No guardamos los datos de tu tarjeta.
                 </p>
              </div>

              <div className="flex gap-4 pt-2">
                <button 
                  onClick={() => setStep(1)} 
                  className="px-6 py-4 font-bold text-gray-500 hover:text-black transition-colors"
                >
                  Atrás
                </button>
                <button 
                  onClick={handlePayment} 
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Procesando...
                    </>
                  ) : (
                    `Pagar $${cartTotal.toLocaleString("es-CL")}`
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: RESUMEN DEL PEDIDO */}
        <div className="h-fit sticky top-24">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold mb-6 text-gray-900">Resumen del Pedido</h3>
            
            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center group">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 line-clamp-2 leading-tight mb-1">{item.title}</p>
                    <p className="text-xs text-gray-500 font-medium bg-gray-100 w-fit px-2 py-1 rounded-md">
                      Cant: {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-gray-900">${(item.price * item.quantity).toLocaleString("es-CL")}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-100 pt-6 space-y-3">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Subtotal</span>
                <span>${cartTotal.toLocaleString("es-CL")}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Envío</span>
                <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded text-xs tracking-wider">GRATIS</span>
              </div>
              <div className="flex justify-between text-3xl font-black text-gray-900 mt-6 pt-6 border-t border-dashed border-gray-200">
                <span>Total</span>
                <span>${cartTotal.toLocaleString("es-CL")}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}