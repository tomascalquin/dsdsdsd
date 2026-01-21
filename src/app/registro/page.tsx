"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validaciones Locales
    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (!formData.acceptTerms) {
      toast.error("Debes aceptar los Términos y Condiciones");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          // Guardamos datos extra en el perfil del usuario
          data: {
            full_name: formData.fullName,
            phone: formData.phone, 
          },
        },
      });
  
      if (error) {
        toast.error("Error: " + error.message);
      } else if (data.session) {
        toast.success("¡Bienvenido! Cuenta creada.");
        router.refresh();
        router.push("/perfil");
      } else {
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

  // Helper para ver si las contraseñas coinciden (para UI)
  const passwordsMatch = formData.password === formData.confirmPassword || formData.confirmPassword === "";

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 bg-gray-50 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Crear Cuenta</h1>
          <p className="text-gray-400 text-sm">Únete a DropsC para acceso exclusivo</p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-5">
          
          {/* Nombre Completo */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nombre Completo</label>
            <input 
              type="text" 
              name="fullName"
              value={formData.fullName} 
              onChange={handleChange} 
              className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all" 
              placeholder="Ej: Tomás Calquín" 
              required 
            />
          </div>

          {/* Teléfono y Email en Grilla */}
          <div className="grid grid-cols-1 gap-5">
             <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Teléfono Móvil</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone} 
                onChange={handleChange} 
                className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all" 
                placeholder="+56 9 1234 5678" 
                required 
              />
            </div>
            
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Correo Electrónico</label>
              <input 
                type="email" 
                name="email"
                value={formData.email} 
                onChange={handleChange} 
                className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all" 
                placeholder="correo@ejemplo.com" 
                required 
              />
            </div>
          </div>

          {/* Contraseñas */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Contraseña</label>
            <input 
              type="password" 
              name="password"
              value={formData.password} 
              onChange={handleChange} 
              className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all" 
              placeholder="Mínimo 6 caracteres" 
              required 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Confirmar Contraseña</label>
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword} 
              onChange={handleChange} 
              className={`w-full p-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all ${
                passwordsMatch ? "border-gray-200 focus:ring-black" : "border-red-300 focus:ring-red-500 bg-red-50"
              }`}
              placeholder="Repite tu contraseña" 
              required 
            />
            {!passwordsMatch && (
              <p className="text-red-500 text-xs mt-1 ml-1">Las contraseñas no coinciden</p>
            )}
          </div>

          {/* Términos */}
          {/* Términos (Modificado con Link) */}
          <div className="flex items-center gap-3 pt-2">
            <input 
              type="checkbox" 
              name="acceptTerms"
              id="acceptTerms"
              checked={formData.acceptTerms}
              onChange={e => setFormData(prev => ({ ...prev, acceptTerms: e.target.checked }))}
              className="w-5 h-5 accent-black rounded cursor-pointer"
            />
            <label htmlFor="acceptTerms" className="text-sm text-gray-500 cursor-pointer select-none">
              Acepto los{" "}
              <Link 
                href="/terminos" 
                target="_blank"        // Abre en pestaña nueva
                rel="noopener noreferrer" // Seguridad extra
                className="text-black font-bold underline hover:text-gray-700"
              >
                Términos y Condiciones
              </Link>
            </label>
          </div>

          <button 
            disabled={loading} 
            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 shadow-lg hover:scale-[1.02] active:scale-95"
          >
            {loading ? "Registrando..." : "Crear Cuenta"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-black font-bold hover:underline">
            Inicia Sesión aquí
          </Link>
        </div>

      </div>
    </div>
  );
}