"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react'; // useRef para evitar doble llamada en React 18+
import { useCart } from "@/context/CartContext"; // Importamos el contexto

export default function WebPayReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart(); // Hook para limpiar carrito
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Ref para evitar que el useEffect se dispare dos veces en modo desarrollo (React.StrictMode)
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return; // Si ya procesamos, salimos
    processed.current = true;

    const processWebPayReturn = async () => {
      try {
        const token_ws = searchParams.get('token_ws');
        
        // Manejo de pagos anulados por el usuario (TBK_TOKEN es lo que envía Transbank cuando se aborta)
        const tbk_token = searchParams.get('TBK_TOKEN');
        if (tbk_token && !token_ws) {
            throw new Error("El pago fue anulado por el usuario.");
        }

        if (!token_ws) {
          throw new Error('Token no proporcionado');
        }

        // 1. Confirmar transacción SOLAMENTE llamando a tu API (Lógica segura)
        const response = await fetch('/api/webpay/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: token_ws }),
        });

        const data = await response.json();

        if (data.error) throw new Error(data.error);

        // 2. Manejar el resultado
        if (data.status === 'AUTHORIZED') {
          // ÉXITO: Limpiamos el carrito del localStorage
          clearCart();
          // Redirigimos a la página de éxito
          router.push('/gracias?webpay=success');
        } else {
          // FALLO: Redirigimos al carrito para que intente de nuevo
          router.push('/carrito?webpay=failed');
        }

      } catch (error: any) {
        console.error('Error procesando retorno WebPay:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    processWebPayReturn();
  }, [searchParams, router, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-900 font-medium">Verificando tu pago...</p>
          <p className="text-sm text-gray-500 mt-2">Estamos confirmando la transacción con el banco.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-lg">
          <div className="text-red-500 text-5xl mb-4">✕</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">No pudimos procesar el pago</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => router.push('/carrito')}
            className="w-full bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
          >
            Volver al Carrito
          </button>
        </div>
      </div>
    );
  }

  return null;
}