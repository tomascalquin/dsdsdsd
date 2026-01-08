"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Usamos notificaciones bonitas

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState(""); // Nuevo campo Nombre
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // 🚨 ESTO ES CLAVE: Enviamos el nombre a Supabase
          data: {
            full_name: fullName, 
          },
        },
      });
  
      if (error) {
        toast.error("Error: " + error.message);
      } else if (data.session) {
        // Caso 1: Se creó y entró directo (Email confirm desactivado)
        toast.success("¡Bienvenido! Cuenta creada.");
        router.refresh(); // Actualiza el contexto
        router.push("/perfil"); // Vamos directo al perfil
      } else {
        // Caso 2: Se creó pero pide confirmar correo (Email confirm activado)
        toast.success("Cuenta creada. Por favor verifica tu correo.");
        router.push("/login");
      }
    } catch (err) {
      toast.error("Ocurrió un error inesperado.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h1 className="text-3xl font-black text-center mb-2">Crear Cuenta</h1>
        <p className="text-gray-400 text-center mb-8 text-sm">Únete para gestionar tus pedidos</p>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nombre Completo</label>
            <input 
              type="text" 
              value={fullName} 
              onChange={e => setFullName(e.target.value)} 
              className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all" 
              placeholder="Ej: Tomás Calquín" 
              required 
            />
          </div>
          
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Correo Electrónico</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all" 
              placeholder="correo@ejemplo.com" 
              required 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Contraseña</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all" 
              placeholder="••••••••" 
              required 
            />
          </div>

          <button 
            disabled={loading} 
            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 mt-4 shadow-lg hover:scale-[1.02] active:scale-95"
          >
            {loading ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>
      </div>
    </div>
  );
}