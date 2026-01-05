"use client"; 
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext"; // Importamos Auth
import { useState } from "react";

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, signOut } = useAuth(); // Sacamos el usuario
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-black text-xs group-hover:bg-orange-500 transition-colors">
            DP
          </div>
          <span className="text-xl font-black tracking-tight text-gray-900">
            Drops Calquin
          </span>
        </Link>
        
        {/* ACCIONES DERECHA */}
        <div className="flex items-center gap-6">
          
          {/* LÓGICA DE LOGIN / USUARIO */}
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 text-sm font-bold hover:text-orange-600 transition-colors"
              >
                <span>Hola, {user.email?.split('@')[0]}</span>
                <span className="text-xs">▼</span>
              </button>

              {/* Menú desplegable simple */}
              {menuOpen && (
                <div className="absolute right-0 mt-4 w-48 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-2 border-b border-gray-50 text-xs text-gray-400">
                    {user.email}
                  </div>
                  <button 
                    onClick={() => { signOut(); setMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4 text-sm font-bold">
              <Link href="/login" className="hover:text-orange-600 transition-colors">
                Ingresar
              </Link>
              <Link href="/registro" className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors hidden sm:block">
                Registrarse
              </Link>
            </div>
          )}

          {/* CARRITO */}
          <Link href="/carrito" className="relative p-2 text-gray-600 hover:text-black transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}