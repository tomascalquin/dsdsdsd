import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartBtn from "@/components/AddToCartBtn";

// CAMBIO 1: Definimos params como una Promesa
interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  // CAMBIO 2: Esperamos (await) a que los parámetros estén listos antes de usarlos
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  console.log("========================================");
  console.log("🔍 Buscando producto con slug:", slug); // Ahora esto dirá 'sillon-terraza'

  // 1. Buscamos el producto en Supabase
  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      product_images ( url )
    `)
    .eq("slug", slug)
    .single();

  console.log("📦 Resultado Supabase:", product ? "Encontrado" : "No encontrado");
  
  if (error || !product) {
    console.log("-> Redirigiendo a 404. Error:", error);
    notFound();
  }

  // Fallback de imagen
  const mainImage = product.product_images?.[0]?.url || "https://via.placeholder.com/600";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/" className="group flex items-center gap-2 text-gray-500 hover:text-black mb-8 w-fit transition-colors">
        <span className="group-hover:-translate-x-1 transition-transform">←</span> 
        Volver a la tienda
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="relative aspect-square bg-gray-100 rounded-3xl overflow-hidden shadow-sm">
          <Image
            src={mainImage}
            alt={product.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-sm font-bold text-blue-600 tracking-wider uppercase mb-2">
            Hecho a mano
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
            {product.title}
          </h1>
          
          <div className="text-3xl font-medium text-gray-900 mb-8">
            ${product.price.toLocaleString("es-CL")}
          </div>

          <div className="prose prose-lg text-gray-600 mb-10 leading-relaxed">
            <p>{product.description}</p>
          </div>

          <div className="flex gap-4">
      
            <AddToCartBtn 
              id={product.id}
              title={product.title}
              price={product.price}
              image={mainImage}
            />
            <button className="p-4 rounded-xl border-2 border-gray-200 hover:border-black transition-colors">
              ❤️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}