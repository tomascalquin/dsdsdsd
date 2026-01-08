"use client";
import { useState } from "react";

// ✅ CAMBIO AQUÍ: Ahora aceptamos "images" en lugar de "product"
export default function ProductGallery({ images }: { images: any[] }) {
  
  // 1. Protección: Si no vienen imágenes, usamos un array vacío
  const safeImages = images || [];

  // 2. Buscamos la imagen principal o usamos un placeholder
  const primaryMedia = safeImages.find((img: any) => img.is_primary) 
    || safeImages[0] 
    || { url: "/placeholder.png", media_type: "image" };

  const [activeMedia, setActiveMedia] = useState(primaryMedia);

  return (
    // "lg:sticky" hace que la galería se quede pegada solo en PC (pantallas grandes)
    <div className="relative lg:sticky lg:top-24 h-fit flex flex-col gap-4">
      
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
            alt="Producto"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        )}
        
        {/* Etiqueta Flotante */}
        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg pointer-events-none z-10">
          <span className="text-xs font-black uppercase tracking-widest text-orange-600">
            {activeMedia?.media_type === 'video' ? '🎥 Video Demo' : '🔥 Viral'}
          </span>
        </div>
      </div>

      {/* CARRUSEL DE MINIATURAS (Solo si hay más de 1 imagen) */}
      {safeImages.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar px-1">
          {safeImages.map((media: any, index: number) => (
            <button
              key={index}
              onClick={() => setActiveMedia(media)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                activeMedia.url === media.url 
                  ? 'border-orange-500 ring-2 ring-orange-200' 
                  : 'border-transparent hover:border-gray-300'
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