"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Opcional: Instala 'canvas-confetti' para fuegos artificiales (npm install canvas-confetti @types/canvas-confetti)
import confetti from "canvas-confetti"; 

export default function WebPayFinalPage() {
  const searchParams = useSearchParams();
  // WebPay suele devolver el token o status en la URL final dependiendo de tu configuración
  // Pero aquí asumiremos que llegamos tras una confirmación exitosa.
  
  useEffect(() => {
    // Lanzar confeti al cargar la página (Efecto WOW)
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#f97316', '#000000'] // Naranja y Negro (Tus colores)
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#f97316', '#000000']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
    
    toast.success("¡Pago procesado correctamente!");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* CABECERA VERDE ÉXITO */}
        <div className="bg-green-500 p-10 text-center text-white">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-black mb-2">¡Pago Exitoso!</h1>
          <p className="opacity-90 font-medium">Tu pedido ha sido confirmado.</p>
        </div>

        {/* CUERPO DEL RECIBO */}
        <div className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">Comprobante de Pago</p>
            <p className="text-gray-400 text-xs">Te hemos enviado un correo con los detalles.</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 space-y-3 border border-gray-100 border-dashed">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Estado</span>
              <span className="font-bold text-green-600 flex items-center gap-1">
                ● Aprobado
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Método</span>
              <span className="font-bold text-gray-900">WebPay Plus</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-black">
              <span>Total Pagado</span>
              {/* Aquí podrías leer el monto de los params si los pasaste */}
              <span>Confirmado</span> 
            </div>
          </div>

          <div className="space-y-3">
            <Link 
              href="/perfil" 
              className="block w-full text-center bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg"
            >
              Ver Mi Pedido
            </Link>
            <Link 
              href="/" 
              className="block w-full text-center text-gray-500 font-bold hover:text-black py-2"
            >
              Volver a la Tienda
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}