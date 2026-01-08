import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

// Hacemos que la página sea dinámica para leer la URL
export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams; // Leemos lo que escribió el usuario
  const query = q || "";

  // Buscamos en Supabase (título O descripción)
  const { data: products } = await supabase
    .from("products")
    .select("*, product_images(url, is_primary)")
    .ilike("title", `%${query}%`); // 'ilike' busca sin importar mayúsculas

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabecera de Búsqueda */}
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-400 hover:text-black mb-4 inline-block">← Volver al inicio</Link>
          <h1 className="text-3xl font-black text-gray-900">
            Resultados para: <span className="text-orange-600">"{query}"</span>
          </h1>
          <p className="text-gray-500 mt-2">
            Encontramos {products?.length || 0} coincidencias.
          </p>
        </div>

        {/* Grilla de Resultados */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => {
               const img = product.product_images?.find((i: any) => i.is_primary)?.url 
                 || product.product_images?.[0]?.url 
                 || "/placeholder.png";
               
               return (
                 <ProductCard 
                   key={product.id}
                   id={product.id}
                   title={product.title}
                   price={product.price}
                   image={img}
                   slug={product.slug}
                   category={product.category}
                 />
               );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <p className="text-xl text-gray-400 mb-4">No encontramos nada con ese nombre 😢</p>
            <Link href="/" className="bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-orange-600 transition-all">
              Ver todo el catálogo
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}