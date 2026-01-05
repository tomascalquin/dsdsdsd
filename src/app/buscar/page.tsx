"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || ""; // Obtener lo que escribió el usuario
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function doSearch() {
      setLoading(true);
      // Buscamos productos cuyo título contenga la palabra (ilike es insensible a mayúsculas)
      const { data } = await supabase
        .from("products")
        .select(`*, product_images ( url, is_primary )`)
        .ilike("title", `%${query}%`); 
      
      if (data) setProducts(data);
      setLoading(false);
    }

    if (query) doSearch();
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black mb-2">Resultados para: "{query}"</h1>
        <p className="text-gray-500 mb-8">{products.length} productos encontrados</p>

        {loading ? (
          <div className="text-center py-20">Buscando...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400 mb-4">No encontramos nada con ese nombre.</p>
            <Link href="/" className="text-black font-bold underline">Ver todo el catálogo</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => {
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
      </div>
    </div>
  );
}