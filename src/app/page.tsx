import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const revalidate = 0;

export default async function Home() {
  const { data: products } = await supabase
    .from('products')
    .select(`id, title, price, slug, product_images ( url, is_primary )`)
    .limit(8);

  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* HERO BANNER */}
      <section className="relative bg-[#0f1115] text-white overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold tracking-[0.2em] uppercase mb-6 backdrop-blur-sm">
            Tendencias 2024
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
            DESCUBRE LO <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              EXTRAORDINARIO
            </span>
          </h1>
          <div className="flex justify-center gap-4">
            <Link 
              href="#catalogo" 
              className="px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs hover:bg-orange-500 hover:text-white transition-all transform hover:scale-105"
            >
              Ver Colección
            </Link>
          </div>
        </div>
      </section>

      {/* CATÁLOGO */}
      <section id="catalogo" className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-12">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Lo más vendido</h2>
        </div>

        {!products || products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p>Cargando productos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product: any) => {
               // Lógica para encontrar la imagen principal
               const mainImage = product.product_images?.find((img: any) => img.is_primary)?.url 
                 || product.product_images?.[0]?.url 
                 || "/placeholder.png";

               return (
                <ProductCard 
                  key={product.id}
                  id={product.id}
                  title={product.title} 
                  price={product.price}
                  image={mainImage}
                  slug={product.slug}
                />
               )
            })}
          </div>
        )}
      </section>
    </div>
  );
}