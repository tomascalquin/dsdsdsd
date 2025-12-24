"use client"
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CheckoutForm({ product }: { product: any }) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const fullname = formData.get('fullname') as string
    
    // 1. Insertamos los datos en la tabla 'orders' de Supabase
    const { error } = await supabase.from('orders').insert([{
      product_name: product.name,
      product_price: product.price,
      customer_name: fullname,
      address: formData.get('address'),
      city: formData.get('city'),
      phone: formData.get('phone'),
      status: 'pendiente'
    }])

    if (!error) {
      // 2. Guardamos el nombre localmente para la página de gracias
      localStorage.setItem("last_customer_name", fullname)
      
      // 3. Redirigimos a la página de éxito
      window.location.href = "/gracias"
    } else {
      console.error("Error de Supabase:", error.message)
      alert("Hubo un error al procesar tu pedido. Por favor, intenta de nuevo.")
    }
    
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 p-6 bg-white shadow-xl rounded-2xl border border-gray-100">
      <div className="flex items-center gap-2 mb-2">
        <span className="flex h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>
        <h3 className="text-xl font-bold text-gray-800">Envío a Domicilio</h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nombre Completo</label>
          <input name="fullname" placeholder="Ej: Juan Pérez" required className="w-full p-3 border rounded-lg text-black bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">WhatsApp / Teléfono</label>
          <input name="phone" placeholder="Ej: +569 1234 5678" required className="w-full p-3 border rounded-lg text-black bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Dirección de Entrega</label>
          <input name="address" placeholder="Calle, número, depto..." required className="w-full p-3 border rounded-lg text-black bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Ciudad / Comuna</label>
          <input name="city" placeholder="Ej: Santiago" required className="w-full p-3 border rounded-lg text-black bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
        </div>
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-4 rounded-xl text-lg shadow-lg shadow-orange-100 transition-all transform hover:scale-[1.02] active:scale-95"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            PROCESANDO...
          </span>
        ) : '¡PEDIR AHORA!'}
      </button>
      
      <p className="text-center text-[10px] text-gray-400 uppercase tracking-tighter">
        🔒 Tus datos están protegidos por encriptación SSL
      </p>
    </form>
  )
}