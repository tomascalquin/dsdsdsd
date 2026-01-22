"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function RecoverPage() {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // PASO 1: Enviar el código al correo
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Código enviado. Revisa tu correo.");
        setStep("code"); // Pasamos a la pantalla de poner código
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  // PASO 2: Verificar el código
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Usamos el tipo 'recovery' para verificar el código de reseteo
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'recovery',
      });

      if (error) {
        toast.error("Código inválido o expirado");
      } else {
        toast.success("Código correcto. Redirigiendo...");
        // Al verificar, Supabase loguea al usuario automáticamente.
        // Lo mandamos directo a cambiar la clave.
        router.push("/actualizar-password");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al verificar el código.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-900 mb-2">Recuperar Contraseña</h1>
          <p className="text-gray-400 text-sm">
            {step === "email" 
              ? "Ingresa tu correo para recibir un código" 
              : `Ingresa el código enviado a ${email}`}
          </p>
        </div>

        {step === "email" ? (
          /* FORMULARIO DE CORREO */
          <form onSubmit={handleSendCode} className="space-y-6">
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
              {loading ? "Enviando..." : "Enviar Código"}
            </button>
          </form>
        ) : (
          /* FORMULARIO DE CÓDIGO */
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Código de Seguridad</label>
              <input 
                type="text" 
                value={token}
                // .trim() elimina espacios al principio o final si copian mal
                onChange={(e) => setToken(e.target.value.trim())}
                className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-center text-xl font-mono tracking-wider"
                placeholder="Copia el código aquí"
                required
              />
            </div>
            <button 
              disabled={loading} 
              className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 shadow-lg hover:scale-[1.02] active:scale-95"
            >
              {loading ? "Verificando..." : "Verificar Código"}
            </button>
            <button 
              type="button"
              onClick={() => setStep("email")}
              className="w-full text-sm text-gray-500 hover:text-black underline transition-colors"
            >
              ¿No llegó? Intentar de nuevo con otro correo
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-sm">
          <Link href="/login" className="text-gray-500 hover:text-black font-bold transition-colors">
            ← Volver al Login
          </Link>
        </div>
      </div>
    </div>
  );
}