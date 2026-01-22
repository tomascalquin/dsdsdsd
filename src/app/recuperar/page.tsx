"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import Link from "next/link";

export default function RecoverPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🟢 LA SOLUCIÓN:
      // Construimos la URL completa para que no se pierda.
      // 1. Va a /auth/callback (donde verifica el token)
      // 2. Lleva el parámetro ?next=/actualizar-password (donde queremos que termine)
      const redirectUrl = `${window.location.origin}/auth/callback?next=/actualizar-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        toast.error("Error: " + error.message);
      } else {
        toast.success("¡Correo enviado! Revisa tu bandeja de entrada.");
        // Opcional: Limpiar el campo
        setEmail("");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al intentar enviar el correo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-900 mb-2">Recuperar Contraseña</h1>
          <p className="text-gray-400 text-sm">Te enviaremos un enlace mágico para restablecerla</p>
        </div>

        <form onSubmit={handleRecover} className="space-y-6">
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

          <button 
            disabled={loading} 
            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 shadow-lg hover:scale-[1.02] active:scale-95"
          >
            {loading ? "Enviando..." : "Enviar Enlace"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <Link href="/login" className="text-gray-500 hover:text-black font-bold transition-colors">
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}