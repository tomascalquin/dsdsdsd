"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import CheckoutForm from "@/components/CheckoutForm"
import Navbar from "@/components/Navbar"

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getProduct() {
      const { data, error } = await supabase
        .from("products") // Asegúrate que tu tabla de productos se llame así
        .select("*")
        .eq("slug", params.slug)
        .single()

      if (data) {
        setProduct(data)
      }
      setLoading(false)
    }
    getProduct()
  }, [params.slug])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  )

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl font-bold">Producto no encontrado</p>
    </div>
  )

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          
          {/* COLUMNA IZQUIERDA: IMAGEN */}
          <div className="sticky top-24">
            <div className="rounded-3xl overflow-hidden shadow-2xl bg-gray-100 aspect-square">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            {/* PRUEBA SOCIAL DEBAJO DE IMAGEN */}
            <div className="mt-6 flex items-center gap-2 justify-center text-sm text-gray-600 bg-gray-50 py-3 rounded-xl">
              <span className="flex text-yellow-400">★★★★★</span>
              <span className="font-medium">4.9/5 (128 reseñas verificadas)</span>
            </div>
          </div>

          {/* COLUMNA DERECHA: INFO Y FORMULARIO */}
          <div className="flex flex-col">
            <span className="text-orange-600 font-bold tracking-widest uppercase text-sm mb-2">
              🔥 PRODUCTO VIRAL EN TENDENCIA
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mt-4">
              <span className="text-3xl font-black text-gray-900">${product.price}</span>
              <span className="text-lg text-gray-400 line-through">${(product.price * 1.5).toFixed(2)}</span>
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">AHORRA 50%</span>
            </div>

            <p className="text-gray-600 mt-6 text-lg leading-relaxed">
              {product.description || "Este increíble producto está revolucionando las redes. Calidad premium garantizada y envío directo a tu hogar."}
            </p>

            {/* DIVISOR TÉCNICO */}
            <div className="my-8 border-t border-gray-100"></div>

            {/* COMPONENTE DE FORMULARIO DE SUPABASE */}
            <div id="checkout">
              <CheckoutForm product={product} />
            </div>

            {/* SECCIÓN DE CONFIANZA TIPO AMAZON/ALIEXPRESS */}
            <div className="mt-8 grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center p-3 bg-blue-50 rounded-xl">
                <span className="text-2xl">🚚</span>
                <span className="text-[10px] font-bold text-blue-800 text-center mt-1 uppercase">Envío Gratis</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-green-50 rounded-xl">
                <span className="text-2xl">🛡️</span>
                <span className="text-[10px] font-bold text-green-800 text-center mt-1 uppercase">Garantía</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-purple-50 rounded-xl">
                <span className="text-2xl">🔒</span>
                <span className="text-[10px] font-bold text-purple-800 text-center mt-1 uppercase">Pago Seguro</span>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-gray-400">
              * Quedan pocas unidades disponibles debido a la alta demanda en TikTok.
            </p>
          </div>

        </div>
      </main>
    </div>
  )
}