"use client"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function GraciasPage() {
  const [nombre, setNombre] = useState("cliente")

  useEffect(() => {
    // Intentamos sacar el nombre del storage si lo guardamos al comprar
    const savedName = localStorage.getItem("last_customer_name")
    if (savedName) setNombre(savedName)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-100">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
          ✓
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          ¡Pedido Recibido!
        </h1>
        <p className="text-gray-600 mb-8">
          Hola <span className="font-bold text-gray-800">{nombre}</span>, hemos registrado tu solicitud correctamente. 
          Para procesar el envío de inmediato, por favor confirma tu método de pago.
        </p>

        <div className="space-y-4">
          <a 
            href="https://wa.me/TU_NUMERO?text=Hola! Ya hice mi pedido, quiero confirmar el pago."
            className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-green-200"
          >
            CONFIRMAR POR WHATSAPP
          </a>
          
          <Link 
            href="/"
            className="block w-full text-gray-400 hover:text-gray-600 text-sm font-medium transition-all"
          >
            Volver a la tienda
          </Link>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-50 text-left">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Próximos pasos:</h4>
          <ul className="text-sm text-gray-500 space-y-2">
            <li className="flex gap-2"><span>1.</span> Te contactaremos por WhatsApp.</li>
            <li className="flex gap-2"><span>2.</span> Verificamos tu dirección de envío.</li>
            <li className="flex gap-2"><span>3.</span> Recibirás tu código de seguimiento.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}