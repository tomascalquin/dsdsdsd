"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { toast } from "sonner";

// Importamos tus componentes
import ProductCard from "@/components/ProductCard";
import FAQ from "@/components/FAQ";       // <--- Sección de Preguntas
import FadeIn from "@/components/FadeIn"; // <--- Animaciones suaves

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Todos");

  // Tus categorías (Asegúrate de que coincidan con las que guardas en Admin)
  const categories = ["Todos", "Tecnología", "Hogar", "Moda", "Juguetes", "Belleza"];

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select(`id, title, price, slug, category, product_images ( url, is_primary )`)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error("Error al cargar productos");
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // Lógica de filtrado
  const filteredProducts = activeCategory === "Todos" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* 1. HERO BANNER (DROPSC) */}
      <section className="relative bg-[#0f1115] text-white overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        {/* Fondo animado sutil */}
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-orange-500/10 via-transparent to-blue-500/10 animate-spin-slow pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/10 text-orange-400 text-xs font-bold tracking-[0.2em] uppercase mb-6 backdrop-blur-md">
            New Collection 2026
          </span>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.9]">
            dropsC <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              STORE
            </span>
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto mb-10 text-lg">
            Descubre los productos virales que están marcando tendencia en todo el mundo. Calidad premium, envío rápido.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="#catalogo" 
              className="px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs hover:bg-orange-500 hover:text-white transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Ver Catálogo
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SECCIÓN DE CATÁLOGO */}
      <section id="catalogo" className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Cabecera del Catálogo + Filtros */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">Explorar</h2>
            <p className="text-gray-500">Filtra por categoría para encontrar lo que buscas.</p>
          </div>

          {/* Botones de Categoría */}
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat 
                    ? "bg-black text-white shadow-lg scale-105" 
                    : "bg-white text-gray-500 border border-gray-200 hover:border-black hover:text-black"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* GRILLA DE PRODUCTOS */}
        {loading ? (
          // SKELETON LOADING (Carga animada)
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="space-y-4 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-2xl"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          // ESTADO VACÍO
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 text-lg mb-2">No hay productos en "{activeCategory}" por ahora.</p>
            <button onClick={() => setActiveCategory("Todos")} className="text-black font-bold underline hover:text-orange-500">
              Ver todo el catálogo
            </button>
          </div>
        ) : (
          // LISTA DE PRODUCTOS (CON ANIMACIÓN FADEIN)
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product: any, index: number) => {
               // Buscar imagen principal
               const mainImage = product.product_images?.find((img: any) => img.is_primary)?.url 
                 || product.product_images?.[0]?.url 
                 || "/placeholder.png";

               return (
                // Envolvemos en FadeIn con delay basado en el índice (0.1, 0.2, 0.3...)
                <FadeIn key={product.id} delay={index * 0.05}>
                  <ProductCard 
                    id={product.id}
                    title={product.title} 
                    price={product.price}
                    image={mainImage}
                    slug={product.slug}
                    category={product.category}
                  />
                </FadeIn>
               )
            })}
          </div>
        )}
      </section>

      {/* 3. SECCIÓN DE PREGUNTAS FRECUENTES (FAQ) */}
      <FAQ />

    </div>
  );
}