"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import Link from "next/link";

export default function CheckoutPage() {
  // ✅ CORRECCIÓN: Usamos las variables nuevas (cart, total, clearCart)
  const { cart, total, clearCart } = useCart();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Estados del Formulario
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    region: "",
    phone: "",
  });

  // Cargar usuario al inicio para autocompletar email
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setFormData(prev => ({ ...prev, email: user.email || "" }));
      }
    };
    getUser();
  }, []);

  // Redirigir si el carrito está vacío
  useEffect(() => {
    if (cart.length === 0) {
      router.push("/carrito");
    }
  }, [cart, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) {
        toast.error("Por favor inicia sesión para continuar");
        router.push("/login?redirect=/checkout");
        return;
      }

      // 1. Guardar la orden en Supabase
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: total,
          status: "pending", // Estado inicial
          shipping_address: `${formData.address}, ${formData.apartment}, ${formData.city}, ${formData.region}`,
          contact_phone: formData.phone,
          items: cart // Guardamos el snapshot de los productos
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Éxito
      toast.success("¡Orden creada exitosamente!");
      clearCart(); // ✅ Función corregida para vaciar carrito
      
      // 3. Redirigir a perfil o página de éxito
      router.push("/perfil");

    } catch (error: any) {
      console.error(error);
      toast.error("Hubo un error al procesar tu orden: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return null; // Evita flash mientras redirige

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado */}
        <div className="flex items-center justify-center mb-10">
           <span className="text-sm font-bold text-gray-400">Carrito</span>
           <span className="mx-4 text-gray-300">/</span>
           <span className="text-sm font-bold text-black">Checkout</span>
           <span className="mx-4 text-gray-300">/</span>
           <span className="text-sm font-bold text-gray-400">Pago</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* COLUMNA IZQUIERDA: Formulario */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Sección Contacto */}
            <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-gray-900 mb-6">Información de Contacto</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white transition-all outline-none"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Teléfono</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white transition-all outline-none"
                    placeholder="+56 9 1234 5678"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Sección Dirección */}
            <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-gray-900 mb-6">Dirección de Envío</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre</label>
                  <input type="text" name="firstName" onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none" required />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Apellido</label>
                  <input type="text" name="lastName" onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none" required />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dirección (Calle y Número)</label>
                  <input type="text" name="address" onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none" placeholder="Av. Providencia 1234" required />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Depto / Oficina (Opcional)</label>
                  <input type="text" name="apartment" onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none" placeholder="Torre B, Depto 204" />
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Región</label>
                  <select name="region" onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none" required>
                    <option value="">Seleccionar...</option>
                    <option value="RM">Metropolitana</option>
                    <option value="V">Valparaíso</option>
                    <option value="VIII">Biobío</option>
                    {/* Agregar más regiones si es necesario */}
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ciudad / Comuna</label>
                  <input type="text" name="city" onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none" placeholder="Providencia" required />
                </div>
              </div>
            </section>

             {/* Botón Pagar Móvil (Se oculta en PC) */}
             <button 
                onClick={handleSubmit}
                disabled={loading}
                className="lg:hidden w-full bg-black text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50"
              >
                {loading ? "Procesando..." : "Confirmar Pedido"}
              </button>
          </div>

          {/* COLUMNA DERECHA: Resumen (Sticky) */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 lg:sticky lg:top-24">
              <h3 className="text-xl font-black text-gray-900 mb-6">Resumen del Pedido</h3>
              
              {/* Lista de productos scrollable si son muchos */}
              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                      <img src={item.image || "/placeholder.png"} alt={item.title} className="object-cover w-full h-full" />
                      <span className="absolute top-0 right-0 bg-gray-500 text-white text-[10px] px-1.5 py-0.5 rounded-bl-lg font-bold">x1</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 line-clamp-2">{item.title}</p>
                      <p className="text-sm text-gray-500">${item.price.toLocaleString("es-CL")}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cálculos */}
              <div className="space-y-3 py-6 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${total.toLocaleString("es-CL")}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span className="text-green-600 font-bold">Gratis</span>
                </div>
              </div>

              {/* Total Final */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-100 mb-8">
                <span className="text-lg font-bold text-gray-900">Total a pagar</span>
                <span className="text-3xl font-black text-gray-900">${total.toLocaleString("es-CL")}</span>
              </div>

              {/* Botón Pagar Desktop */}
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  "Confirmar y Pagar"
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-xs">
                 <span>🔒 Pago seguro SSL</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}