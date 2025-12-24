import ProductCard from "../components/ProductCard";
import { supabase } from "../lib/supabase";

// Esta función ahora es ASYNC (Asíncrona) porque espera a la base de datos
export default async function Home() {
  
  // 1. Petición a Supabase
  // "Trae los productos y también su imagen principal"
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id,
      title,
      price,
      slug,
      product_images ( url )
    `)
    .eq('product_images.is_primary', true); // Solo la imagen principal

  if (error) {
    console.error("Error cargando productos:", error);
    return <div>Hubo un error cargando los productos.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Colección Exclusiva 
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products?.map((product: any) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            // Supabase devuelve las imágenes como un array, tomamos la primera
            image={product.product_images[0]?.url || "https://via.placeholder.com/500"} 
            slug={product.slug}
          />
        ))}
      </div>
    </div>
  );
}