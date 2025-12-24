"use client"; 

import Link from "next/link";
import { useCart } from "@/context/CartContext"; // Importamos el hook

export default function Navbar() {
  const { cartCount } = useCart(); // Sacamos el número del contexto global

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900">
          Cantarita
        </Link>
        
        <div className="flex gap-4">
         <Link href="/carrito" className="text-gray-600 hover:text-black font-bold flex gap-2 items-center self-center">
            🛒 Carrito 
            <span className="bg-black text-white text-xs rounded-full px-2 py-0.5">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}