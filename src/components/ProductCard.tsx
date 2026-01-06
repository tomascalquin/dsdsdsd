import Link from "next/link";
import WishlistButton from "./WishlistButton"; // Asegúrate de haber creado este componente antes

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  image: string;
  slug: string;
  category?: string; // Opcional, por si quieres mostrarla
}

export default function ProductCard({ id, title, price, image, slug, category }: ProductCardProps) {
  return (
    <div className="group relative flex flex-col gap-3">
      
      {/* IMAGEN DEL PRODUCTO */}
      <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-md">
        
        {/* Link principal al detalle */}
        <Link href={`/producto/${slug}`} className="block w-full h-full">
          <img
            src={image || "/placeholder.png"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Botón de Favoritos (Flotante) */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
            <WishlistButton productId={id} />
          </div>
        </div>

        {/* Etiqueta Opcional (Ej: Nuevo o Categoría) */}
        {category && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-gray-800 pointer-events-none">
            {category}
          </div>
        )}
      </div>

      {/* INFORMACIÓN */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
          <Link href={`/producto/${slug}`}>
            <h3 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-orange-600 transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>
          <p className="text-gray-500 text-xs mt-1">Envío Gratis</p>
        </div>
        
        <div className="text-right">
          <span className="block font-black text-gray-900 text-lg">
            ${price.toLocaleString("es-CL")}
          </span>
        </div>
      </div>
      
    </div>
  );
}