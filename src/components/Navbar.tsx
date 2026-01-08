"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Para poder viajar al buscar
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openCart, cart } = useCart();
  
  // Lógica del Buscador
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue
    if (query.trim()) {
      // Redirigimos a la página de búsqueda con lo que escribió el usuario
      router.push(`/buscar?q=${encodeURIComponent(query)}`);
      setIsMobileMenuOpen(false); // Cerramos menú si estaba abierto
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-4">
          
          {/* 1. LOGO */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="bg-black text-white font-black text-xl p-2 rounded-lg group-hover:bg-orange-600 transition-colors">
              dC
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900 hidden sm:block">
              dropsC<span className="text-orange-600">.</span>
            </span>
          </Link>

          {/* 2. BARRA DE BÚSQUEDA (NUEVO) */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md relative group">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-gray-100/50 border border-transparent focus:bg-white focus:border-gray-200 focus:ring-2 focus:ring-black/5 rounded-full py-2.5 pl-10 pr-4 text-sm outline-none transition-all"
            />
            {/* Ícono Lupa dentro del input */}
            <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                 <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
               </svg>
            </button>
          </form>

          {/* 3. ICONOS DE ACCIÓN */}
          <div className="flex items-center gap-2 flex-shrink-0">
            
            {/* Link Admin (Solo Desktop) */}
            
            {/* Perfil */}
            <Link href="/perfil" className="p-2 text-gray-400 hover:text-black transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </Link>

            {/* Carrito */}
            <button 
              onClick={openCart} 
              className="relative p-2 text-gray-400 hover:text-black transition-colors group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 group-hover:scale-110 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-orange-600 rounded-full animate-bounce">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}