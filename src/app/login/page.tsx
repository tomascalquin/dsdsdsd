"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Mensaje opcional si viene redireccionado (ej: "Inicia sesión para pagar")
  const message = searchParams.get("message");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error("Error: Credenciales incorrectas");
      } else {
        toast.success("¡Bienvenido de vuelta!");
        router.refresh();
        
        // Si venía del checkout, lo devolvemos allá. Si no, al perfil.
        const redirect = searchParams.get("redirect") || "/perfil";
        router.push(redirect);
      }
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Iniciar Sesión</h1>
          <p className="text-gray-400 text-sm">Accede a tu cuenta de DropsC</p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-blue-50 text-blue-700 text-sm rounded-xl font-medium text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Correo Electrónico</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all" 
              placeholder="tu@email.com" 
              required 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Contraseña</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all" 
              placeholder="••••••••" 
              required 
            />
          </div>

          {/* Enlace de Recuperación (Nuevo) */}
          <div className="flex justify-end">
            <Link 
              href="/recuperar" 
              className="text-xs font-bold text-gray-500 hover:text-black hover:underline transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button 
            disabled={loading} 
            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 shadow-lg hover:scale-[1.02] active:scale-95"
          >
            {loading ? "Entrando..." : "Ingresar"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="text-black font-bold hover:underline">
            Regístrate aquí
          </Link>
        </div>

      </div>
    </div>
  );
}