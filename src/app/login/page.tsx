"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      alert("Error: " + error.message);
      setLoading(false);
    } else {
      router.push("/"); // Redirigir al home o checkout
      router.refresh();
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h1 className="text-3xl font-black text-center mb-2">Bienvenido</h1>
        <p className="text-center text-gray-500 mb-8">Ingresa a tu cuenta para continuar</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black" placeholder="tu@email.com" required />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black" placeholder="••••••••" required />
          </div>
          <button disabled={loading} className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50">
            {loading ? "Entrando..." : "Iniciar Sesión"}
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          ¿No tienes cuenta? <Link href="/registro" className="font-bold hover:underline">Regístrate gratis</Link>
        </div>
      </div>
    </div>
  );
}