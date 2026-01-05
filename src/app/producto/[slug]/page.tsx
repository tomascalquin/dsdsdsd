import { supabase } from "@/lib/supabase";
import ProductActions from "@/components/ProductActions"; 
import ProductGallery from "@/components/ProductGallery";
import ProductReviews from "@/components/ProductReviews"; // <--- Importamos las reseñas
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const revalidate = 0; // Para que siempre muestre datos frescos (stock real)

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// 1. GENERACIÓN DE METADATOS SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { data: product } = await supabase
    .from("products")
    .select(`title, description, product_images ( url, is_primary )`)
    .eq("slug", resolvedParams.slug)
    .single();

  if (!product) return { title: "Producto no encontrado" };

  const mainImage = product.product_images?.find((img: any) => img.is_primary)?.url 
    || product.product_images?.[0]?.url;

  return {
    title: `${product.title} | DropsC Store`,
    description: product.description?.slice(0, 160),
    openGraph: {
      images: [mainImage || ""],
      title: product.title,
      description: product.description?.slice(0, 160),
    },
  };
}

// 2. PÁGINA PRINCIPAL DEL PRODUCTO
export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // A. Obtener el producto principal
  const { data: product } = await supabase
    .from("products")
    .select(`*, product_images ( url, is_primary, media_type )`)
    .eq("slug", slug)
    .single();

  if (!product) return notFound();

  // B. Obtener Productos Relacionados (Misma categoría, distinto ID)
  const { data: relatedProducts } = await supabase
    .from("products")
    .select(`id, title, price, slug, product_images ( url, is_primary )`)
    .eq("category", product.category || 'General') 
    .neq("id", product.id)
    .limit(4);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Spacer para el Navbar fijo */}
      <div className="h-20"></div> 

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        
        {/* Breadcrumbs (Navegación) */}
        <div className="text-sm text-gray-400 mb-8 flex gap-2 items-center">
          <Link href="/" className="hover:text-black transition-colors">Inicio</Link> 
          <span>/</span>
          <span className="font-bold text-gray-500">{product.category || 'General'}</span>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* COLUMNA IZQUIERDA: GALERÍA MULTIMEDIA */}
          <div className="sticky top-24">
            <ProductGallery product={product} />
          </div>

          {/* COLUMNA DERECHA: INFORMACIÓN */}
          <div className="flex flex-col pt-4">
            <span className="text-orange-600 font-bold tracking-widest text-xs uppercase mb-4">
              {product.category || 'Colección 2024'}
            </span>
            
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-black text-gray-900">
                ${product.price?.toLocaleString('es-CL')}
              </span>
              
              {/* Lógica de Stock Visual */}
              {product.stock > 0 && product.stock < 10 && (
                 <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                   ¡Solo quedan {product.stock}!
                 </span>
              )}
              {product.stock === 0 && (
                 <span className="bg-gray-200 text-gray-500 px-3 py-1 rounded-full text-xs font-bold">
                   Agotado
                 </span>
              )}
            </div>

            <div className="prose prose-lg text-gray-500 mb-10 leading-relaxed whitespace-pre-wrap">
              {product.description}
            </div>

            {/* Iconos de Confianza */}
            <div className="grid grid-cols-3 gap-4 mb-8 border-y border-gray-200 py-6 text-center bg-white/50 rounded-xl">
              <div><span className="text-2xl block mb-2">🚚</span><span className="text-[10px] font-bold uppercase text-gray-500">Envío Rápido</span></div>
              <div className="border-l border-gray-200"><span className="text-2xl block mb-2">🛡️</span><span className="text-[10px] font-bold uppercase text-gray-500">Garantía</span></div>
              <div className="border-l border-gray-200"><span className="text-2xl block mb-2">💳</span><span className="text-[10px] font-bold uppercase text-gray-500">Pago Seguro</span></div>
            </div>

            {/* BOTONES DE COMPRA */}
            {product.stock > 0 ? (
              <ProductActions product={product} />
            ) : (
              <button disabled className="w-full bg-gray-200 text-gray-400 py-4 rounded-xl font-bold cursor-not-allowed uppercase tracking-wider">
                Sin Stock Disponible
              </button>
            )}

            {/* SECCIÓN DE RESEÑAS (NUEVO) */}
            <div id="reviews" className="mt-8">
               <ProductReviews productId={product.id} />
            </div>

          </div>
        </div>

        {/* SECCIÓN DE PRODUCTOS RELACIONADOS (NUEVO) */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-32 border-t border-gray-200 pt-16">
            <h3 className="text-3xl font-black mb-8 tracking-tight">También te podría interesar</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {relatedProducts.map((rel: any) => {
                 const relImage = rel.product_images?.find((img: any) => img.is_primary)?.url || rel.product_images?.[0]?.url || "/placeholder.png";
                 return (
                   <Link key={rel.id} href={`/producto/${rel.slug}`} className="group block bg-white p-4 rounded-2xl border border-transparent hover:border-gray-200 hover:shadow-xl transition-all duration-300">
                     <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4 relative">
                       <img 
                         src={relImage} 
                         alt={rel.title} 
                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                       />
                       <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-[10px] font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                         VER
                       </div>
                     </div>
                     <h4 className="font-bold text-gray-900 truncate mb-1 group-hover:text-orange-600 transition-colors">{rel.title}</h4>
                     <p className="text-gray-500 font-bold text-sm">${rel.price.toLocaleString('es-CL')}</p>
                   </Link>
                 )
              })}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}