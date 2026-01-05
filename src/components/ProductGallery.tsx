"use client";
import { useState } from "react";

export default function ProductGallery({ product }: { product: any }) {
  // Encontrar la imagen/video principal inicial
  const primaryMedia = product.product_images?.find((img: any) => img.is_primary) 
    || product.product_images?.[0] 
    || { url: "/placeholder.png", media_type: "image" };

  const [activeMedia, setActiveMedia] = useState(primaryMedia);

  return (
    <div className="flex flex-col gap-4">
      {/* VISOR PRINCIPAL */}
      <div className="relative aspect-square bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100">
        {activeMedia?.media_type === 'video' ? (
          <video 
            src={activeMedia.url} 
            controls 
            autoPlay 
            loop 
            muted 
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={activeMedia?.url}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        )}
        
        {/* Etiqueta Flotante */}
        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg pointer-events-none">
          <span className="text-xs font-black uppercase tracking-widest text-orange-600">
            {activeMedia?.media_type === 'video' ? '🎥 Video Demo' : '🔥 Viral'}
          </span>
        </div>
      </div>

      {/* CARRUSEL DE MINIATURAS */}
      {product.product_images && product.product_images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
          {product.product_images.map((media: any, index: number) => (
            <button
              key={index}
              onClick={() => setActiveMedia(media)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                activeMedia.url === media.url ? 'border-orange-500 ring-2 ring-orange-200' : 'border-transparent hover:border-gray-300'
              }`}
            >
              {media.media_type === 'video' ? (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white text-2xl">▶</div>
              ) : (
                <img src={media.url} className="w-full h-full object-cover" alt="mini" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}