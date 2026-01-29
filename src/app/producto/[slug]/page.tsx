import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// Componentes
import ProductGallery from "@/components/ProductGallery";
import ProductActions from "@/components/ProductActions"; 
import ProductReviews from "@/components/ProductReviews";

// Definimos el tipo de las Props (Requerido en Next.js 15/16)
type Props = {
  params: Promise<{ slug: string }>;
};

// ----------------------------------------------------------------------
// 1. GENERACIÓN DE METADATOS (SEO para WhatsApp/Google/RRSS)
// ----------------------------------------------------------------------
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const { data: product } = await supabase
    .from("products")
    .select("title, description, price, product_images(url)")
    .eq("slug", slug)
    .single();

  if (!product) {
    return {
      title: "Producto no encontrado | DropsC Store",
    };
  }

  // Usamos la primera imagen disponible o un fallback
  const imageUrl = product.product_images?.[0]?.url || "https://dropsc.store/hero-banner.png";

  return {
    title: `${product.title} | Compra Online`,
    description: `Consigue ${product.title} por $${product.price.toLocaleString("es-CL")}. Envío rápido a todo Chile.`,
    openGraph: {
      title: product.title,
      description: product.description?.slice(0, 160) + "...",
      url: `https://dropsc.store/producto/${slug}`,
      siteName: "DropsC Store",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
      locale: "es_CL",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: `Precio oferta: $${product.price.toLocaleString("es-CL")}`,
      images: [imageUrl],
    },
  };
}

// ----------------------------------------------------------------------
// 2. PÁGINA DEL PRODUCTO (Server Component)
// ----------------------------------------------------------------------
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  // Carga de datos completa del producto
  const { data: product } = await supabase
    .from("products")
    .select(`
      *,
      product_images (url, is_primary)
    `)
    .eq("slug", slug)
    .single();

  // Si no existe, mandamos a la página 404
  if (!product) {
    notFound();
  }

  // --- CONFIGURACIÓN SEO ESTRUCTURADO (JSON-LD) ---
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://dropsc.store";
  const productUrl = `${baseUrl}/producto/${slug}`;
  
  // 1. Schema de Producto (Rich Snippet: Precio, Stock, Imágenes)
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.product_images?.map((img: any) => img.url) || [],
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "DropsC"
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "CLP",
      price: product.price,
      availability: "https://schema.org/InStock", // Podrías condicionar esto con product.stock > 0
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "DropsC Store"
      }
    }
  };

  // 2. Schema de Migas de Pan (Breadcrumbs)
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: baseUrl
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Catálogo",
        item: `${baseUrl}/catalogo`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: productUrl
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Script JSON-LD para Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify([productSchema, breadcrumbSchema]) 
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* MIGAS DE PAN (Visuales) */}
        <nav className="flex items-center text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-black hover:underline transition-colors">
            Inicio
          </Link>
          <span className="mx-3 text-gray-300">/</span>
          <Link href="/catalogo" className="hover:text-black hover:underline transition-colors">
            Catálogo
          </Link>
          <span className="mx-3 text-gray-300">/</span>
          <span className="font-medium text-black truncate max-w-[200px]">
            {product.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* COLUMNA IZQUIERDA: Galería de Imágenes */}
          <div className="relative">
             <ProductGallery images={product.product_images || []} />
          </div>

          {/* COLUMNA DERECHA: Información y Compra */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-gray-900">
                ${product.price.toLocaleString("es-CL")}
              </span>
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Envío Gratis
              </span>
            </div>

            <div className="prose prose-gray mb-8 text-gray-600 leading-relaxed">
              <p>{product.description}</p>
            </div>

            {/* Componente Interactivo de Botones (Carrito/Comprar) */}
            <div className="mt-auto">
               <ProductActions product={product} />
            </div>
            
            {/* Garantías o sellos de confianza */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100">
               <div className="text-center">
                 <span className="text-2xl block mb-2">🔒</span>
                 <p className="text-xs font-bold text-gray-500">Pago Seguro</p>
               </div>
               <div className="text-center">
                 <span className="text-2xl block mb-2">🚚</span>
                 <p className="text-xs font-bold text-gray-500">Envío Rápido</p>
               </div>
               <div className="text-center">
                 <span className="text-2xl block mb-2">↩️</span>
                 <p className="text-xs font-bold text-gray-500">Devolución</p>
               </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN INFERIOR: Reseñas */}
        <div className="mt-24 border-t border-gray-100 pt-16">
          <ProductReviews productId={product.id} />
        </div>

      </div>
    </div>
  );
}