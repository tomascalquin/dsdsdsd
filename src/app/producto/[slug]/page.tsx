import { supabase } from "@/lib/supabase";
import ProductActions from "@/components/ProductActions"; // Asegúrate de tener este componente creado
import Link from "next/link";
import { notFound } from "next/navigation";

// Fuerza a que la página siempre muestre datos frescos
export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  // 1. Desempaquetamos los params de forma asíncrona (Requerido en versiones nuevas de Next.js)
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // 2. Buscamos el producto en Supabase
  const { data: product } = await supabase
    .from("products")
    .select(`*, product_images ( url )`)
    .eq("slug", slug)
    .single();

  // Si no existe, mandamos a la página 404
  if (!product) {
    return notFound();
  }

  // 3. Lógica de Imagen a prueba de fallos
  const mainImage = product.product_images?.[0]?.url || product.image || "https://via.placeholder.com/600";

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Espaciador para la Navbar fija */}
      <div className="h-20"></div>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Navegación (Breadcrumbs) */}
        <div className="text-sm text-gray-400 mb-8 flex gap-2 items-center">
          <Link href="/" className="hover:text-black transition-colors">
            Inicio
          </Link> 
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">
            {product.title || product.name}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* COLUMNA 1: IMAGEN (Con solución definitiva al error de config) */}
          <div className="relative group">
            <div className="relative aspect-square bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100">
              {/* USAMOS <img> NORMAL PARA EVITAR BLOQUEOS DE NEXT.JS */}
              <img
                src={mainImage}
                alt={product.title || "Producto"}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Etiqueta Flotante */}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
                <span className="text-xs font-black uppercase tracking-widest text-orange-600">
                  🔥 Viral
                </span>
              </div>
            </div>
          </div>

          {/* COLUMNA 2: DETALLES Y COMPRA */}
          <div className="flex flex-col pt-4">
            <span className="text-orange-600 font-bold tracking-widest uppercase text-xs mb-4">
              Nuevo Ingreso
            </span>
            
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] mb-6">
              {product.title || product.name}
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl font-black text-gray-900">
                ${product.price?.toLocaleString('es-CL')}
              </span>
              {/* Precio de referencia tachado */}
              {product.price && (
                <span className="text-xl text-gray-400 line-through decoration-2">
                  ${(product.price * 1.4).toLocaleString('es-CL')}
                </span>
              )}
            </div>

            <div className="prose prose-lg text-gray-500 mb-10 leading-relaxed">
              <p>{product.description || "Producto exclusivo de alta demanda. Aprovecha el envío gratis por tiempo limitado."}</p>
            </div>

            {/* Iconos de Confianza */}
            <div className="grid grid-cols-3 gap-4 mb-8 border-y border-gray-200 py-6">
              <div className="text-center">
                <span className="text-2xl block mb-2">🚚</span>
                <span className="text-[10px] font-bold uppercase text-gray-500">Envío Gratis</span>
              </div>
              <div className="text-center border-l border-gray-200">
                <span className="text-2xl block mb-2">🛡️</span>
                <span className="text-[10px] font-bold uppercase text-gray-500">Garantía</span>
              </div>
              <div className="text-center border-l border-gray-200">
                <span className="text-2xl block mb-2">💳</span>
                <span className="text-[10px] font-bold uppercase text-gray-500">Pago Seguro</span>
              </div>
            </div>

            {/* BOTONES DE ACCIÓN (Agregar al Carrito / Comprar) */}
            <ProductActions product={product} />
          </div>
        </div>
      </main>
    </div>
  );
}