"use client"; // Convertimos a Client Component para interactividad (Galería)

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProductActions from "@/components/ProductActions";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: PageProps) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeMedia, setActiveMedia] = useState<any>(null); // El medio que se está viendo

  useEffect(() => {
    async function loadData() {
      const resolvedParams = await params;
      
      const { data, error } = await supabase
        .from("products")
        .select(`*, product_images ( url, is_primary, media_type )`) // Traemos media_type
        .eq("slug", resolvedParams.slug)
        .single();

      if (error || !data) {
        setLoading(false);
        return;
      }

      setProduct(data);
      
      // Definir cuál se muestra primero (la imagen principal)
      const primary = data.product_images?.find((img: any) => img.is_primary) || data.product_images?.[0];
      setActiveMedia(primary || { url: "https://via.placeholder.com/600", media_type: "image" });
      
      setLoading(false);
    }
    loadData();
  }, [params]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (!product) return notFound();

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="h-20"></div>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="text-sm text-gray-400 mb-8 flex gap-2 items-center">
          <Link href="/" className="hover:text-black transition-colors">Inicio</Link> 
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* --- COLUMNA 1: GALERÍA MULTIMEDIA --- */}
          <div className="flex flex-col gap-4">
            
            {/* VISOR PRINCIPAL */}
            <div className="relative aspect-square bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100">
              {activeMedia?.media_type === 'video' ? (
                // REPRODUCTOR DE VIDEO
                <video 
                  src={activeMedia.url} 
                  controls 
                  autoPlay 
                  loop 
                  muted 
                  className="w-full h-full object-cover"
                />
              ) : (
                // VISOR DE IMAGEN
                <img
                  src={activeMedia?.url}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              )}
              
              {/* Etiqueta */}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg pointer-events-none">
                <span className="text-xs font-black uppercase tracking-widest text-orange-600">
                  {activeMedia?.media_type === 'video' ? '🎥 Video Demo' : '🔥 Viral'}
                </span>
              </div>
            </div>

            {/* MINIATURAS (Para cambiar entre foto y video) */}
            {product.product_images && product.product_images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.product_images.map((media: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setActiveMedia(media)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeMedia.url === media.url ? 'border-orange-500 ring-2 ring-orange-200' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    {media.media_type === 'video' ? (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white text-2xl">
                        ▶
                      </div>
                    ) : (
                      <img src={media.url} className="w-full h-full object-cover" alt="mini" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* --- COLUMNA 2: INFO --- */}
          <div className="flex flex-col pt-4">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] mb-6">
              {product.title}
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl font-black text-gray-900">
                ${product.price?.toLocaleString('es-CL')}
              </span>
            </div>

            <div className="prose prose-lg text-gray-500 mb-10 leading-relaxed whitespace-pre-wrap">
              {product.description}
            </div>

            <ProductActions product={product} />
          </div>
        </div>
      </main>
    </div>
  );
}