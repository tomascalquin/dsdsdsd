import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const revalidate = 0; // Esto asegura que siempre se muestren productos nuevos

export default async function Home() {
  // 1. Obtenemos los productos desde Supabase
  const { data: products } = await supabase
    .from('products')
    .select(`id, title, price, slug, product_images ( url )`)
    .limit(8);

  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* --- HERO SECTION (BANNER PRINCIPAL) --- */}
      <section className="relative bg-[#0f1115] text-white overflow-hidden py-24 lg:py-32">
        {/* Fondo con ruido y gradientes para efecto Premium */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold tracking-[0.2em] uppercase mb-6 backdrop-blur-sm">
            Tendencias Virales 2024
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
            DESCUBRE LO <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              EXTRAORDINARIO
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-medium">
            Seleccionamos los gadgets más innovadores de las redes sociales y los traemos directamente a tu puerta.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="#catalogo" 
              className="px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs hover:bg-orange-500 hover:text-white transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Ver Colección
            </Link>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN DE CONFIANZA --- */}
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 gap-8 text-center divide-x divide-gray-100">
          <div className="flex flex-col items-center">
            <span className="text-3xl mb-2">🚀</span>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-800">Envío Rápido</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl mb-2">⭐</span>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-800">+10k Clientes</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl mb-2">🛡️</span>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-800">Garantía Total</span>
          </div>
        </div>
      </div>

      {/* --- CATÁLOGO DE PRODUCTOS --- */}
      <section id="catalogo" className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Lo más vendido</h2>
            <div className="h-1 w-20 bg-orange-500 mt-3 rounded-full"></div>
          </div>
        </div>

        {/* Grilla de productos usando tu componente ProductCard */}
        {!products || products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p>Cargando tendencias...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product: any) => (
              <ProductCard 
                key={product.id}
                id={product.id}
                // Usamos "title" o "name" para asegurar compatibilidad con tu base de datos
                title={product.title || product.name} 
                price={product.price}
                // Si hay imágenes en el array usamos la primera, sino el campo image directo
                image={product.product_images?.[0]?.url || product.image || "/placeholder.png"}
                slug={product.slug}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}